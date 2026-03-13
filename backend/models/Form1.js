const mongoose = require("mongoose");
const { Schema } = mongoose;

// Sub-schemas
const toolSchema = new Schema({
  name: { type: String },
  version: { type: String },
  type: { type: String },
  purpose: { type: String },
});

const moduleSchema = new Schema({
  name: { type: String },
  functionality: { type: String },
});

const teamMemberSchema = new Schema({
  name: { type: String },
  mobile: { type: String },
  expertise: { type: String },
  role: { type: String },
});

// Main Form1 schema
const form1Schema = new Schema(
  {
    // Dynamic reference for AssignedProject or ProjectIdea
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

    studentId: {
      type: Schema.Types.ObjectId,
      ref: "Student",
      required: true,
    },

    branch: { type: String },
    section: { type: String },
    group: { type: String },
    title: { type: String },

    projectTrack: [{ type: String }],

    introduction: { type: String },

    toolsTechnologies: [toolSchema],

    proposedModules: [moduleSchema],

    teamMembers: [teamMemberSchema],

    // ⭐ Mentor fields
    mentorId: {
      type: Schema.Types.ObjectId,
      ref: "Mentor",   // assuming mentors are in User model
    },

    mentorName: { type: String },

    labCoordinatorName: { type: String },

    // ⭐ Mentor decision
status: {
  type: String,
  enum: ["pending", "approved_by_mentor", "rejected_by_mentor"],
  default: "pending",
},

mentorFeedback: {
  type: String,
},

approvedAt: {
  type: Date,
},

    // Optional audit info
    lastEditedBy: {
      type: Schema.Types.ObjectId,
      ref: "Student",
    },

    editHistory: [
      {
        editedBy: {
          type: Schema.Types.ObjectId,
          ref: "Student",
        },
        editedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  { timestamps: true }
);

const Form1 = mongoose.model("Form1", form1Schema);

module.exports = Form1;