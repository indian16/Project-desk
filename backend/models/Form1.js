const mongoose = require("mongoose");
const { Schema } = mongoose;

// ---------------- Sub-schemas ----------------

const toolSchema = new Schema({
  name: String,
  version: String,
  type: String, // software | hardware | cloud
  purpose: String,
});

const moduleSchema = new Schema({
  name: String,
  functionality: String,
});

const teamMemberSchema = new Schema({
  name: String,
  mobile: String,
  expertise: String,
  role: String, // Team Lead | Member
});

// ---------------- Main Form1 Schema ----------------

const form1Schema = new Schema(
  {
    // Dynamic reference (AssignedProject / ProjectIdea)
    projectId: {
      type: Schema.Types.ObjectId,
      required: true,
      refPath: "projectModel",
    },

    projectModel: {
      type: String,
      required: true,
      enum: ["AssignedProject", "ProjectIdea"],
    },

    // Team Lead (owner of the form)
    studentId: {
      type: Schema.Types.ObjectId,
      ref: "Student",
      required: true,
    },

    // ---------------- Form Fields ----------------
    branch: String,
    section: String,
    group: String,
    title: String,
    projectTrack: [String],
    introduction: String,

    toolsTechnologies: [toolSchema],
    proposedModules: [moduleSchema],
    teamMembers: [teamMemberSchema],

    mentorName: String,
    labCoordinatorName: String,

    // ---------------- Submission Flow ----------------
    submissionStage: {
      type: String,
      enum: ["DRAFT", "TEAM_SUBMITTED", "MENTOR_SUBMITTED", "HEAD_SUBMITTED"],
      default: "DRAFT",
      index: true,
    },

    submittedTimeline: {
      team: { type: Date },
      mentor: { type: Date },
      head: { type: Date },
    },

    // ---------------- Audit Trail ----------------
    lastEditedBy: {
      type: Schema.Types.ObjectId,
      ref: "Student",
    },

    editHistory: [
      {
        editedBy: { type: Schema.Types.ObjectId, ref: "Student" },
        editedAt: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true }
);

// Helpful index (optional but recommended)
form1Schema.index({ projectId: 1, submissionStage: 1 });

const Form1 = mongoose.model("Form1", form1Schema);
module.exports = Form1;
