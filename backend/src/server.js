require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const fs = require("fs");

const connectDB = require("./config/db");

const app = express();
const PORT = process.env.PORT || 5000;

/* ------------------ DATABASE ------------------ */
connectDB();

/* ------------------ ENSURE UPLOADS FOLDER EXISTS ------------------ */
const uploadsPath = path.join(__dirname, "uploads");

if (!fs.existsSync(uploadsPath)) {
  fs.mkdirSync(uploadsPath);
  console.log("📁 uploads folder created");
}

/* ------------------ MIDDLEWARE ------------------ */

// CORS
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
  })
);

// Body Parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* ------------------ STATIC FILES ------------------ */
app.use("/uploads", express.static(uploadsPath));

/* ------------------ HEALTH CHECK ------------------ */
app.get("/", (req, res) => {
  res.status(200).json({
    message: "LMS API Running 🚀",
  });
});

/* ------------------ ROUTES ------------------ */
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/articles", require("./routes/articleRoutes"));
app.use("/api/tracking", require("./routes/trackingRoutes"));
app.use("/api/student/highlights", require("./routes/highlightRoutes"));
app.use("/api/analytics", require("./routes/analyticsRoutes"));
app.use("/api/analytics/student", require("./routes/studentAnalyticsRoutes"));

/* ------------------ 404 HANDLER ------------------ */
app.use((req, res) => {
  res.status(404).json({
    message: "Route Not Found",
  });
});

/* ------------------ GLOBAL ERROR HANDLER ------------------ */
app.use((err, req, res, next) => {
  console.error("🔥 Server Error:", err.stack);

  res.status(err.status || 500).json({
    message: err.message || "Internal Server Error",
  });
});

/* ------------------ START SERVER ------------------ */
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
