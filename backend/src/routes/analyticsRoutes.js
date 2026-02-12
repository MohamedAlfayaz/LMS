const express = require("express");
const Article = require("../models/Article");
const Analytics = require("../models/Analytics");
const auth = require("../middleware/authMiddleware");
const User = require("../models/User");


const router = express.Router();

router.get("/", auth, async (req, res) => {
  try {
    // 1️⃣ Total Articles
    const totalArticles = await Article.countDocuments();

    // 5️⃣ Total Students (Login Count)
    const totalStudents = await User.countDocuments({ role: "student" });


    // 2️⃣ Total Views
    // Count distinct student-article combinations
    const totalViewsAgg = await Analytics.aggregate([
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

    // 3️⃣ Category Distribution (FOR PIE CHART)
    const categoryAgg = await Article.aggregate([
      {
        $group: {
          _id: "$category",
          count: { $sum: 1 },
        },
      },
    ]);

    const categoryLabels = categoryAgg.map(item => item._id);
    const categoryData = categoryAgg.map(item => item.count);

    // 4️⃣ Top Category
    let topCategory = "-";
    let topCategoryCount = 0;

    if (categoryAgg.length > 0) {
      const sorted = categoryAgg.sort((a, b) => b.count - a.count);
      topCategory = sorted[0]._id;
      topCategoryCount = sorted[0].count;
    }

    // Views Per Article
    // Unique Student Views Per Article
    const viewsAgg = await Analytics.aggregate([
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


    // Student Progress
    // Student Progress (WITH REAL STUDENT NAMES)
    const studentAgg = await Analytics.aggregate([
      {
        $group: {
          _id: "$studentId",
          totalDuration: { $sum: "$duration" },
        },
      },
      {
        $lookup: {
          from: "users",           // collection name (IMPORTANT: lowercase plural)
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
    ]);

    const studentLabels = studentAgg.map(s => s.name);
    const studentData = studentAgg.map(s => s.totalDuration);

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
      }
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Analytics error" });
  }
});


module.exports = router;
