const express = require("express");
const Highlight = require("../models/Highlight");
const auth = require("../middleware/authMiddleware");

const router = express.Router();

// Save Highlight
router.post("/", auth, async (req, res) => {
  const { articleId, text } = req.body;

  try {
    const highlight = await Highlight.create({
      studentId: req.user.id,
      articleId,
      text,
      timestamp: new Date(),
    });

    res.json(highlight);
  } catch (err) {
    res.status(500).json({ message: "Highlight save failed" });
  }
});

// Get My Highlights
router.get("/", auth, async (req, res) => {
  try {
    const highlights = await Highlight.find({
      studentId: req.user.id,
    }).populate("articleId", "title");

    // ✅ Only return valid highlights
    const valid = highlights.filter(h => h.articleId);

    res.json(valid);
    
router.get("/:id", auth, async (req, res) => {
  try {
    const article = await Article.findById(req.params.id);

    if (!article) {
      return res.status(404).json({ message: "Not found" });
    }

    res.json(article);
  } catch {
    res.status(500).json({ message: "Server error" });
  }
});
  } catch (err) {
    res.status(500).json({ message: "Fetch highlights failed" });
  }
});

// Delete Highlight
router.delete("/:id", auth, async (req, res) => {
  try {
    const deleted = await Highlight.findOneAndDelete({
      _id: req.params.id,
      studentId: req.user.id, // 🔥 important
    });

    if (!deleted) {
      return res.status(404).json({ message: "Highlight not found or unauthorized" });
    }

    res.json({ message: "Deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Delete failed" });
  }
});

module.exports = router;
