const express = require("express");
const Analytics = require("../models/Analytics");
const Article = require("../models/Article");
const auth = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", auth, async (req, res) => {
  try {
    const studentId = req.user.id;

    // Get all analytics records for this student
    const records = await Analytics.find({ studentId })
      .populate({
        path: "articleId",
        select: "title category"
      });

    // ✅ filter valid
    const validRecords = records.filter(r => r.articleId);

    // ✅ totals
    const totalRead = validRecords.length;

    const totalTime = validRecords.reduce(
      (sum, r) => sum + (r.duration || 0),
      0
    );

    // ✅ category
    const categoryMap = {};

    validRecords.forEach((r) => {
      const category = r.articleId.category || "Unknown";

      categoryMap[category] =
        (categoryMap[category] || 0) + (r.duration || 0);
    });



    const categoryLabels = Object.keys(categoryMap);
    const categoryTimeData = Object.values(categoryMap);

    let favoriteCategory = "-";
    let maxTime = 0;

    categoryLabels.forEach((cat) => {
      if (categoryMap[cat] > maxTime) {
        maxTime = categoryMap[cat];
        favoriteCategory = cat;
      }
    });

    // ✅ history
    const readingHistory = validRecords.map((r) => ({
      articleId: r.articleId._id,
      title: r.articleId.title,
      category: r.articleId.category,
      duration: r.duration,
    }));

    res.json({
      totalRead,
      totalTime,
      favoriteCategory,
      categoryLabels,
      categoryTimeData,
      readingHistory,
    });

  } catch (err) {
    console.error("Student analytics error:", err);
    res.status(500).json({ message: "Student analytics failed" });
  }
});

module.exports = router;
