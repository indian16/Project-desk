// models/StudentChecklist.js
const mongoose = require("mongoose");

const studentChecklistSchema = new mongoose.Schema({
  student: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "Student", 
    required: true 
  },

  projectId: { 
    type: mongoose.Schema.Types.ObjectId, 
    required: true 
  }, // ProjectIdea or AssignedProject

  projectType: {
    type: String,
    enum: ["ProjectIdea", "AssignedProject"],
    required: true
  },
  checklistItem: {
    type: String,   
    required: true,
  },

  fileName: { type: String, required: true },
  filePath: { type: String, required: true },

  uploadedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("StudentChecklist", studentChecklistSchema);