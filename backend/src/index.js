require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const cors = require("cors");

const noticeCtrl = require("./controllers/notice.controller");
const contactCtrl = require("./controllers/contact.controller");
const syncJob = require("./jobs/syncNotices.job");

const app = express();

// Security middleware
app.use(helmet());
app.use(
  cors({
    origin: true,
    credentials: true,
    optionsSuccessStatus: 200,
  })
);

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: "Too many requests",
});
app.use("/api/", limiter);

// Body parsing with limits
app.use(express.json({ limit: ".1mb" }));
app.use(express.urlencoded({ extended: true, limit: ".1mb" }));

// Logging middleware (production-safe)
app.use((req, res, next) => {
  console.log("Request Method:", req.method, "URL:", req.url,"params:", req.params);
  if (process.env.NODE_ENV !== "production") {
    console.log("Request Body:", req.body);
  }
  res.on("finish", () => {
    console.log("Response Status:", res.statusCode);
  });
  next();
});

// Routes
app.get("/api/notices", noticeCtrl.getNotices);
app.get("/api/notices/search", noticeCtrl.searchNotices);
app.get("/api/distinct-notice-types", noticeCtrl.getDistinctNoticeFields);
app.get("/api/contacts", contactCtrl.getContacts);
app.post("/api/contacts", contactCtrl.createContact);

app.get("/health", (req, res) => {
  res.status(200).json({
    status: "OK",
    message: "Server is running",
    timestamp: new Date().toISOString(),
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);

  if (process.env.NODE_ENV === "production") {
    res.status(500).json({
      error: "Internal server error",
      message: "Something went wrong",
    });
  } else {
    res.status(500).json({
      error: err.message,
      stack: err.stack,
    });
  }
});

// Database connection
mongoose
  .connect(process.env.MONGO_URI, {
    maxPoolSize: 10,
  })
  .then(() => {
    console.log("Connected to MongoDB");
    console.log("Starting sync job");
    syncJob();
    setInterval(syncJob, 10 * 60 * 1000);
  })
  .catch((err) => console.error("DB connect error................:", err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server on port ${PORT}`));
