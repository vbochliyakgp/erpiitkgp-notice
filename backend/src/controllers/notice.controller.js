const Notice = require("../models/ notice.model");
const Joi = require("joi");
const { withCache } = require("../utils/nodecache");

// Validation schemas
const getSchema = Joi.object({
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).default(10),
  sort_by: Joi.string()
    .valid("date_generated", "company", "type", "subject")
    .default("date_generated"),
  order: Joi.string().valid("asc", "desc").default("desc"),
  type: Joi.string(),
  subject: Joi.string(),
  company: Joi.string(),
  from_date: Joi.date().iso(),
  to_date: Joi.date().iso(),
});

const searchSchema = Joi.object({
  q: Joi.string().min(1).required(),
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).default(10),
});

// GET /api/notices
const getNoticesFunction = async (req, res, next) => {
  try {
    const { error, value } = getSchema.validate(req.query);
    if (error) return res.status(400).json({ error: error.details[0].message });

    const {
      page,
      limit,
      sort_by,
      order,
      type,
      subject,
      company,
      from_date,
      to_date,
    } = value;
    const filter = {};
    if (type) filter.type = new RegExp(`^${type}$`, "i");
    if (subject) filter.subject = new RegExp(`^${subject}$`, "i");
    if (company) filter.company = new RegExp(`^${company}$`, "i");
    if (from_date || to_date) {
      filter.date_generated = {};
      if (from_date) filter.date_generated.$gte = from_date;
      if (to_date) filter.date_generated.$lte = to_date;
    }

    const [total, data] = await Promise.all([
      Notice.countDocuments(filter),
      Notice.find(filter)
        .sort({ [sort_by]: order === "asc" ? 1 : -1 })
        .skip((page - 1) * limit)
        .limit(limit),
    ]);

    res.json({ total, page, limit, data });
  } catch (err) {
    next(err);
  }
};

// GET /api/notices/search
const searchNoticesFunction = async (req, res, next) => {
  try {
    const { error, value } = searchSchema.validate(req.query);
    if (error) return res.status(400).json({ error: error.details[0].message });

    const { q, page, limit } = value;
    const filter = { $text: { $search: q } };

    const [total, data] = await Promise.all([
      Notice.countDocuments(filter),
      Notice.find(filter, { score: { $meta: "textScore" } })
        .sort({ score: { $meta: "textScore" } })
        .skip((page - 1) * limit)
        .limit(limit),
    ]);

    res.json({ total, page, limit, data });
  } catch (err) {
    next(err);
  }
};

// GET /api/distinct-notice-types
const getDistinctNoticeFieldsFunction = async (req, res, next) => {
  try {
    const now = new Date();

    const WEIGHT_CONFIG = [
      { days: 1, weight: 10 }, // Last 24 hours: 10x
      { days: 3, weight: 8 }, // Last 3 days: 8x
      { days: 7, weight: 6 }, // Last week: 6x
      { days: 14, weight: 4 }, // Last 2 weeks: 4x
      { days: 30, weight: 2.5 }, // Last month: 2.5x
      { days: 60, weight: 1.8 }, // Last 2 months: 1.8x
      { days: 90, weight: 1.3 }, // Last 3 months: 1.3x
      { days: 365, weight: 1.1 }, // Last year: 1.1x
    ];

    // Helper function to create weight calculation pipeline
    const createWeightCalculation = () => {
      const branches = WEIGHT_CONFIG.map((config) => ({
        case: {
          $gte: [
            "$date_generated",
            new Date(now.getTime() - config.days * 24 * 60 * 60 * 1000),
          ],
        },
        then: config.weight,
      }));

      return {
        $sum: {
          $switch: {
            branches: branches,
            default: 1, // Base weight for entries older than 1 year
          },
        },
      };
    };

    const result = await Notice.aggregate([
      {
        $facet: {
          types: [
            {
              $group: {
                _id: { $toUpper: "$type" },
                count: { $sum: 1 },
                weightedScore: createWeightCalculation(),
                variations: {
                  $push: {
                    value: "$type",
                    count: 1,
                  },
                },
              },
            },
            {
              $addFields: {
                mostCommon: {
                  $arrayElemAt: [
                    {
                      $map: {
                        input: {
                          $setUnion: [
                            {
                              $map: {
                                input: "$variations",
                                as: "v",
                                in: "$$v.value",
                              },
                            },
                          ],
                        },
                        as: "variation",
                        in: {
                          value: "$$variation",
                          count: {
                            $size: {
                              $filter: {
                                input: "$variations",
                                cond: { $eq: ["$$this.value", "$$variation"] },
                              },
                            },
                          },
                        },
                      },
                    },
                    0,
                  ],
                },
              },
            },
            { $sort: { weightedScore: -1, count: -1 } },
          ],
          subjects: [
            {
              $group: {
                _id: { $toLower: "$subject" },
                count: { $sum: 1 },
                weightedScore: createWeightCalculation(),
                original: { $first: "$subject" },
              },
            },
            { $sort: { weightedScore: -1, count: -1 } },
          ],
          companies: [
            {
              $group: {
                _id: { $toLower: "$company" },
                count: { $sum: 1 },
                weightedScore: createWeightCalculation(),
                original: { $first: "$company" },
              },
            },
            { $sort: { weightedScore: -1, count: -1 } },
          ],
        },
      },
    ]);

    const [data] = result;

    res.json({
      types: data.types.map((item) => [item._id, item.count]),
      subjects: data.subjects.map((item) => [item.original, item.count]),
      companies: data.companies.map((item) => [item.original, item.count]),
    });
  } catch (error) {
    next(new Error(`Failed to get distinct fields: ${error.message}`));
  }
};

exports.getNotices = withCache(
  require("../utils/nodecache").caches.notices,
  "notices"
)(getNoticesFunction);

exports.searchNotices = withCache(
  require("../utils/nodecache").caches.search,
  "search"
)(searchNoticesFunction);

exports.getDistinctNoticeFields = withCache(
  require("../utils/nodecache").caches.filters,
  "filters"
)(getDistinctNoticeFieldsFunction);
