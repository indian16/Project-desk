// const mongoose = require("mongoose");
// const { Schema } = mongoose;

// const projectIdeaSchema = new Schema(
//   {
//     title: { type: String, required: true },
//     description: { type: String, required: true },
//     technology: { type: String, required: true },
//     teamMembers: [{ type: mongoose.Schema.Types.ObjectId, ref: "Student" }],
//     teamLead: {
//       id: { type: mongoose.Schema.Types.ObjectId, ref: "Student" },
//       name: String,
//       email: String,
//     },
//     academicYear: { type: String, required: true },
//     branch : { type: String, required: true },
//     section : { type: String, required: true },
//     group : { type: String, required: true },
//     selectedMentor1: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "Mentor",
//     },
    
//     selectedMentor2: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "Mentor",
//     },
    
//     selectedMentor3: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "Mentor",
//     },
    
//     confirmedMentor: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "Mentor",
//       default: null,
//     },
//     status: {
//       type: String,
//       enum: [
//         "pending",
//         "approved_by_head",
//         "rejected_by_head",
//         "interview_scheduled",
//         "interview_passed",
//         "interview_failed",
//         "rejected_by_mentor",
//         "approved_by_mentor",
//       ],
//       default: "pending",
//       required: true,
//     },
//     feedbacks: [
//       {
//         mentor: { type: mongoose.Schema.Types.ObjectId, ref: "Mentor" },
//         head: { type: mongoose.Schema.Types.ObjectId, ref: "Head" },
//         feedback: {type: String},
//       },
//     ],
//     // ✅ Simplified checklist (created by Head, uploaded by Students)
//     checklist: [
//       {
//         title: { type: String, required: true },
//         studentUploads: [
//           {
//             student: { type: mongoose.Schema.Types.ObjectId, ref: "Student" },
//             fileUrl: { type: String },
//             uploadedAt: { type: Date, default: Date.now },
//             status: {
//               type: String,
//               enum: ["pending", "submitted"],
//               default: "pending",
//             },
//           },
//         ],
//       },
//     ],
//   },
//   { timestamps: true }
// );

// const ProjectIdea = mongoose.model("ProjectIdea", projectIdeaSchema);

// module.exports = ProjectIdea;




const mongoose = require("mongoose");
const { Schema } = mongoose;

const projectIdeaSchema = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    technology: { type: String, required: true },
    teamMembers: [{ type: mongoose.Schema.Types.ObjectId, ref: "Student" }],
    teamLead: {
      id: { type: mongoose.Schema.Types.ObjectId, ref: "Student" },
      name: String,
      email: String,
    },
    academicYear: { type: String, required: true },
    branch : { type: String, required: true },
    section : { type: String, required: true },
    group : { type: String, required: true },

    selectedMentor1: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Mentor",
    },
    
    selectedMentor2: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Mentor",
    },
    
    selectedMentor3: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Mentor",
    },
    
    confirmedMentor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Mentor",
      default: null,
    },
    rejectedMentors: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Mentor",
      },
    ],
    status: {
      type: String,
      enum: [
        "pending",
        "approved_by_head",
        "rejected_by_head",
        "interview_scheduled",
        "interview_passed",
        "interview_failed",
        "rejected_by_mentor",
        "approved_by_mentor",
      ],
      default: "pending",
      required: true,
    },
    feedbacks: [
      {
        mentor: { type: mongoose.Schema.Types.ObjectId, ref: "Mentor" },
        head: { type: mongoose.Schema.Types.ObjectId, ref: "Head" },
        feedback: {type: String},
      },
    ],
  },
  {
    timestamps: true,
  }
);

const ProjectIdea = mongoose.model("ProjectIdea", projectIdeaSchema);

module.exports = ProjectIdea;