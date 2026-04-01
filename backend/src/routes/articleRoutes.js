const express = require("express");
const Article = require("../models/Article");
const auth = require("../middleware/authMiddleware");
const role = require("../middleware/roleMiddleware");
const upload = require("../middleware/upload");

const router = express.Router();

/* Upload */
router.post(
  "/upload",
  auth,
  role("teacher"),
  upload.single("file"),
  (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
      }

      const BASE_URL = process.env.BASE_URL || "http://localhost:5000";

      res.json({
        fileUrl: `${BASE_URL}/uploads/${req.file.filename}`,
      });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }
);

/* Create */
router.post("/", auth, role("teacher"), async (req, res) => {
  try {
    const { title, contentBlocks } = req.body;

    if (!title || !contentBlocks) {
      return res.status(400).json({ message: "Missing fields" });
    }

    const article = await Article.create({
      ...req.body,
      createdBy: req.user.id,
    });

    res.json(article);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/* Get All */
router.get("/", auth, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = 10;

    const articles = await Article.find()
      .skip((page - 1) * limit)
      .limit(limit);

    res.json(articles);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/* Get One */
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

/* Update */
router.put("/:id", auth, role("teacher"), async (req, res) => {
  try {
    const article = await Article.findById(req.params.id);

    if (!article) return res.status(404).json({ message: "Not found" });

    if (article.createdBy.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not allowed" });
    }

    const updated = await Article.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/* Delete */
router.delete("/:id", auth, role("teacher"), async (req, res) => {
  try {
    const article = await Article.findById(req.params.id);

    if (!article) return res.status(404).json({ message: "Not found" });

    if (article.createdBy.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not allowed" });
    }

    await article.deleteOne();

    res.json({ message: "Deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;