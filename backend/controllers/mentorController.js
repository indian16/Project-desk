const mongoose = require("mongoose");
const AssignedProject = require("../models/AssignedProject");
const Document = require("../models/Document");
const ProjectIdea = require("../models/ProjectIdea");

// ====================== GET MENTOR PROJECT ======================

const getMentorProject = async (req, res) => {
  try {
    const mentorId = req.user.id;

    const project = await AssignedProject.findOne({ selectedMentor: mentorId })
      .populate("projectId") // details from ProjectBank
      .populate("student", "name email") // student details
      .populate("teamMembers", "name email") // team members details
      .populate("selectedMentor", "name email"); // mentor details

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "No project assigned to you yet.",
      });
    }

    res.json({
      success: true,
      project,
    });
  } catch (error) {
    console.error("Error fetching mentor project:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// ====================== REVIEW PROJECT (APPROVE/REJECT) ======================
const reviewAssignedProject = async (req, res) => {
  try {
    const mentorId = req.user.id;
    const { action } = req.body; // "approve" or "reject"

    if (!["approve", "reject"].includes(action)) {
      return res.status(400).json({ success: false, message: "Invalid action" });
    }

    // Find the pending project assigned to this mentor
    const project = await AssignedProject.findOne({
      selectedMentor: mentorId,
      status: "pending",
    });

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "No pending project assigned to you.",
      });
    }

    // Update status and approved mentor
    project.status = action;
    project.approvedMentor = action === "approve" ? mentorId : null;

    await project.save();

    // Populate related fields before sending response
    const updatedProject = await AssignedProject.findById(project._id)
      .populate("projectId") // ProjectBank details
      .populate("student", "name email") // student details
      .populate("teamMembers", "name email") // team members
      .populate("selectedMentor", "name email") // selected mentor
      .populate("approvedMentor", "name email"); // approved mentor

    res.json({
      success: true,
      message: `Project ${action}d successfully`,
      project: updatedProject,
    });
  } catch (error) {
    console.error("Error reviewing project:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// 📌 Get all documents for students
const getDocuments = async (req, res) => {
  try {
    const docs = await Document.find().sort({ createdAt: -1 });
    res.status(200).json(docs);
  } catch (error) {
    console.error("Get Documents Error:", error);
    res.status(500).json({ message: "Server error while fetching documents" });
  }
};

// 📌 Download a document by ID for students
const downloadDocument = async (req, res) => {
  try {
    const doc = await Document.findById(req.params.id);
    if (!doc) return res.status(404).json({ message: "Document not found" }); 
    res.download(doc.filePath, doc.fileName);
  } catch (error) {
    console.error("Download Document Error:", error);
    res.status(500).json({ message: "Server error while downloading document" });
  }
};

const updateForm3MentorMarks = async (req, res) => {
  try {
    const { formId, weekNumber, mentorMarks } = req.body;

    if (!formId || weekNumber == null || mentorMarks == null) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Find the Form3 by ID
    const form = await Form3.findById(formId);
    if (!form) {
      return res.status(404).json({ message: "Form3 not found" });
    }

    // Update the mentor marks for the specific week
    const weekIndex = form.weeks.findIndex(w => w.weekNumber === weekNumber);
    if (weekIndex === -1) {
      return res.status(404).json({ message: "Week not found in Form3" });
    }

    form.weeks[weekIndex].mentorMarks = mentorMarks;

    // Save the updated form
    await form.save();

    res.status(200).json({
      message: `Mentor marks updated for week ${weekNumber}`,
      form
    });
  } catch (err) {
    console.error("Error updating mentor marks:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

const getAssignedForms = async (req, res) => {
  try {
    const mentorId = req.user.id; // logged-in mentor

    // Step 1: find all projects assigned to this mentor
    const projects = await ProjectIdea.find({ mentor: mentorId }, "_id");

    const projectIds = projects.map(p => p._id);

    // Step 2: find all Form3 submissions for those projects
    const forms = await Form3.find({ projectId: { $in: projectIds } })
      .populate("projectId studentId"); // optional for frontend display

    res.status(200).json({ forms });
  } catch (err) {
    console.error("Error fetching assigned Form3 submissions:", err);
    res.status(500).json({ error: "Server error fetching Form3" });
  }
};

// ================= GET MENTOR IDEA PROJECTS =================
const getMentorIdeaProjects = async (req, res) => {
  try {
    const mentorId = req.user.id;

    const projects = await ProjectIdea.find({ mentor: mentorId })
      .populate("teamMembers", "name email") // populate team members
      .populate("mentor", "name email")      // populate mentor details
      .populate("teamLead.id", "name email"); // populate team lead

    if (!projects || projects.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No idea projects assigned to you yet.",
      });
    }

    res.json({
      success: true,
      projects,
    });
  } catch (error) {
    console.error("Error fetching mentor idea projects:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};
// ====================== REVIEW IDEA PROJECT (APPROVE/REJECT) ======================
const reviewIdeaProject = async (req, res) => {
  try {
    const { id } = req.params;
    const { action, feedback } = req.body; // optional feedback

    if (!["approve", "reject"].includes(action)) {
      return res.status(400).json({ success: false, message: "Invalid action" });
    }

    const project = await ProjectIdea.findById(id);

    if (!project || project.status !== "interview_passed") {
      return res.status(400).json({
        success: false,
        message: "Project cannot be reviewed by mentor yet",
      });
    }

    project.status = action === "approve" ? "approved_by_mentor" : "rejected_by_mentor";

    project.feedbacks.push({
      mentor: req.user.id,
      feedback: feedback || "",
    });

    await project.save();

    const updatedProject = await ProjectIdea.findById(id)
      .populate("teamMembers", "name email")
      .populate("teamLead.id", "name email")
      .populate("mentor", "name email");

    res.json({
      success: true,
      message: `Project ${action}d successfully`,
      project: updatedProject,
    });
  } catch (err) {
    console.error("Error reviewing idea project:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
module.exports = { 
  getMentorProject, 
  reviewAssignedProject,
  getDocuments,
  downloadDocument,
  updateForm3MentorMarks,
  getAssignedForms,
  getMentorIdeaProjects,
  reviewIdeaProject
};