const express = require("express");
const Article = require("../models/Article");
const auth = require("../middleware/authMiddleware");
const role = require("../middleware/roleMiddleware");
const upload = require("../middleware/upload");

const router = express.Router();

router.post(
  "/upload",
  upload.single("file"),
  (req, res) => {
    try {
      console.log("File received:", req.file);

      if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
      }

      res.json({
        fileUrl: `http://localhost:5000/uploads/${req.file.filename}`,
      });
    } catch (err) {
      console.error("Upload error FULL:", err);
      res.status(500).json({ message: err.message });
    }
  }
);


// Create
router.post("/", auth, role("teacher"), async (req, res) => {
  const article = await Article.create({
    ...req.body,
    createdBy: req.user.id,
  });
  res.json(article);
});

// Get All
router.get("/", auth, async (req, res) => {
  const articles = await Article.find();
  res.json(articles);
});

// GET single article by ID
router.get("/:id", auth, async (req, res) => {
  try {
    const article = await Article.findById(req.params.id);

    if (!article) {
      return res.status(404).json({ message: "Article not found" });
    }

    res.json(article);
  } catch (err) {
    console.error("Fetch article by ID failed:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// Update
router.put("/:id", auth, role("teacher"), async (req, res) => {
  const updated = await Article.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );
  res.json(updated);
});

// Delete
router.delete("/:id", auth, role("teacher"), async (req, res) => {
  await Article.findByIdAndDelete(req.params.id);
  res.json({ message: "Deleted" });
});

module.exports = router;
