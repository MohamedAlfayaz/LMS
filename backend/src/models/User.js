const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: String,
    email: { type: String, unique: true },
    password: String,
    role: {
      type: String,
      enum: ["admin", "teacher", "student"],
      default: "student",
    },
    password: String,
    resetToken: String,
    resetTokenExpire: Date
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);