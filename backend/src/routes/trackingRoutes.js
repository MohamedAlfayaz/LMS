const express = require("express");
const Analytics = require("../models/Analytics");
const auth = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", auth, async (req, res) => {
  const { articleId, duration } = req.body;

  try {
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
    console.error("Tracking error:", err);
    res.status(500).json({ message: "Tracking failed" });
  }
});


module.exports = router;
