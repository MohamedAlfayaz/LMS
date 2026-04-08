require("dotenv").config();

const express = require("express");
const cors = require("cors");
const path = require("path");
const fs = require("fs");
const bcrypt = require("bcryptjs");

const connectDB = require("./config/db");
const User = require("./models/User");

const app = express();
const PORT = process.env.PORT || 5000;

/* ------------------ DATABASE ------------------ */
connectDB();

/* ------------------ CREATE DEFAULT ADMIN ------------------ */
const createAdmin = async () => {
  try {
    const existing = await User.findOne({ role: "admin" });

    if (!existing) {
      const hashed = await bcrypt.hash("admin123", 10);

      await User.create({
        name: "Admin",
        email: "admin@gmail.com",
        password: hashed,
        role: "admin",
      });

      console.log("👑 Default Admin Created");
    } else {
      console.log("✅ Admin already exists");
    }
  } catch (err) {
    console.error("Admin creation error:", err);
  }
};

/* ------------------ ENSURE UPLOADS FOLDER EXISTS ------------------ */
const uploadsPath = path.join(__dirname, "uploads");

if (!fs.existsSync(uploadsPath)) {
  fs.mkdirSync(uploadsPath);
  console.log("📁 uploads folder created");
}

/* ------------------ MIDDLEWARE ------------------ */

// CORS
const allowedOrigins = process.env.CLIENT_URL
  ? process.env.CLIENT_URL.split(",")
  : [];

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow no-origin (Postman, curl)
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(
        new Error(`CORS blocked: ${origin} not allowed`)
      );
    },
    credentials: true,
  })
);

app.options("*", cors());

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

// 🔥 ADD THIS (ADMIN ROUTES)
app.use("/api/admin", require("./routes/adminRoutes"));

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
app.listen(PORT, async () => {
  console.log(`🚀 Server running on port ${PORT}`);

  // 🔥 Ensure admin exists after server starts
  await createAdmin();
});