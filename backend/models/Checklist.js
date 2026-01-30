// models/Checklist.js
const mongoose = require("mongoose");

const checklistSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "Head", required: true }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Checklist", checklistSchema);