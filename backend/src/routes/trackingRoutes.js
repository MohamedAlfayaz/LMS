const express = require("express");
const Analytics = require("../models/Analytics");
const auth = require("../middleware/authMiddleware");

const router = express.Router();

const Article = require("../models/Article");

router.post("/", auth, async (req, res) => {
  const { articleId, duration } = req.body;

  try {
    // 🔥 Check article exists
    const articleExists = await Article.exists({ _id: articleId });

    if (!articleExists) {
      return res.status(400).json({ message: "Invalid article" });
    }

    let record = await Analytics.findOne({
      articleId,
      studentId: req.user.id,
    });

    if (!record) {
      record = await Analytics.create({
        articleId,
        studentId: req.user.id,
        views: 1,
        duration,
      });
    } else {
      record.views += 1;
      record.duration += duration;
      await record.save();
    }

    res.json(record);

  } catch (err) {
    res.status(500).json({ message: "Tracking failed" });
  }
});

module.exports = router;
