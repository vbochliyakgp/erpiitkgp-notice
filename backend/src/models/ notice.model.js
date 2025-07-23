const mongoose = require("mongoose");

const NoticeSchema = new mongoose.Schema({
  notification_number: { type: Number, unique: true, required: true },
  type: {
    type: String,
    required: true,
    enum: ["INTERNSHIP", "PLACEMENT", "OTHER"],
  },
  subject: { type: String, required: true },
  company: { type: String, required: true },
  title: { type: String, required: true, minlength: 5 },
  description: { type: String, required: true, minlength: 10 },
  date_generated: { type: Date, required: true },
  created_at: { type: Date, default: Date.now },
});

NoticeSchema.index({ type: 1, subject: 1 });
NoticeSchema.index({ company: 1, date_generated: -1 });
NoticeSchema.index({ title: "text", description: "text" });

module.exports = mongoose.model("Notice", NoticeSchema);
