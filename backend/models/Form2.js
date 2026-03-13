const  mongoose =  require("mongoose");

const form2Schema = new mongoose.Schema({
  projectId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    refPath: "projectType",
  },
  projectType: {
    type: String,
    required: true,
    enum: ["ProjectIdea", "AssignedProject"],
  },
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Student",
    required: true,
  },
  member: {
    type: String,
    required: true,
  },
  moduleName: {
    type: String,
    required: true,
  },
  functionalityName: {
    type: String,
    required: true,
  },
  softDeadline: {
    type: Date,
    required: true,
  },
  hardDeadline: {
    type: Date,
    required: true,
  },
  details: {
    type: String,
    required: true,
  },
  approvedByMentor: {
    type: Boolean,
    default: false,
  },
  approvedAt: {
    type: Date,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Form2", form2Schema);