const express = require("express");
const User = require("../models/User");
const Highlight = require("../models/Highlight");
const Analytics = require("../models/Analytics");
const protect = require("../middleware/authMiddleware");
const authorize = require("../middleware/roleMiddleware");

const router = express.Router();

/* ---------------- GET ALL USERS (ADMIN ONLY) ---------------- */
router.get("/users", protect, authorize("admin"), async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/* ---------------- CREATE USER (ADMIN ONLY) ---------------- */
router.post("/users", protect, authorize("admin"), async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // ❌ basic validation
    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields required" });
    }

    // ❌ check duplicate email
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

    res.status(201).json({
      message: "User created successfully",
      user,
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/* ---------------- UPDATE USER (ADMIN ONLY) ---------------- */
router.put(
  "/users/:id",
  protect,
  authorize("admin"),
  async (req, res) => {
    try {
      const { name, email, role } = req.body;

      const user = await User.findById(req.params.id);

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // ❌ prevent admin modification
      if (user.role === "admin") {
        return res.status(400).json({ message: "Cannot modify admin" });
      }

      // ❌ email duplicate check
      if (email) {
        const existing = await User.findOne({ email });

        if (
          existing &&
          existing._id.toString() !== user._id.toString()
        ) {
          return res
            .status(400)
            .json({ message: "Email already in use" });
        }

        user.email = email;
      }

      if (name) user.name = name;
      if (role) user.role = role;

      await user.save();

      res.json({
        message: "User updated successfully",
        user,
      });

    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }
);

/* ---------------- DELETE USER (ADMIN ONLY) ---------------- */

router.delete(
  "/users/:id",
  protect,
  authorize("admin"),
  async (req, res) => {
    try {
      const userId = req.params.id;

      const user = await User.findById(userId);

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // ❌ prevent deleting admin
      if (user.role === "admin") {
        return res.status(400).json({ message: "Cannot delete admin" });
      }

      // 🔥 DELETE ALL RELATED DATA
      await Promise.all([
        Highlight.deleteMany({ studentId: userId }),
        Analytics.deleteMany({ studentId: userId }),
        user.deleteOne(),
      ]);

      res.json({ message: "User + related data deleted successfully" });

    } catch (err) {
      console.error("Delete user error:", err);
      res.status(500).json({ message: err.message });
    }
  }
);

module.exports = router;