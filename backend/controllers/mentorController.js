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

    const projects = await AssignedProject.find({
      $or: [
        { selectedMentor1: mentorId },
        { selectedMentor2: mentorId },
        { selectedMentor3: mentorId },
      ],
    })
      .populate("projectId") // ProjectBank details
      .populate("student", "name email") // student
      .populate("teamLead", "name email") // team lead
      .populate("teamMembers", "name email"); // team

    if (!projects || projects.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No projects assigned to you yet.",
      });
    }

    res.json({
      success: true,
      projects, // 🔥 now returning ARRAY
    });
  } catch (error) {
    console.error("Error fetching mentor projects:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// ====================== REVIEW PROJECT (APPROVE/REJECT) ======================
const reviewAssignedProject = async (req, res) => {
  try {
    const mentorId = req.user._id; // logged-in mentor
    const { action } = req.body; // no reason needed now
    const { projectId } = req.params;

    if (!["approve", "reject"].includes(action)) {
      return res.status(400).json({ success: false, message: "Invalid action" });
    }

    const project = await AssignedProject.findById(projectId);

    if (!project) {
      return res.status(404).json({ success: false, message: "Project not found" });
    }

    // check if mentor is one of the selected mentors
    const selectedMentors = [
      project.selectedMentor1,
      project.selectedMentor2,
      project.selectedMentor3,
    ]
      .filter(Boolean)
      .map((m) => m.toString());

    if (!selectedMentors.includes(mentorId.toString())) {
      return res.status(403).json({ success: false, message: "You are not selected as mentor for this project" });
    }

    // If project already approved by someone else
    if (project.approvedMentor && project.approvedMentor.toString() !== mentorId.toString()) {
      return res.status(400).json({ success: false, message: "Project already approved by another mentor" });
    }

    // Check if mentor already reviewed
    const alreadyReviewed = project.feedbacks.some(f => {
      const mId = f.mentor?._id ? f.mentor._id.toString() : f.mentor.toString();
      return mId === mentorId.toString();
    });

    if (alreadyReviewed) {
      return res.status(400).json({ success: false, message: "You already reviewed this project" });
    }

    // Process action
    if (action === "approve") {
      project.status = "approve";
      project.approvedMentor = mentorId;
      project.feedbacks.push({
        mentor: mentorId,
        action: "approve",
      });
    } else if (action === "reject") {
      project.rejectedMentors = project.rejectedMentors || [];
      if (!project.rejectedMentors.some(m => m.toString() === mentorId.toString())) {
        project.rejectedMentors.push(mentorId);
      }

      project.feedbacks.push({
        mentor: mentorId,
        action: "reject",
      });

      project.status = "pending"; // still pending until approved
    }

    await project.save();

    // Populate for frontend
    const updatedProject = await AssignedProject.findById(projectId)
      .populate("selectedMentor1 selectedMentor2 selectedMentor3", "name email")
      .populate("approvedMentor", "name email")
      .populate("feedbacks.mentor", "name email");

    // Remove all rejectedMentors and reject feedbacks for everyone
    const projectForMentor = updatedProject.toObject();

    projectForMentor.rejectedMentors = []; // completely hide
    projectForMentor.feedbacks = projectForMentor.feedbacks.filter(f => f.action === "approve"); // only show approvals

    res.json({
      success: true,
      message: `Project ${action === "approve" ? "approved" : "rejected"} successfully`,
      project: projectForMentor,
    });

  } catch (err) {
    console.error("Error reviewing assigned project:", err);
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

    const mentorId = req.user._id;

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
      .map((m) => m.toString());

    if (!selectedMentors.includes(mentorId.toString())) {
      return res.status(403).json({
        success: false,
        message: "You are not selected as mentor for this project",
      });
    }

    // prevent action if project already approved by another mentor
    if (
      project.confirmedMentor &&
      project.confirmedMentor.toString() !== mentorId.toString()
    ) {
      return res.status(400).json({
        success: false,
        message: "Project already approved by another mentor",
      });
    }

    // prevent same mentor reviewing twice
    const alreadyReviewed = project.feedbacks.some(
      (f) => f.mentor.toString() === mentorId.toString()
    );

    if (alreadyReviewed) {
      return res.status(400).json({
        success: false,
        message: "You already reviewed this project",
      });
    }

    if (action === "approve") {
      project.status = "approved_by_mentor";
      project.confirmedMentor = mentorId;
    }

    if (action === "reject") {
      project.status = "interview_passed";

      project.rejectedMentors.push(mentorId);

      project.feedbacks.push({
        mentor: mentorId,
        feedback: feedback || "",
      });
    }

    await project.save();

    const updatedProject = await ProjectIdea.findById(id)
      .populate("teamMembers", "name email")
      .populate("teamLead.id", "name email")
      .populate("confirmedMentor", "name email")
      .populate("feedbacks.mentor", "name email")
      .populate("rejectedMentors", "name email");

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
      approvedMentor: mentorId,
      status: "approve",
    })
      .populate("student", "name rollNo")
      .populate("projectId", "title description technology")
      .populate({
        path: "teamMembers",
        select: "name email rollNo academicYear branch section group"
      })
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
          fileUrl: u.filePath,
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
const getForm1ByProjectMentor = async (req, res) => {
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

//Assigned Project forms
//form1 
const getAssignedForm1ByProject = async (req, res) => {
  try {
    const { projectId } = req.params;
    const mentorId = req.user._id;

    const form1 = await Form1.findOne({
      projectId,
      mentorId,
      projectModel: "AssignedProject",
    })
      .populate("studentId", "name email rollNo branch section")
      .populate("teamMembers", "name email rollNo branch section");

    if (!form1) {
      return res.status(404).json({
        success: false,
        message: "Assigned Project Form 1 not found",
      });
    }

    res.status(200).json({
      success: true,
      data: form1,
    });
  } catch (error) {
    console.error("Error fetching Assigned Form1:", error);

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

const approveAssignedForm1 = async (req, res) => {
  try {
    const { projectId } = req.params;
    const mentorId = req.user._id;

    const form1 = await Form1.findOne({
      projectId,
      mentorId,
      projectModel: "AssignedProject",
    });

    if (!form1) {
      return res.status(404).json({
        success: false,
        message: "Assigned Project Form 1 not found",
      });
    }

    form1.status = "approved_by_mentor";

    await form1.save();

    res.status(200).json({
      success: true,
      message: "Assigned Project Form 1 approved successfully",
    });
  } catch (error) {
    console.error("Approve Assigned Form1 error:", error);

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

const getForm2ByProjectMentor = async (req, res) => {
  try {
    const { projectId } = req.params;

    if (!projectId) {
      return res.status(400).json({
        success: false,
        message: "Project ID is required",
      });
    }

    const form2 = await Form2.findOne({ projectId })
      .populate("members.studentId", "name email rollNo branch section group academicYear");

    if (!form2) {
      return res.status(404).json({
        success: false,
        message: "Form2 not submitted yet",
      });
    }

    return res.status(200).json({
      success: true,
      form2,
    });
  } catch (error) {
    console.error("Error fetching Form2:", error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const approveForm2 = async (req, res) => {
  try {
    const { projectId, studentId } = req.params;

    const form2 = await Form2.findOne({ projectId });

    if (!form2) {
      return res.status(404).json({
        success: false,
        message: "Form2 not found"
      });
    }

    const member = form2.members.find(
      (m) => m.studentId.toString() === studentId
    );

    if (!member) {
      return res.status(404).json({
        success: false,
        message: "Student not found"
      });
    }

    member.approvedByMentor = true;
    member.mentorName = req.user.name; // mentor name
    member.approvedAt = new Date();    // approval date

    await form2.save();

    res.status(200).json({
      success: true,
      message: "Form2 approved successfully"
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: error.message
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
  getForm1ByProjectMentor,
  approveForm1,
  getAssignedForm1ByProject,
  approveAssignedForm1,
  getForm2ByProjectMentor,
  approveForm2,
  getProjectForm3,
  evaluateForm3Week,
}