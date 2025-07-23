const Contact = require("../models/contact.model");
const Joi = require("joi");

const contactSchema = Joi.object({
  name: Joi.string().min(2).required(),
  email: Joi.string().email().required(),
  phone: Joi.string()
    .pattern(/^\+?\d{7,15}$/)
    .required(),
  message: Joi.string().min(10).required(),
});

// GET /api/contacts
exports.getContacts = async (req, res, next) => {
  const page = Math.max(1, parseInt(req.query.page) || 1);
  const limit = Math.max(1, parseInt(req.query.limit) || 10);
  const { secretkey } = req.body;
  if (secretkey !== process.env.SECRET_KEY) {
    return res.status(403).json({ error: "Forbidden" });
  }
  try {
    const [total, data] = await Promise.all([
      Contact.countDocuments(),
      Contact.find()
        .sort({ created_at: -1 })
        .skip((page - 1) * limit)
        .limit(limit),
    ]);
    res.json({ total, page, limit, data });
  } catch (err) {
    next(err);
  }
};

// POST /api/contacts
exports.createContact = async (req, res, next) => {
  try {
    const { error, value } = contactSchema.validate(req.body);
    if (error) return res.status(400).json({ error: error.details[0].message });

    const contact = await Contact.create(value);
    res.status(201).json(contact);
  } catch (err) {
    next(err);
  }
};
