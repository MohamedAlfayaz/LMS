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

    res.json(highlights);
  } catch (err) {
    res.status(500).json({ message: "Fetch highlights failed" });
  }
});

// Delete Highlight
router.delete("/:id", auth, async (req, res) => {
  try {
    await Highlight.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Delete failed" });
  }
});

module.exports = router;
