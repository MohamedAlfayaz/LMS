const mongoose = require("mongoose");

const articleSchema = new mongoose.Schema({
  title: String,
  category: String,
  contentBlocks: [
    {
      type: { type: String },
      value: String,
    },
  ],
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
}, { timestamps: true });

module.exports = mongoose.model("Article", articleSchema);
