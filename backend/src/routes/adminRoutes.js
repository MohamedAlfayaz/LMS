const express = require("express");
const User = require("../models/User");
const Highlight = require("../models/Highlight");
const Analytics = require("../models/Analytics");
const protect = require("../middleware/authMiddleware");
const authorize = require("../middleware/roleMiddleware");

const router = express.Router();

/* ---------------- GET ALL USERS (ADMIN ONLY) ---------------- */
router.get("/users", protect, authorize("admin", "teacher"), async (req, res) => {
  try {
    let users;

    if (req.user.role === "teacher") {
      // 🔥 teacher sees ONLY students
      users = await User.find({ role: "student" }).select("-password");
    } else {
      // admin sees all
      users = await User.find().select("-password");
    }

    res.json(users);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/* ---------------- CREATE USER (ADMIN ONLY) ---------------- */
router.post("/users", protect, authorize("admin", "teacher"), async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // ❌ teacher cannot create admin/teacher
    if (req.user.role === "teacher" && role !== "student") {
      return res.status(403).json({
        message: "Teacher can only create students",
      });
    }

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const user = await User.create({
      name,
      email,
      password,
      role: role || "student",
    });

    res.status(201).json({ message: "User created", user });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/* ---------------- UPDATE USER (ADMIN ONLY) ---------------- */
router.put("/users/:id", protect, authorize("admin", "teacher"), async (req, res) => {
  try {
    const { name, email, role } = req.body;

    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    // ❌ teacher restrictions
    if (req.user.role === "teacher") {
      if (user.role !== "student") {
        return res.status(403).json({
          message: "Teacher can only edit students",
        });
      }
    }

    // ❌ admin cannot modify admin (keep your rule)
    if (user.role === "admin") {
      return res.status(400).json({ message: "Cannot modify admin" });
    }

    // email check
    if (email) {
      const existing = await User.findOne({ email });
      if (existing && existing._id.toString() !== user._id.toString()) {
        return res.status(400).json({ message: "Email already in use" });
      }
      user.email = email;
    }

    if (name) user.name = name;
    if (role) {
      // ❌ teacher cannot change roles
      if (req.user.role === "teacher") {
        return res.status(403).json({
          message: "Teacher cannot change role",
        });
      }
      user.role = role;
    }

    await user.save();

    res.json({ message: "User updated", user });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/* ---------------- DELETE USER (ADMIN ONLY) ---------------- */
router.delete("/users/:id", protect, authorize("admin", "teacher"), async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) return res.status(404).json({ message: "User not found" });

    // ❌ teacher restriction
    if (req.user.role === "teacher" && user.role !== "student") {
      return res.status(403).json({
        message: "Teacher can only delete students",
      });
    }

    // ❌ prevent deleting admin
    if (user.role === "admin") {
      return res.status(400).json({ message: "Cannot delete admin" });
    }

    await Promise.all([
      Highlight.deleteMany({ studentId: user._id }),
      Analytics.deleteMany({ studentId: user._id }),
      user.deleteOne(),
    ]);

    res.json({ message: "User deleted" });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;