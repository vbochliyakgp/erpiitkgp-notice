const axios = require("axios");
const xml2js = require("xml2js");
const Notice = require("../models/ notice.model");
const fs = require("fs");

function parseCustomDate(dateStr) {
  if (!dateStr || typeof dateStr !== "string") {
    console.log("Invalid date string, using current date");
    return new Date();
  }
  try {
    const [datePart, timePart = "00:00"] = dateStr.split(" ");
    const [day, month, year] = datePart.split("-").map(Number);
    const [hour, minute] = timePart.split(":").map(Number);
    return new Date(year, month - 1, day, hour, minute);
  } catch (error) {
    console.warn(`Failed to parse date: ${dateStr}, using current date`);
    return new Date();
  }
}

function parseAnchor(htmlAnchor) {
  if (typeof htmlAnchor !== "string") {
    return { title: null, text: "" };
  }

  const titleMatch = htmlAnchor.match(/\btitle=(["'])(.*?)\1/i);
  const title = titleMatch ? titleMatch[2] : null;
  const textMatch = htmlAnchor.match(/>([\s\S]*?)<\/a\s*>/i);
  let text = textMatch ? textMatch[1] : "";
  text = text.replace(/<[^>]+>/g, "").trim();
  return { title, text };
}

async function syncNotices() {
  try {
    const resp = await axios.get(process.env.NOTICES_API_URL, {
      withCredentials: true,
      headers: {
        Cookie: `${process.env.api_cookie}`,
      },
    });
    const xml = resp.data;
    // fs.writeFileSync("notices.xml", xml);
    // console.log("XML saved to notice.xml");
    // const xml = fs.readFileSync("../notice.xml", "utf-8");
    const parsed = await xml2js.parseStringPromise(xml, {
      explicitArray: false,
    });
    const rows = parsed.rows.row;
    const existingMax = await Notice.findOne()
      .sort({ notification_number: -1 })
      .select("notification_number");
    const startFrom = existingMax ? existingMax.notification_number + 1 : 0;
    const ops = [];

    for (const row of Array.isArray(rows) ? rows : [rows]) {
      const num = Number(row.cell[0]);
      if (num >= startFrom) {
        const dateStr = row.cell[6];
        const { title, text } = parseAnchor(row.cell[4]);
        ops.push({
          updateOne: {
            filter: { notification_number: num },
            update: {
              notification_number: num,
              type: row.cell[1],
              subject: row.cell[2],
              company: row.cell[3],
              title: title,
              description: text,
              date_generated: parseCustomDate(dateStr),
            },
            upsert: true,
          },
        });
      }
    }
    if (ops.length) {
      console.log("pushing new entries to database : ", ops.length);
    } else {
      console.log("No new entries to push");
    }
    if (ops.length) await Notice.bulkWrite(ops);
  } catch (err) {
    console.error("Sync error:", err);
  }
}

module.exports = syncNotices;
