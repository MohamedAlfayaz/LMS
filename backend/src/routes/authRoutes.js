const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

const User = require("../models/User");
const protect = require("../middleware/authMiddleware");
const authorize = require("../middleware/roleMiddleware");

const router = express.Router();


/* ---------- REGISTER (ONLY STUDENT) ---------- */
router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const hashed = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashed,
      role: "student",
    });

    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/* ---------- LOGIN ---------- */
router.post("/login", async (req, res) => {
  const { name, email, password } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    return res.status(400).json({ message: "Invalid credentials" });
  }

  const match = await bcrypt.compare(password, user.password);

  if (!match) {
    return res.status(400).json({ message: "Invalid credentials" });
  }

  const token = jwt.sign(
    {
      id: user._id,
      role: user.role,
      username: user.name, // 👈 confirm this field
    },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  );

  res.json({ token });
});

/* ---------- ADMIN: CREATE USER ---------- */
router.post(
  "/create-user",
  protect,
  authorize("admin"),
  async (req, res) => {
    try {
      const { name, email, password, role } = req.body;

      if (!["teacher", "student"].includes(role)) {
        return res.status(400).json({ message: "Invalid role" });
      }

      const hashed = await bcrypt.hash(password, 10);

      const user = await User.create({
        name,
        email,
        password: hashed,
        role,
      });

      res.json(user);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }
);

/* ---------- TEACHER: CREATE STUDENT ---------- */
router.post(
  "/create-student",
  protect,
  authorize("teacher"),
  async (req, res) => {
    try {
      const { name, email, password } = req.body;

      const hashed = await bcrypt.hash(password, 10);

      const user = await User.create({
        name,
        email,
        password: hashed,
        role: "student",
      });

      res.json(user);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }
);

/* ---------------- FORGOT PASSWORD ---------------- */
router.post("/forgot-password", async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email required" });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // 🔥 generate token
    const token = crypto.randomBytes(32).toString("hex");

    user.resetToken = token;
    user.resetTokenExpire = Date.now() + 3600000; // 1 hour

    await user.save();

    const resetLink = `http://localhost:5173/reset-password/${token}`;

    // console.log("RESET LINK 👉", resetLink);

    // ✅ IMPORTANT (for frontend navigation)
    res.json({
      message: "Reset link generated",
      resetLink,
    });

  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

/* ---------------- RESET PASSWORD ---------------- */
router.post("/reset-password/:token", async (req, res) => {
  try {
    const { password } = req.body;
    const token = req.params.token;

    if (!password || password.length < 6) {
      return res.status(400).json({
        message: "Password must be at least 6 characters",
      });
    }

    const user = await User.findOne({
      resetToken: token,
      resetTokenExpire: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({
        message: "Invalid or expired token",
      });
    }

    // 🔐 hash password
    const hashed = await bcrypt.hash(password, 10);

    user.password = hashed;
    user.resetToken = undefined;
    user.resetTokenExpire = undefined;

    await user.save();

    res.json({ message: "Password reset successful" });

  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;