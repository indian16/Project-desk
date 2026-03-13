const mongoose = require("mongoose");
const AssignedProject = require("../models/AssignedProject");
const Document = require("../models/Document");
const ProjectIdea = require("../models/ProjectIdea");
const Checklist = require("../models/Checklist");
const StudentChecklist = require("../models/StudentChecklist");
const StudentForm3 = require("../models/StudentForm3");
const Form1 = require("../models/Form1");
const Form2 = require("../models/Form2");

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

const getMyApprovedProjects = async (req, res) => {
  try {
    const mentorId = req.user._id;

    // Projects coming from ProjectIdea
    const ideaProjects = await ProjectIdea.find({
      confirmedMentor: mentorId,
      status: "approved_by_mentor",
    })
      .populate("teamMembers", "name email academicYear branch section group")
      .populate("teamLead.id", "name email");

    // Projects coming from AssignedProject
    const approvedProjects = await AssignedProject.find({
      approveMentor: mentorId,
      status: "approve",
    })
      .populate("student", "name rollNo")
      .populate("projectId", "title description technology")
      .populate("teamMembers", "name rollNo");

    return res.status(200).json({
      success: true,
      ideaProjects,
      approvedProjects,
    });
  } catch (error) {
    console.error("getMyApprovedProjects error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch mentor approved projects",
    });
  }
};

const getProjectDocuments = async (req, res) => {
  try {
    const { projectId } = req.params;

    // Guard clause
    if (!projectId || projectId === "undefined") {
      return res.status(400).json({
        success: false,
        message: "Valid Project ID is required",
      });
    }

    // 1️⃣ Fetch all checklist items (created by Head)
    const checklistItems = await Checklist.find().lean();

    // 2️⃣ Fetch student uploads for this project
    const uploads = await StudentChecklist.find({ projectId })
      .populate("student", "name rollNo email")
      .populate("checklistItem", "title")
      .sort({ uploadedAt: 1 })
      .lean();

    // 3️⃣ Group uploads under checklist items
    const groupedData = checklistItems.map((item) => {
      const relatedUploads = uploads.filter(
        (u) => u.checklistItem?.toString() === item._id.toString()
      );

      return {
        checklistId: item._id,
        title: item.title,
        uploads: relatedUploads.map((u) => ({
          uploadId: u._id,
          student: u.student,
          fileName: u.fileName,
          fileUrl: `/uploads/checklist/${u.filePath.split("\\").pop()}`,
          uploadedAt: u.uploadedAt,
        })),
      };
    });

    return res.status(200).json({
      success: true,
      data: groupedData,
    });
  } catch (error) {
    console.error("Error fetching project documents:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch project documents",
    });
  }
};

// form 1
const getForm1ByProject = async (req, res) => {
  try {
    const { projectId } = req.params;
    const mentorId = req.user._id;

    const form1 = await Form1.findOne({
      projectId,
      mentorId,
    })
      .populate("studentId", "name email rollNo branch section")
      .populate("teamMembers", "name email rollNo branch section");

    if (!form1) {
      return res.status(404).json({
        success: false,
        message: "Form 1 not found",
      });
    }

    res.status(200).json({
      success: true,
      data: form1,
    });
  } catch (error) {
    console.error("Error fetching Form1:", error);

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

const approveForm1 = async (req, res) => {
  try {
    const { projectId } = req.params;
    const mentorId = req.user._id;

    const form1 = await Form1.findOne({
      projectId,
      mentorId,
    });

    if (!form1) {
      return res.status(404).json({
        success: false,
        message: "Form 1 not found",
      });
    }

    form1.status = "approved_by_mentor";

    await form1.save();

    res.status(200).json({
      success: true,
      message: "Form 1 approved successfully",
    });
  } catch (error) {
    console.error("Approve Form1 error:", error);

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

const getForm2ByProject = async (req, res) => {
  try {
    const { projectId } = req.params;

    if (!projectId) {
      return res.status(400).json({
        success: false,
        message: "Project ID is required",
      });
    }

    // Fetch all Form2 entries for the project
    const submissions = await Form2.find({ projectId })
      .populate("studentId", "name email rollNo branch section group academicYear")
      .sort({ createdAt: 1 }); // earliest first

    return res.status(200).json({
      success: true,
      submissions,
    });
  } catch (error) {
    console.error("Error fetching Form2 submissions:", error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const approveForm2 = async (req, res) => {
  try {
    const { projectId, studentId } = req.params;

    const form2 = await Form2.findOne({ projectId, studentId });
    if (!form2) {
      return res.status(404).json({
        success: false,
        message: "Form2 submission not found",
      });
    }

    form2.approvedByMentor = true; // Add a field in schema if not present
    form2.approvedAt = new Date();  // Optional timestamp
    await form2.save();

    return res.status(200).json({
      success: true,
      message: "Form2 approved successfully",
      form2,
    });
  } catch (error) {
    console.error("Error approving Form2:", error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getProjectForm3 = async (req, res) => {
  try {
    const { projectId } = req.params;

    // Fetch all Form3 documents for this project
    const forms3 = await StudentForm3.find({ projectId }).populate('studentId', 'name email');

    if (!forms3.length) {
      return res.status(404).json({
        success: false,
        message: "No Form3 submissions yet for this project",
      });
    }

    res.json({
      success: true,
      students: forms3.map(f => ({
        studentId: f.studentId._id,
        name: f.studentId.name,
        email: f.studentId.email,
        weeks: f.weeks,
      })),
    });
  } catch (error) {
    console.error("Error fetching Form3:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

const evaluateForm3Week = async (req, res) => {
  try {
    const { projectId } = req.params;
    const { studentId, weekNumber, marks, mentorRemark } = req.body; // body now
    const mentorName = req.user.name;

    const form3 = await StudentForm3.findOne({ projectId, studentId });

    if (!form3) {
      return res.status(404).json({ success: false, message: "Form3 not found" });
    }

    const week = form3.weeks.find((w) => w.weekNumber === Number(weekNumber));

    if (!week) {
      return res.status(404).json({ success: false, message: "Week not found" });
    }

    week.marks = marks;
    week.mentorRemark = mentorRemark;
    week.mentorSignature = mentorName;
    week.evaluatedAt = new Date();

    await form3.save();

    res.json({ success: true, message: "Evaluation submitted", form3 });
  } catch (error) {
    console.error("EVALUATE FORM3 ERROR:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

module.exports = {
  getDocuments,
  downloadDocument,
  getMentorProject,
  reviewAssignedProject,
  getMentorIdeaProjects,
  reviewIdeaProject,
  getMyApprovedProjects,
  getProjectDocuments,
  getForm1ByProject,
  approveForm1,
  getForm2ByProject,
  approveForm2,
  getProjectForm3,
  evaluateForm3Week,
}