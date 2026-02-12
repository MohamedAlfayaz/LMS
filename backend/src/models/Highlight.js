const mongoose = require("mongoose");

const highlightSchema = new mongoose.Schema({
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  articleId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Article",
  },
  text: String,
  timestamp: Date,
});

module.exports = mongoose.model("Highlight", highlightSchema);
