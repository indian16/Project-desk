// backend/models/StudentForm3.js
const mongoose = require("mongoose");

const weekSchema = new mongoose.Schema({
  weekNumber: { type: Number, required: true },

  functionality: String,

  progress: {
    type: Number,
    min: 0,
    max: 100,
  },

  taskDetails: String,

  // mentor evaluation
  marks: {
    type: Number,
    min: 0,
    max: 10,
  },

  mentorRemark: String,

  mentorSignature: String, // mentor name or digital signature

  evaluatedAt: Date,
});

const studentForm3Schema = new mongoose.Schema(
  {
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
      required: true,
    },

    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },

    weeks: [weekSchema],
  },
  { timestamps: true }
);

studentForm3Schema.index(
  { studentId: 1, projectId: 1 },
  { unique: true }
);

module.exports = mongoose.model("StudentForm3", studentForm3Schema);