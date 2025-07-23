const mongoose = require("mongoose");

const ContactSchema = new mongoose.Schema({
  name: { type: String, required: true, minlength: 2 },
  email: { type: String, required: true, match: /.+\@.+\..+/ },
  phone: { type: String, required: true, match: /^\+?\d{7,15}$/ },
  message: { type: String, required: true, minlength: 10 },
  created_at: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Contact", ContactSchema);
