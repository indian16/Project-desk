// controllers/studentController.js
const AssignedProject = require("../models/AssignedProject");
const ProjectBank = require("../models/ProjectBank");
const ProjectIdea = require("../models/ProjectIdea");
const Mentor = require("../models/Mentor");
const Document = require("../models/Document");
const path = require("path");
const Checklist = require("../models/Checklist");
const StudentChecklist = require("../models/StudentChecklist");
const fs = require("fs");
const Form1 = require("../models/Form1");
const Form2 = require("../models/Form2");
const Form3 = require("../models/Form3");
const Student = require("../models/Student");
const StudentForm3 = require("../models/StudentForm3");

//const submitProjectIdeaForm = async (req, res) => {
//   try {
//     const { projectId, title, description, technology, teamMembers, mentor } =
//       req.body;
//     const userId = req.user._id || req.user.id;

//     if (projectId && mentor) {
//       // ✅ Update mentor only
//       const project = await ProjectIdea.findById(projectId);
//       if (!project)
//         return res
//           .status(404)
//           .json({ success: false, message: "Project not found" });

//       project.mentor = mentor;
//       await project.save();

//       return res.status(200).json({
//         success: true,
//         message: "Mentor updated successfully",
//         data: project,
//       });
//     }

//     // Validate fields for new project idea
//     if (!title || !description || !technology || !teamMembers) {
//       return res.status(400).json({
//         success: false,
//         message:
//           "Title, description, technology, and team members are required",
//       });
//     }

//     // Prevent duplicate submission
//     const existingIdea = await ProjectIdea.findOne({
//       $or: [{ "teamLead.id": userId }, { teamMembers: userId }],
//     });
//     const existingAssigned = await AssignedProject.findOne({
//       $or: [{ student: userId }, { teamMembers: userId }],
//     });

//     if (existingIdea || existingAssigned) {
//       return res.status(403).json({
//         success: false,
//         message: "You are already part of a submitted project (Idea or Bank)",
//       });
//     }

//     const newIdea = new ProjectIdea({
//       title,
//       description,
//       technology,
//       teamMembers,
//       teamLead: {
//         id: userId,
//         name: req.user.name,
//         email: req.user.email,
//       },
//       academicYear: req.user.academicYear,
//       branch: req.user.branch,
//       section: req.user.section,
//       group: req.user.group,
//       status: "pending",
//       mentor: mentor || null,
//     });

//     await newIdea.save();

//     res.status(201).json({
//       success: true,
//       message: "Project Idea submitted successfully",
//       data: newIdea,
//     });
//   } catch (error) {
//     console.error("Submit Project Idea Error:", error);
//     res.status(500).json({
//       success: false,
//       message: "Failed to submit project idea",
//       error: error.message,
//     });
//   }
// };

// ✅ Submit project from Project Bank

const submitProjectIdeaForm = async (req, res) => {
  try {
    const {
      projectId,
      title,
      description,
      technology,
      teamMembers,
      selectedMentor1,
      selectedMentor2,
      selectedMentor3,
    } = req.body;

    const userId = req.user._id || req.user.id;

    /* ======================================================
       ✅ 1️⃣ STUDENT SELECTS 3 MENTORS AFTER INTERVIEW PASSED
    ====================================================== */
    if (projectId && selectedMentor1 && selectedMentor2 && selectedMentor3) {
      const project = await ProjectIdea.findById(projectId);

      if (!project) {
        return res.status(404).json({
          success: false,
          message: "Project not found",
        });
      }

      // ✅ Allow mentor selection only after interview passed
      if (project.status !== "interview_passed") {
        return res.status(400).json({
          success: false,
          message: "Mentors can only be selected after interview is passed",
        });
      }

      // ✅ Prevent selecting same mentor multiple times
      const mentors = [selectedMentor1, selectedMentor2, selectedMentor3];

      const uniqueMentors = new Set(mentors);

      if (uniqueMentors.size !== 3) {
        return res.status(400).json({
          success: false,
          message: "You must select 3 different mentors",
        });
      }

      // ✅ Save selected mentors
      project.selectedMentor1 = selectedMentor1;
      project.selectedMentor2 = selectedMentor2;
      project.selectedMentor3 = selectedMentor3;

      // 🔥 confirmedMentor stays null automatically

      await project.save();

      return res.status(200).json({
        success: true,
        message: "Mentors selected successfully",
        data: project,
      });
    }

    /* ======================================================
       ✅ 2️⃣ CREATE NEW PROJECT IDEA
    ====================================================== */

    if (!title || !description || !technology || !teamMembers) {
      return res.status(400).json({
        success: false,
        message:
          "Title, description, technology, and team members are required",
      });
    }

    // ✅ Prevent duplicate submission
    const existingIdea = await ProjectIdea.findOne({
      $or: [{ "teamLead.id": userId }, { teamMembers: userId }],
    });

    const existingAssigned = await AssignedProject.findOne({
      $or: [{ student: userId }, { teamMembers: userId }],
    });

    if (existingIdea || existingAssigned) {
      return res.status(403).json({
        success: false,
        message: "You are already part of a submitted project (Idea or Bank)",
      });
    }

    // ✅ Create new project idea
    const newIdea = new ProjectIdea({
      title,
      description,
      technology,
      teamMembers,
      teamLead: {
        id: userId,
        name: req.user.name,
        email: req.user.email,
      },
      academicYear: req.user.academicYear,
      branch: req.user.branch,
      section: req.user.section,
      group: req.user.group,
      status: "pending",

      // confirmedMentor will automatically be null
    });

    await newIdea.save();

    return res.status(201).json({
      success: true,
      message: "Project Idea submitted successfully",
      data: newIdea,
    });
  } catch (error) {
    console.error("Submit Project Idea Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to submit project idea",
      error: error.message,
    });
  }
};

const submitProjectBankForm = async (req, res) => {
  try {
    const {
      projectId,
      title,
      description,
      technology,
      selectedMentor,
      teamMembers,
    } = req.body;
    const userId = req.user._id || req.user.id;

    const existingIdea = await ProjectIdea.findOne({
      $or: [{ "teamLead.id": userId }, { team: userId }],
    });
    const existingAssigned = await AssignedProject.findOne({
      $or: [{ student: userId }, { teamMembers: userId }],
    });

    if (existingIdea || existingAssigned) {
      return res.status(403).json({
        success: false,
        message: "You are already part of a submitted project (Idea or Bank)",
      });
    }

    const newAssigned = new AssignedProject({
      student: userId,
      projectId,
      title,
      description,
      technology,
      selectedMentor, // 👈 Mentor ID save here
      teamMembers,
      teamLead: {
        id: userId,
        name: req.user.name,
        email: req.user.email,
      },
      academicYear: req.user.academicYear,
      branch: req.user.branch,
      section: req.user.section,
      group: req.user.group,
    });

    await newAssigned.save();

    res.status(201).json({
      success: true,
      message: "Project Bank form submitted successfully",
      data: newAssigned,
    });
  } catch (error) {
    console.error("Submit Project Bank Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to submit project bank form",
      error: error.message,
    });
  }
};

const getMyIdeaProject = async (req, res) => {
  try {
    const userId = req.user._id || req.user.id;

    const projectIdea = await ProjectIdea.findOne({
      $or: [{ "teamLead.id": userId }, { teamMembers: userId }],
    })
      // ✅ Populate selected mentors
      .populate("selectedMentor1", "name email")
      .populate("selectedMentor2", "name email")
      .populate("selectedMentor3", "name email")
      .populate("confirmedMentor", "name email")

      // ✅ Populate team members
      .populate("teamMembers", "name email rollno")

      // ✅ Populate team lead
      .populate("teamLead.id", "name email");

    if (!projectIdea) {
      return res.status(200).json({
        success: true,
        projectIdea: null,
        message: "No project idea submitted yet",
      });
    }

    res.status(200).json({
      success: true,
      projectIdea,
    });
  } catch (error) {
    console.error("Get My Idea Project Error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// const selectIdeaMentor = async (req, res) => {
//   try {
//     const ideaId = req.params.id;
//     const { mentorId } = req.body; // mentor id selected by student
//     const userId = req.user._id || req.user.id;

//     // Ensure this project belongs to the student (lead or team member)
//     const project = await ProjectIdea.findOne({
//       _id: ideaId,
//       $or: [{ "teamLead.id": userId }, { teamMembers: userId }],
//     });

//     if (!project) {
//       return res.status(404).json({ success: false, message: "Project not found" });
//     }

//     if (project.status !== "interview_passed") {
//       return res.status(400).json({
//         success: false,
//         message: "You can only select a mentor after passing the interview",
//       });
//     }

//     project.mentor = mentorId;
//     await project.save();

//     // populate mentor info before returning
//     await project.populate("mentor", "name email");

//     res.status(200).json({ success: true, message: "Mentor selected", data: project });
//   } catch (error) {
//     console.error("Select Idea Mentor Error:", error);
//     res.status(500).json({ success: false, message: "Server error" });
//   }
// };

// ✅ Get student's assigned project only
const getMyAssignedProject = async (req, res) => {
  try {
    const userId = req.user.id;

    const project = await AssignedProject.findOne({
      $or: [{ student: userId }, { teamMembers: userId }],
    })
      .populate("selectedMentor", "name email")
      .populate("approvedMentor", "name email")
      .populate("teamMembers", "name email rollno")
      .populate("student", "name email");

    if (!project) {
      return res.status(200).json({
        success: true,
        project: null,
        message: "No assigned project yet",
      });
    }

    res.status(200).json({ success: true, project });
  } catch (error) {
    console.error("Get My Assigned Project Error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// ✅ Get project bank filtered by academicYear
const getProjectBankList = async (req, res) => {
  try {
    const projects = await ProjectBank.find({
      academicYear: req.user.academicYear,
    }).sort({ title: 1 });
    res.status(200).json({ success: true, projects });
  } catch (error) {
    console.error("Get Project Bank Error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

const getMentorList = async (req, res) => {
  try {
    const mentors = await Mentor.find().select("-password"); // exclude password
    res.json({ mentors }); // ✅ wrapped in object
  } catch (err) {
    console.error("Error fetching mentors:", err);
    res.status(500).json({ message: "Failed to load mentor list" });
  }
};

const selectMentorsForProject = async (req, res) => {
  try {
    const { projectId, selectedMentor1, selectedMentor2, selectedMentor3 } =
      req.body;

    const project = await ProjectIdea.findById(projectId);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    if (project.status !== "interview_passed") {
      return res.status(400).json({
        success: false,
        message: "Mentors can only be selected after interview is passed",
      });
    }

    const mentors = [selectedMentor1, selectedMentor2, selectedMentor3];
    const uniqueMentors = new Set(mentors);

    if (uniqueMentors.size !== 3) {
      return res.status(400).json({
        success: false,
        message: "You must select 3 different mentors",
      });
    }

    project.selectedMentor1 = selectedMentor1;
    project.selectedMentor2 = selectedMentor2;
    project.selectedMentor3 = selectedMentor3;

    await project.save();

    return res.status(200).json({
      success: true,
      message: "Mentors selected successfully",
      data: project,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to select mentors",
    });
  }
};

// 📌 Get all documents for students
const getDocuments = async (req, res) => {
  try {
    // Students can see all documents
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

    // Send the file
    res.download(path.resolve(doc.filePath), doc.fileName);
  } catch (error) {
    console.error("Download Document Error:", error);
    res
      .status(500)
      .json({ message: "Server error while downloading document" });
  }
};

const getChecklist = async (req, res) => {
  try {
    const studentId = req.user.id;

    const project =
      (await ProjectIdea.findOne({
        $or: [{ "teamLead.id": studentId }, { teamMembers: studentId }],
      })) ||
      (await AssignedProject.findOne({
        $or: [{ student: studentId }, { teamMembers: studentId }],
      }));

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "No project found",
      });
    }

    const globalChecklist = await Checklist.find().sort({ createdAt: 1 });

    const studentUploads = await StudentChecklist.find({
      projectId: project._id,
    });

    const merged = globalChecklist.map((item) => {
      const uploaded = studentUploads.find(
        (u) => String(u.checklistItem) === String(item._id),
      );

      return {
        title: item.title,
        checklistId: item._id.toString(),
        status: uploaded ? "submitted" : "pending",
        fileUrl: uploaded?.filePath || null,
        fileName: uploaded?.fileName || null,
        uploadedAt: uploaded?.uploadedAt || null,
      };
    });

    res.status(200).json({
      success: true,
      checklist: merged,
      title: project.title,
      projectId: project._id.toString(),
    });
  } catch (error) {
    console.error("Get Checklist Error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching checklist",
    });
  }
};

const uploadChecklistFile = async (req, res) => {
  try {
    const studentId = req.user.id;
    const { title, projectId, checklistItemId } = req.body;

    if (!req.file || !title || !projectId || !checklistItemId) {
      return res.status(400).json({
        success: false,
        message: "File, title, projectId, and checklistItemId are required",
      });
    }

    let project = await ProjectIdea.findById(projectId);
    let projectType = "ProjectIdea";

    if (!project) {
      project = await AssignedProject.findById(projectId);
      projectType = "AssignedProject";
    }

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    // 🔒 Only team lead can upload
    let projectLeadId;

    if (project.teamLead) {
      projectLeadId = project.teamLead.id || project.teamLead._id;
    } else {
      projectLeadId = project.student;
    }

    if (projectLeadId.toString() !== studentId.toString()) {
      return res.status(403).json({
        success: false,
        message: "Only team lead can upload checklist",
      });
    }

    const checklistItem = await Checklist.findById(checklistItemId);
    if (!checklistItem) {
      return res.status(404).json({
        success: false,
        message: "Checklist item not found",
      });
    }

    const existing = await StudentChecklist.findOne({
      projectId: projectId.toString(),
      checklistItem: checklistItemId.toString(),
    });

    if (existing) {
      if (existing.filePath && fs.existsSync(existing.filePath)) {
        fs.unlinkSync(existing.filePath);
      }

      existing.fileName = req.file.originalname;
      existing.filePath = req.file.path;
      existing.projectType = projectType;
      existing.uploadedAt = new Date();

      await existing.save();

      return res.status(200).json({
        success: true,
        message: "Checklist file updated successfully",
        submission: {
          fileName: existing.fileName,
          filePath: existing.filePath,
          checklistItemId,
          uploadedAt: existing.uploadedAt,
        },
      });
    }

    const newUpload = new StudentChecklist({
      student: studentId,
      projectId: projectId.toString(),
      projectType,
      checklistItem: checklistItemId.toString(),
      fileName: req.file.originalname,
      filePath: req.file.path,
      uploadedAt: new Date(),
    });

    await newUpload.save();

    return res.status(200).json({
      success: true,
      message: "Checklist file uploaded successfully",
      submission: {
        fileName: newUpload.fileName,
        filePath: newUpload.filePath,
        checklistItemId,
        uploadedAt: newUpload.uploadedAt,
      },
    });
  } catch (err) {
    console.error("Upload checklist file error:", err);
    res.status(500).json({
      success: false,
      message: "Server error while uploading file",
    });
  }
};

const saveForm1 = async (req, res) => {
  try {
    // ---------------------------
    // 0️⃣ Get student ID from token
    // ---------------------------
    const studentId = req.user?.id || req.user?._id;
    if (!studentId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const { formData = {}, submitType } = req.body; // TEAM | MENTOR | HEAD | undefined (draft)

    // ---------------------------
    // 1️⃣ Find the project
    // ---------------------------
    let project =
      (await AssignedProject.findOne({
        $or: [{ student: studentId }, { teamMembers: studentId }],
      }).populate("teamMembers", "name email")) ||
      (await ProjectIdea.findOne({
        $or: [{ "teamLead.id": studentId }, { teamMembers: studentId }],
      })
        .populate("teamMembers", "name email")
        .populate("teamLead.id", "name email"));

    if (!project) {
      return res
        .status(404)
        .json({ success: false, message: "Project not found" });
    }

    const projectModel = project.teamLead ? "ProjectIdea" : "AssignedProject";

    // ---------------------------
    // 2️⃣ Only Team Lead can submit
    // ---------------------------
    let projectLeadId;

    if (project.teamLead) {
      // ProjectIdea
      projectLeadId = project.teamLead.id?._id || project.teamLead.id;
    } else if (project.student) {
      // AssignedProject
      projectLeadId = project.student;
    }

    const isTeamLead = projectLeadId?.toString() === studentId.toString();

    if (!isTeamLead) {
      return res.status(403).json({
        success: false,
        message: "Only Team Lead can fill or submit Form-1",
      });
    }

    // ---------------------------
    // 3️⃣ Get existing Form1 (if any)
    // ---------------------------
    let form1 = await Form1.findOne({ projectId: project._id });

    // ---------------------------
    // 4️⃣ Determine submission stage
    // ---------------------------
    let nextStage = "DRAFT";
    if (submitType === "TEAM") nextStage = "TEAM_SUBMITTED";
    if (submitType === "MENTOR") nextStage = "MENTOR_SUBMITTED";
    if (submitType === "HEAD") nextStage = "HEAD_SUBMITTED";

    // Validate stage order
    const stageOrder = [
      "DRAFT",
      "TEAM_SUBMITTED",
      "MENTOR_SUBMITTED",
      "HEAD_SUBMITTED",
    ];
    if (form1) {
      const currentIndex = stageOrder.indexOf(form1.submissionStage);
      const nextIndex = stageOrder.indexOf(nextStage);
      if (nextIndex < currentIndex) {
        return res.status(400).json({
          success: false,
          message: "Invalid submission stage transition",
        });
      }
    }

    // ---------------------------
    // 5️⃣ Normalize Team Members
    // ---------------------------
    const teamMembersFromFrontend = Array.isArray(formData.teamMembers)
      ? formData.teamMembers
      : [];
    const teamMembers = teamMembersFromFrontend.map((m) => ({
      name: m.name || "",
      mobile: m.mobile || "",
      expertise: m.expertise || "",
      role: m.role || "",
    }));

    // ---------------------------
    // 6️⃣ Build payload
    // ---------------------------
    const payload = {
      projectId: project._id,
      projectModel,
      studentId,

      branch: formData.branch || "",
      section: formData.section || "",
      group: formData.group || "",
      title: formData.title || "",
      projectTrack: formData.projectTrack || [],
      introduction: formData.introduction || "",

      toolsTechnologies: formData.toolsTechnologies || [],
      proposedModules: formData.proposedModules || [],
      teamMembers,

      mentorName: formData.mentorName || "",
      labCoordinatorName: formData.labCoordinatorName || "",

      submissionStage: nextStage,

      submittedTimeline: {
        ...(form1?.submittedTimeline || {}),
        ...(submitType === "TEAM" && { team: new Date() }),
        ...(submitType === "MENTOR" && { mentor: new Date() }),
        ...(submitType === "HEAD" && { head: new Date() }),
      },

      lastEditedBy: studentId,
      editHistory: [
        ...(form1?.editHistory || []),
        { editedBy: studentId, editedAt: new Date() },
      ],
    };

    // ---------------------------
    // 7️⃣ Save or update Form1
    // ---------------------------
    if (form1) {
      Object.assign(form1, payload);
      await form1.save();
    } else {
      form1 = new Form1(payload);
      await form1.save();
    }

    return res.status(200).json({
      success: true,
      message: "Form-1 saved successfully",
      submissionStage: form1.submissionStage,
      form1,
    });
  } catch (err) {
    console.error("saveForm1 error:", err);
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: err.message,
    });
  }
};

// GET FORM 1 (TEAM / MENTOR / HEAD VIEW)
const getForm1ByProject = async (req, res) => {
  try {
    const studentId = req.user?.id || req.user?._id;
    if (!studentId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    // 🔍 Find project
    const project =
      (await AssignedProject.findOne({
        $or: [{ student: studentId }, { teamMembers: studentId }],
      })) ||
      (await ProjectIdea.findOne({
        $or: [{ "teamLead.id": studentId }, { teamMembers: studentId }],
      }));

    if (!project) {
      return res
        .status(404)
        .json({ success: false, message: "Project not found" });
    }

    // 🧠 Detect team lead
    const projectLeadId =
      project.teamLead?._id || project.teamLead?.id || project.student;

    const isTeamLead = projectLeadId?.toString() === studentId.toString();

    // 📄 Fetch form
    const form1 = await Form1.findOne({ projectId: project._id });

    return res.status(200).json({
      success: true,
      isTeamLead,
      form1: form1 || null,
    });
  } catch (err) {
    console.error("getMyForm1 error:", err);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

const saveForm2 = async (req, res) => {
  try {
    const studentId = req.user._id || req.user.id;

    // 1. Check ProjectIdea
    let project = await ProjectIdea.findOne({
      $or: [{ teamMembers: studentId }, { "teamLead.id": studentId }],
    });

    let projectType = "ProjectIdea";

    // 2. If not found → check AssignedProject
    if (!project) {
      project = await AssignedProject.findOne({
        teamMembers: { $in: [studentId] },
      });

      projectType = "AssignedProject";
    }

    // 3. If still not found → return error
    if (!project) {
      return res.status(404).json({
        success: false,
        message: "No project found for this student.",
      });
    }

    // 4. Map frontend data
    const {
      member,
      moduleName,
      functionalityName,
      softDeadline,
      hardDeadline,
      details,
      story,
    } = req.body;

    if (!member || !details) {
      return res.status(400).json({
        success: false,
        message: "`member` and `details` are required",
      });
    }

    // 5. Check if Form2 already exists
    let form2 = await Form2.findOne({
      projectId: project._id,
      studentId: studentId,
    });

    if (!form2) {
      // Create new Form2
      form2 = new Form2({
        projectId: project._id,
        projectType,
        studentId,
        member,
        moduleName,
        functionalityName,
        details,
        softDeadline,
        hardDeadline,
        story,
      });
    } else {
      // Update existing Form2
      form2.projectType = projectType;
      form2.member = member;
      form2.moduleName = moduleName;
      form2.functionalityName = functionalityName;
      form2.details = details;
      form2.softDeadline = softDeadline;
      form2.hardDeadline = hardDeadline;
      form2.story = story;
    }

    await form2.save();

    return res.status(200).json({
      success: true,
      message: "Form2 saved successfully",
      form2,
    });
  } catch (error) {
    console.error("Error saving Form2:", error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ✅ Get Form2 by Project
const getForm2ByProject = async (req, res) => {
  try {
    const studentId = req.user._id || req.user.id;

    // Find the ProjectIdea for this student
    const project = await ProjectIdea.findOne({
      $or: [{ teamMembers: studentId }, { "teamLead.id": studentId }],
    });

    if (!project) {
      return res
        .status(404)
        .json({ success: false, message: "No project found for this student" });
    }

    // Find Form2 for this project and student
    const form2 = await Form2.findOne({
      projectId: project._id,
      studentId: studentId,
    });

    if (!form2) {
      return res.status(200).json({ success: true, form: null }); // No form yet
    }

    return res.status(200).json({ success: true, form: form2 });
  } catch (error) {
    console.error("Error fetching Form2:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

const getForm3 = async (req, res) => {
  try {
    // get student from token
    const student = await Student.findById(req.user.id);

    if (!student) return res.status(404).json({ message: "Student not found" });

    const form3 = await Form3.findOne({
      academicYear: student.academicYear,
    });

    if (!form3)
      return res.status(404).json({ message: "Form3 not found for this year" });

    res.status(200).json(form3);
  } catch (err) {
    console.error("Error fetching Form3:", err);
    res.status(500).json({ message: "Server error" });
  }
};

const submitForm3Week = async (req, res) => {
  try {
    const studentId = req.user.id;
    const { projectId, weekNumber, functionality, progress, taskDetails } =
      req.body;

    // 🔎 Validate project
    const project =
      (await ProjectIdea.findOne({
        $or: [{ "teamLead.id": studentId }, { teamMembers: studentId }],
      })) ||
      (await AssignedProject.findOne({
        $or: [{ student: studentId }, { teamMembers: studentId }],
      }));

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "No project found",
      });
    }

    if (project._id.toString() !== projectId) {
      return res.status(400).json({
        success: false,
        message: "Invalid project ID",
      });
    }

    // 📝 Save in StudentForm3 (NOT Form3)
    const updated = await StudentForm3.findOneAndUpdate(
      { studentId, projectId, weekNumber },
      { functionality, progress, taskDetails },
      { new: true, upsert: true },
    );

    res.status(200).json({
      success: true,
      message: `Week ${weekNumber} submitted successfully`,
      data: updated,
    });
  } catch (error) {
    console.error("Error submitting Form-3 week:", error);
    res.status(500).json({
      success: false,
      message: "Failed to submit Form-3 week",
    });
  }
};

module.exports = {
  submitProjectIdeaForm,
  submitProjectBankForm,
  getMyIdeaProject,
  getMyAssignedProject,
  getProjectBankList,
  getMentorList,
  selectMentorsForProject,
  getDocuments,
  downloadDocument,
  getChecklist,
  uploadChecklistFile,
  saveForm1,
  getForm1ByProject,
  saveForm2,
  getForm2ByProject,
  getForm3,
  submitForm3Week,
};
