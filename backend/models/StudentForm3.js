// backend/models/StudentForm3.js
const  mongoose =  require("mongoose");

const studentForm3Schema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: "Student", required: true },
  projectId: { type: mongoose.Schema.Types.ObjectId, required: true },

  weekNumber: { type: Number, required: true },

  functionality: String,
  progress: { type: Number, min: 0, max: 100 },
  taskDetails: String,

}, { timestamps: true });

studentForm3Schema.index(
  { studentId: 1, projectId: 1, weekNumber: 1 },
  { unique: true }
);

module.exports = mongoose.model("StudentForm3", studentForm3Schema);
