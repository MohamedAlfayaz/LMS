const express = require("express");
const Article = require("../models/Article");
const Analytics = require("../models/Analytics");
const auth = require("../middleware/authMiddleware");
const User = require("../models/User");
const mongoose = require("mongoose");

const router = express.Router();

router.get("/", auth, async (req, res) => {
  try {
    // ✅ 1. Total Articles
    const totalArticles = await Article.countDocuments({
      createdBy: req.user.id,
    });

    // ✅ 2. Total Students
    const totalStudents = await User.countDocuments({ role: "student" });

    // ✅ COMMON STAGE → FILTER ONLY VALID ARTICLES
    const validLookup = [
      {
        $lookup: {
          from: "articles",
          localField: "articleId",
          foreignField: "_id",
          as: "article",
        },
      },
      { $unwind: "$article" },

      // 🔒 FILTER BY TEACHER
      {
        $match: {
          "article.createdBy": new mongoose.Types.ObjectId(req.user.id),
        },
      },

      {
        $lookup: {
          from: "users",
          localField: "studentId",
          foreignField: "_id",
          as: "student",
        },
      },
      { $unwind: "$student" },
    ];

    // ✅ 3. Total Unique Views
    const totalViewsAgg = await Analytics.aggregate([
      ...validLookup,
      {
        $group: {
          _id: {
            articleId: "$articleId",
            studentId: "$studentId",
          },
        },
      },
      {
        $group: {
          _id: null,
          totalUniqueViews: { $sum: 1 },
        },
      },
    ]);

    const totalViews =
      totalViewsAgg.length > 0 ? totalViewsAgg[0].totalUniqueViews : 0;

    // ✅ 4. Category Distribution
    const categoryAgg = await Article.aggregate([
      {
        $match: {
          createdBy: new mongoose.Types.ObjectId(req.user.id),
        },
      },
      {
        $group: {
          _id: "$category",
          count: { $sum: 1 },
        },
      },
    ]);

    const categoryLabels = categoryAgg.map((item) => item._id);
    const categoryData = categoryAgg.map((item) => item.count);

    // ✅ 5. Top Category
    let topCategory = "-";
    let topCategoryCount = 0;

    if (categoryAgg.length > 0) {
      const top = categoryAgg.reduce((max, item) =>
        item.count > max.count ? item : max
      );
      topCategory = top._id;
      topCategoryCount = top.count;
    }

    // Views Per Article
    // Unique Student Views Per Article
    const viewsAgg = await Analytics.aggregate([
      ...validLookup,
      {
        $group: {
          _id: {
            articleId: "$articleId",
            studentId: "$studentId",
          },
        },
      },
      {
        $group: {
          _id: "$_id.articleId",
          uniqueStudents: { $sum: 1 },
        },
      },
      {
        $lookup: {
          from: "articles",
          localField: "_id",
          foreignField: "_id",
          as: "article",
        },
      },
      { $unwind: "$article" },
    ]);


    const viewsLabels = viewsAgg.map(v => v.article.title);
    const viewsData = viewsAgg.map(v => v.uniqueStudents);

    // ✅ 7. Student Progress (FILTER VALID ARTICLES)
    const studentAgg = await Analytics.aggregate([
      ...validLookup,
      {
        $group: {
          _id: "$studentId",
          totalDuration: { $sum: "$duration" },
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "_id",
          as: "student",
        },
      },
      { $unwind: "$student" },
      {
        $project: {
          _id: 0,
          name: "$student.name",
          totalDuration: 1,
        },
      },
      { $sort: { totalDuration: -1 } },
    ]);

    const studentLabels = studentAgg.map((s) => s.name);
    const studentData = studentAgg.map((s) => s.totalDuration);

    // ✅ FINAL RESPONSE
    res.json({
      summary: {
        totalArticles,
        totalViews,
        totalStudents,
        topCategory,
        topCategoryCount,
      },
      categoryDistribution: {
        labels: categoryLabels,
        data: categoryData,
      },
      viewsPerArticle: {
        labels: viewsLabels,
        data: viewsData,
      },
      studentProgress: {
        labels: studentLabels,
        data: studentData,
      },
    });
  } catch (err) {
    console.error("Analytics Error:", err);
    res.status(500).json({ message: "Analytics error" });
  }
});

module.exports = router;