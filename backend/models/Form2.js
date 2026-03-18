// models/Form2.js
const mongoose = require("mongoose");
const moduleSchema = new mongoose.Schema({
  moduleName: String,
  functionalityName: String,
  softDeadline: Date,
  hardDeadline: Date,
  details: String
});

const memberSchema = new mongoose.Schema({
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Student",
    required: true
  },
  member: String,
  modules: [moduleSchema],

  approvedByMentor: {
    type: Boolean,
    default: false
  },

  mentorName: String,   // mentor signature name
  approvedAt: Date      // date of approval
});

const form2Schema = new mongoose.Schema({
  projectId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Project",
    required: true,
    unique: true   // ⭐ ensures one document per project
  },
  projectType: String,
  members: [memberSchema]
}, { timestamps: true });

module.exports = mongoose.model("Form2", form2Schema);