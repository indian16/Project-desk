const mongoose = require("mongoose");
const AssignedProject = require("../models/AssignedProject");
const Document = require("../models/Document");
const ProjectIdea = require("../models/ProjectIdea");

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

const getMentorProject = async (req, res) => {
  try {
    const mentorId = req.user.id;

    const project = await AssignedProject.findOne({
      $or: [
        { selectedMentor: mentorId },
        { selectedMentor2: mentorId },
        { selectedMentor3: mentorId },
      ],
    })
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
    const { action, reason } = req.body;

    if (!["approve", "reject"].includes(action)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid action" });
    }

    if (action === "reject" && (!reason || reason.trim() === "")) {
      return res
        .status(400)
        .json({ success: false, message: "Rejection reason is required" });
    }

    const project = await AssignedProject.findOne({
      $or: [
        { selectedMentor: mentorId },
        { selectedMentor2: mentorId },
        { selectedMentor3: mentorId },
      ],
    });

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "No project assigned to you.",
      });
    }

    // ✅ VERY IMPORTANT FIX
    if (project.status !== "pending") {
      return res.status(400).json({
        success: false,
        message: "Project already approved by another mentor",
      });
    }

    project.status = action; // stays same as your DB
    project.approvedMentor = action === "approve" ? mentorId : null;
    project.rejectionReason = action === "reject" ? reason : null;

    await project.save();

    res.json({
      success: true,
      message: `Project ${action}d successfully`,
      project,
    });

  } catch (error) {
    console.error("Error reviewing project:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// ================= GET MENTOR IDEA PROJECTS =================

const getMentorIdeaProjects = async (req, res) => {
  try {
    const mentorId = req.user.id;

    const projects = await ProjectIdea.find({
      $or: [
        { selectedMentor1: mentorId },
        { selectedMentor2: mentorId },
        { selectedMentor3: mentorId },
      ],
    })
      .populate("teamMembers", "name email")
      .populate("teamLead.id", "name email")
      

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
    const { action, feedback } = req.body;
    
    const mentorId = req.user._id.toString();

    if (!["approve", "reject"].includes(action)) {
      return res.status(400).json({
        success: false,
        message: "Invalid action",
      });
    }

    const project = await ProjectIdea.findById(id);

    if (!project || project.status !== "interview_passed") {
      return res.status(400).json({
        success: false,
        message: "Project cannot be reviewed yet",
      });
    }


    const selectedMentors = [
      project.selectedMentor1,
      project.selectedMentor2,
      project.selectedMentor3,
    ]
      .filter(Boolean)
      .map(id => id.toString());
    
    if (!selectedMentors.includes(mentorId)) {
      return res.status(403).json({
        success: false,
        message: "You are not selected as mentor for this project",
      });
    }

    // ✅ If already approved by another mentor
    if (project.confirmedMentor) {
      return res.status(400).json({
        success: false,
        message: "Project already approved by another mentor",
      });
    }

    // ✅ Save feedback
    project.feedbacks.push({
      mentor: mentorId,
      feedback: feedback || "",
    });

    // ✅ If approve → confirm mentor
    if (action === "approve") {
      project.status = "approved_by_mentor";
      project.confirmedMentor = mentorId; // 🔥 Only one mentor stored
    }

    // ✅ If reject → just store feedback (no status change unless you want)
    if (action === "reject") {
      project.status = "interview_passed"; 
      // keep status same so other mentors can still approve
    }

    await project.save();

    const updatedProject = await ProjectIdea.findById(id)
     
      .populate("teamMembers", "name email")
      .populate("teamLead.id", "name email")
      .populate("confirmedMentor", "name email");

    res.json({
      success: true,
      message: `Project ${action}d successfully`,
      project: updatedProject,
    });

  } catch (err) {
    console.error("Error reviewing idea project:", err);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

module.exports = {
  getDocuments,
  downloadDocument,
  getMentorProject,
  reviewAssignedProject,
  getMentorIdeaProjects,
  reviewIdeaProject,
}