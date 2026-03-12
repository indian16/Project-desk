//src/controllers/headcontroller.js
const ProjectIdea = require("../models/ProjectIdea");
const Document = require("../models/Document");
const path = require("path");
const Interview = require("../models/Interview");
const XLSX = require("xlsx");
const fs = require("fs");
const Head = require("../models/Head");
const Mentor = require("../models/Mentor");
const ProjectBank = require("../models/ProjectBank");
const AssignedProject = require("../models/AssignedProject");
const Student = require("../models/Student");
const Message = require("../models/Message");
const bcrypt = require("bcryptjs");
const Checklist = require("../models/Checklist");
const StudentChecklist = require("../models/StudentChecklist");
const Form3 = require("../models/Form3");

// ✅ Get all available academic years
const getAvailableYears = async (req, res) => {
  try {
    const ideaYears = await ProjectIdea.distinct("academicYear");
    const assignedYears = await AssignedProject.distinct("academicYear");

    const years = [...new Set([...ideaYears, ...assignedYears])]; // merge + dedupe

    res.json(years);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch academic years" });
  }
};

const getProjectsByYear = async (req, res) => {
  try {
    const { year } = req.query;
    if (!year) {
      return res.status(400).json({ message: "Academic year is required" });
    }

    // Fetch Project Bank projects
    const projects = await ProjectBank.find({ academicYear: year });

    // Fetch Project Ideas
    const ideas = await ProjectIdea.find({ academicYear: year })
      .populate("teamMembers", "name email rollno")
      .populate("mentor", "name email");

    res.status(200).json({
      year,
      projects,
      ideas,
    });
  } catch (err) {
    console.error("Error fetching projects/ideas by year:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// 📌 Upload Student Excel
const uploadStudentList = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    // Read Excel file
    const workbook = XLSX.readFile(req.file.path);
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const data = XLSX.utils.sheet_to_json(sheet);

    const defaultPassword = "Student@123";
    const hashedPassword = await bcrypt.hash(defaultPassword, 10);

    const studentsToInsert = data.map((item) => ({
      name: item.name,
      rollno: item.rollno,
      section: item.section,
      group: item.group || "",
      email: item.email,
      branch: item.branch,
      mobile: item.mobile,
      academicYear: item.academicYear,
      password: hashedPassword, // Add default hashed password
    }));

    for (const student of studentsToInsert) {
      await Student.findOneAndUpdate(
        { rollno: student.rollno, academicYear: student.academicYear },
        student,
        { upsert: true, new: true, setDefaultsOnInsert: true },
      );
    }

    // Delete uploaded file
    fs.unlinkSync(req.file.path);

    res.status(200).json({
      message: `Student list uploaded successfully. Default password is '${defaultPassword}'`,
      count: studentsToInsert.length,
    });
  } catch (error) {
    console.error("Student List Upload Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// ✅ Head uploads mentor list from Excel
const uploadMentorList = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    // Read Excel file
    const workbook = XLSX.readFile(req.file.path);
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const data = XLSX.utils.sheet_to_json(sheet);

    const defaultPassword = "Mentor@123";
    const hashedPassword = await bcrypt.hash(defaultPassword, 10);

    const mentorsToInsert = data.map((item) => ({
      name: item.Name || item.name,
      email: item.Email || item.email,
      designation: item.Designation || item.designation,
      expertise: item.Expertise || item.expertise,
      mobile: item.Mobile || item.mobile,
      password: hashedPassword, // Add default hashed password
    }));

    for (const mentor of mentorsToInsert) {
      await Mentor.findOneAndUpdate(
        { email: mentor.email }, // unique per year
        mentor,
        { upsert: true, new: true, setDefaultsOnInsert: true },
      );
    }

    fs.unlinkSync(req.file.path); // Delete uploaded file

    res.status(200).json({
      message: `Mentor list uploaded successfully. Default password is '${defaultPassword}'`,
      count: mentorsToInsert.length,
    });
  } catch (error) {
    console.error("Mentor List Upload Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

const uploadProjectBankExcel = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    // Read Excel file
    const workbook = XLSX.readFile(req.file.path);
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const data = XLSX.utils.sheet_to_json(sheet);

    if (!data || data.length === 0) {
      return res.status(400).json({ message: "Excel file is empty" });
    }

    const projectsToInsert = data.map((row) => ({
      projectId: row.projectId,
      title: row.title,
      description: row.description,
      technology: row.technology,
      category: row.category,
      academicYear: row.academicYear,
    }));

    let insertedCount = 0;
    let skippedCount = 0;

    for (const project of projectsToInsert) {
      if (
        !project.projectId ||
        !project.title ||
        !project.description ||
        !project.technology ||
        !project.category ||
        !project.academicYear
      ) {
        skippedCount++;
        continue;
      }

      await ProjectBank.findOneAndUpdate(
        { projectId: project.projectId, academicYear: project.academicYear },
        project,
        { upsert: true, new: true, setDefaultsOnInsert: true },
      );

      insertedCount++;
    }

    // Delete uploaded file
    fs.unlinkSync(req.file.path);

    res.status(200).json({
      message: `Project bank uploaded successfully.`,
      inserted: insertedCount,
      skipped: skippedCount,
    });
  } catch (error) {
    console.error("Project Bank Upload Error:", error);
    res
      .status(500)
      .json({ message: "Server error while uploading project bank" });
  }
};

// 📌 Upload Document (Head only)
const uploadHeadDocument = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const { title } = req.body; // Head should send a title

    if (!title) {
      return res.status(400).json({ message: "Document title is required" });
    }

    const doc = new Document({
      title: title,
      fileName: req.file.originalname, // original file name
      filePath: req.file.path, // path in uploads/
      uploadedBy: req.user._id, // Ensure ObjectId consistency
    });

    await doc.save();

    res
      .status(200)
      .json({ message: "Document uploaded successfully", document: doc });
  } catch (error) {
    console.error("Upload Document Error:", error);
    res
      .status(500)
      .json({ message: "Server error while uploading document", error });
  }
};

// 📌 Get All Documents uploaded by Head
const getHeadDocuments = async (req, res) => {
  try {
    const docs = await Document.find({ uploadedBy: req.user._id }).sort({
      createdAt: -1,
    });
    res.status(200).json(docs);
  } catch (error) {
    console.error("Get Documents Error:", error);
    res.status(500).json({ message: "Server error while fetching documents" });
  }
};

// 📌 Download Document
const downloadHeadDocument = async (req, res) => {
  try {
    const doc = await Document.findById(req.params.id);
    if (!doc) return res.status(404).json({ message: "Document not found" });

    // Send the file to client
    res.download(path.resolve(doc.filePath), doc.fileName);
  } catch (error) {
    console.error("Download Document Error:", error);
    res
      .status(500)
      .json({ message: "Server error while downloading document" });
  }
};

// 📌 Delete Document
const deleteHeadDocument = async (req, res) => {
  try {
    const doc = await Document.findById(req.params.id);
    if (!doc) return res.status(404).json({ message: "Document not found" });

    // Remove file from filesystem
    if (fs.existsSync(doc.filePath)) {
      fs.unlinkSync(doc.filePath);
    }

    await doc.deleteOne();
    res.status(200).json({ message: "Document deleted successfully" });
  } catch (error) {
    console.error("Delete Document Error:", error);
    res.status(500).json({ message: "Server error while deleting document" });
  }
};

// ✅ Get all pending project ideas for Head
const getPendingIdeasForHead = async (req, res) => {
  try {
    const { academicYear } = req.query;
    const filter = academicYear
      ? { status: "pending", academicYear }
      : { status: "pending" };

    const pendingIdeas = await ProjectIdea.find(filter)
      .populate("teamMembers", "name email rollno")
    res.status(200).json(pendingIdeas);
  } catch (error) {
    console.error("Error fetching pending ideas:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

// ✅ Approve/Reject Idea buttons
const reviewIdeaByHead = async (req, res) => {
  const { id } = req.params;
  const { action, reason } = req.body;

  try {
    const idea = await ProjectIdea.findById(id);

    if (!idea) {
      return res.status(404).json({ message: "Project idea not found" });
    }

    if (idea.status !== "pending" && idea.status !== "interview_passed") {
      return res
        .status(400)
        .json({ message: `Cannot review idea with status: ${idea.status}` });
    }

    if (action === "reject") {
      idea.status = "rejected_by_head";
      idea.headRemarks = reason;
    } else if (action === "approve") {
      idea.status = "approved_by_head";
    } else {
      return res
        .status(400)
        .json({ message: "Invalid action. Use 'approve' or 'reject'." });
    }

    await idea.save();
    res.status(200).json({
      message: `Project idea ${action}d by head`,
      idea,
    });
  } catch (error) {
    console.error("Error reviewing idea by head:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

// ✅ Get All Reviewed Ideas (both approved & rejected)
const getReviewedIdeasForHead = async (req, res) => {
  try {
    const { academicYear } = req.query;

    const filter = academicYear
      ? {
          status: { $in: ["approved_by_head", "rejected_by_head"] },
          academicYear,
        }
      : { status: { $in: ["approved_by_head", "rejected_by_head"] } };

    const reviewedIdeas = await ProjectIdea.find(filter)
      .populate("teamMembers", "name email rollno")

    res.status(200).json(reviewedIdeas);
  } catch (error) {
    console.error("Error fetching reviewed ideas:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

const getAcceptedIdeasForInterview = async (req, res) => {
  try {
    // Fetch ideas with status 'approved_by_head'
    const ideas = await ProjectIdea.find({ status: "approved_by_head" })
      .populate("teamLead.id", "name email") // populate team lead info
      .select("title teamLead description"); // select only necessary fields

    if (!ideas || ideas.length === 0) {
      return res.status(404).json({ message: "No accepted ideas found" });
    }

    res.status(200).json(ideas);
  } catch (error) {
    console.error("Error fetching accepted ideas:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

const scheduleInterview = async (req, res) => {
  const { id } = req.params;
  const { date, time, location, notes } = req.body; // expects flat object

  if (!date || !time || !location) {
    return res.status(400).json({ message: "Incomplete interview details" });
  }

  try {
    const idea = await ProjectIdea.findById(id);
    if (!idea)
      return res.status(404).json({ message: "Project idea not found" });

    idea.status = "interview_scheduled";
    await idea.save();

    const interview = await Interview.create({
      idea: id,
      date,
      time,
      location,
      notes,
    });

    res
      .status(200)
      .json({ message: "Interview scheduled successfully", interview });
  } catch (error) {
    console.error("Error scheduling interview:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

// ✅ Review Interview (pass or fail)
const reviewInterview = async (req, res) => {
  const { id } = req.params;
  const { action } = req.body; // ignore feedback for now

  try {
    const idea = await ProjectIdea.findById(id);
    if (!idea)
      return res.status(404).json({ message: "Project idea not found" });

    if (idea.status !== "interview_scheduled") {
      return res
        .status(400)
        .json({ message: `Cannot review idea with status: ${idea.status}` });
    }

    if (action === "pass") idea.status = "interview_passed";
    else if (action === "fail") idea.status = "interview_failed";
    else
      return res
        .status(400)
        .json({ message: "Invalid action. Use 'pass' or 'fail'." });

    // Skip validation so it doesn't fail if mentor is missing
    await idea.save({ validateBeforeSave: false });

    res
      .status(200)
      .json({ message: `Interview ${action}ed successfully`, idea });
  } catch (err) {
    console.error("Error reviewing interview:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// ✅ Get all ideas with scheduled, passed, or failed interviews (optionally by academicYear)
const getAllInterviews = async (req, res) => {
  try {
    const { academicYear } = req.query;

    const filter = {
      status: {
        $in: ["interview_scheduled", "interview_passed", "interview_failed"],
      },
    };
    if (academicYear) filter.academicYear = academicYear;

    const ideas = await ProjectIdea.find(filter)
      .populate("teamMembers", "name email rollno")

    if (!ideas || ideas.length === 0) {
      return res.status(404).json({ message: "No interviews found" });
    }

    res.status(200).json(ideas);
  } catch (error) {
    console.error("Error fetching interviews:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

const sendMessage = async (req, res) => {
  try {
    const { content, receiverRoles } = req.body;

    // Validate input
    if (!content || !receiverRoles || receiverRoles.length === 0) {
      return res.status(400).json({ message: "Invalid message data" });
    }

    // Create message object
    const message = {
      content,
      sender: req.user.id,
      receiverRoles,
      createdAt: new Date(),
    };

    // Save message to database (pseudo-code)
    await Message.create(message);

    res.status(201).json({ message: "Message sent successfully" });
  } catch (error) {
    console.error("Error sending message:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

const getMessages = async (req, res) => {
  try {
    const userId = req.user.id;
    const userRole = req.user.role; // "head", "mentor", "student"

    let query = {};

    if (userRole === "head") {
      // Head sees all messages they sent
      query = { sender: userId };
    } else {
      // Students or Mentors see messages sent to their role
      query = { receiverRoles: { $in: [userRole] } };
    }

    const messages = await Message.find(query)
      .sort({ createdAt: -1 })
      .populate("sender", "name email");

    res.json({ success: true, data: messages });
  } catch (err) {
    console.error("Get messages error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// ✅ Add a new checklist item (Head only)
const addChecklistItem = async (req, res) => {
  try {
    const { title } = req.body;

    if (!title) {
      return res
        .status(400)
        .json({ success: false, message: "Title is required" });
    }

    const newItem = new Checklist({
      title,
      createdBy: req.user._id, // head ID from auth
      studentUploads: [], // students will fill this later
    });

    await newItem.save();

    res.status(201).json({
      success: true,
      message: "Checklist item added successfully",
      item: newItem,
    });
  } catch (error) {
    console.error("Add Checklist Error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while adding checklist item",
    });
  }
};

// ✅ Get all checklist items (filter by year optional)
const getChecklistItems = async (req, res) => {
  try {
    const items = await Checklist.find().sort({ createdAt: -1 });

    res.status(200).json({ success: true, items });
  } catch (error) {
    console.error("Get Checklist Error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching checklist items",
    });
  }
};

// ✅ Delete a checklist item
const deleteChecklistItem = async (req, res) => {
  try {
    const { id } = req.params;

    const item = await Checklist.findById(id);
    if (!item) {
      return res
        .status(404)
        .json({ success: false, message: "Checklist item not found" });
    }

    await item.deleteOne();

    res
      .status(200)
      .json({ success: true, message: "Checklist item deleted successfully" });
  } catch (error) {
    console.error("Delete Checklist Error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while deleting checklist item",
    });
  }
};

const createForm3ForAllProjects = async (req, res) => {
  try {
    let { academicYear, weeks } = req.body;
    academicYear = academicYear.replace(/[–—]/g, "-").trim();

    console.log("Incoming Data:", req.body);

    if (!academicYear) {
      return res.status(400).json({ message: "Academic year required" });
    }

    if (!weeks || !Array.isArray(weeks) || weeks.length === 0) {
      return res.status(400).json({ message: "Weeks data required" });
    }

    // Validate each week
    for (let week of weeks) {
      if (!week.fromDate || !week.toDate) {
        return res.status(400).json({
          message: `Dates missing for week ${week.weekNumber}`,
        });
      }
    }

    let form3 = await Form3.findOne({ academicYear });

    if (form3) {
      form3.weeks = weeks;
      await form3.save();

      return res.status(200).json({
        message: "Form3 updated successfully",
        form3,
      });
    }

    form3 = await Form3.create({
      academicYear,
      weeks,
    });

    res.status(201).json({
      message: "Form3 created successfully",
      form3,
    });
  } catch (error) {
    console.error("CREATE FORM3 ERROR:", error);
    res.status(500).json({
      message: error.message || "Server error",
    });
  }
};

const getForm3Head = async (req, res) => {
  try {
    let { academicYear } = req.params;
    academicYear = academicYear.replace(/[–—]/g, "-").trim();

    if (!academicYear)
      return res.status(400).json({ message: "Academic year required" });

    const form3 = await Form3.findOne({ academicYear });
    if (!form3)
      return res.status(404).json({ message: "Form3 not found for this year" });

    res.status(200).json(form3);
  } catch (err) {
    console.error("Error fetching Form3 by year:", err);
    res.status(500).json({ message: "Server error" });
  }
};

const deleteForm3 = async (req, res) => {
  try {
    const { academicYear, weekNumber } = req.params;
    const weekNum = parseInt(weekNumber);
    if (isNaN(weekNum))
      return res.status(400).json({ message: "Invalid week number" });

    const form3 = await Form3.findOne({ academicYear });
    if (!form3) return res.status(404).json({ message: "Form3 not found" });

    // Remove the week
    form3.weeks = form3.weeks.filter((w) => w.weekNumber !== weekNum);

    // Re-number remaining weeks
    form3.weeks = form3.weeks.map((w, index) => ({
      ...w.toObject(),
      weekNumber: index + 1,
    }));

    await form3.save();
    res
      .status(200)
      .json({ message: `Week ${weekNum} removed successfully`, form3 });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error deleting week" });
  }
};

const getAllStudentChecklistSubmissions = async (req, res) => {
  try {
    const submissions = await StudentChecklist.find()
      .populate("student", "name email rollno")
      .populate("projectId");

    res.status(200).json({ success: true, submissions });
  } catch (error) {
    console.error("Fetch Submissions Error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching submissions",
    });
  }
};

// GET /api/head/projects-with-checklist
const getProjectsWithChecklist = async (req, res) => {
  try {
    // Fetch both project types
    const bankProjects = await ProjectBank.find()
      .populate("mentor", "name email")
      .populate("teamMembers", "name email");

    const ideaProjects = await ProjectIdea.find()
      .populate("mentor", "name email")
      .populate("teamMembers", "name email")
      .populate("teamLead", "name email");

    const allProjects = [...bankProjects, ...ideaProjects];

    // Add checklist + student uploads for each project
    const projectsWithChecklist = await Promise.all(
      allProjects.map(async (proj) => {
        const checklistItems = await Checklist.find();

        const checklistWithUploads = await Promise.all(
          checklistItems.map(async (item) => {
            const studentUploads = item.studentUploads.filter(
              (u) => String(u.project) === String(proj._id),
            );

            return {
              ...item.toObject(),
              studentUploads,
            };
          }),
        );

        return {
          ...proj.toObject(),
          checklist: checklistWithUploads,
        };
      }),
    );

    res.status(200).json({
      success: true,
      projects: projectsWithChecklist,
    });
  } catch (error) {
    console.error("Error fetching projects with checklist:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// frontend  function start here
const getAllProjectsCount = async (req, res) => {
  try {
    const ideaCount = await ProjectIdea.countDocuments();
    const assignedCount = await AssignedProject.countDocuments();
    const total = ideaCount + assignedCount;

    res.json({ ideaCount, assignedCount, total });
  } catch (err) {
    console.error("Error fetching project counts:", err);
    res.status(500).json({ message: "Server Error" });
  }
};

const getUpcomingInterview = async (req, res) => {
  try {
    // Fetch only interviews that have valid idea reference
    const upcoming = await Interview.findOne({}).sort({ date: 1 }).lean();

    if (!upcoming) {
      return res.status(200).json(null);
    }

    // Fetch project idea details
    const idea = await ProjectIdea.findById(upcoming.idea)

      .lean();

    return res.status(200).json({
      _id: upcoming._id,
      date: upcoming.date,
      time: upcoming.time,
      location: upcoming.location,
      notes: upcoming.notes,

      idea: idea
        ? {
            title: idea.title,
            description: idea.description,
            technology: idea.technology,
            teamLead: idea.teamLead,
            teamMembers: idea.teamMembers,
          }
        : null,
    });
  } catch (err) {
    console.error("Error in getUpcomingInterview:", err);
    return res.status(500).json({ error: "Server error" });
  }
};

// Count how many new project ideas are submitted
const getNewProjectIdeaCount = async (req, res) => {
  try {
    const count = await ProjectIdea.countDocuments({ status: "pending" });

    return res.status(200).json({
      success: true,
      newIdeaCount: count,
    });
  } catch (error) {
    console.error("Error counting new ideas:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

// 1️⃣ SUMMARY COUNTS
const getSummaryCounts = async (req, res) => {
  try {
    const totalIdeas = await ProjectIdea.countDocuments();
    const totalAssigned = await AssignedProject.countDocuments();

    return res.json({
      success: true,
      counts: {
        totalIdeas,
        totalAssigned,
      },
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

// ======================================
// 2️⃣ COMBINED PROJECTS (IDEA + ASSIGNED)
// ======================================
const getAllProjectsCombined = async (req, res) => {
  try {
    // ===========================
    // FETCH PROJECT IDEAS
    // ===========================
    const ideas = await ProjectIdea.find()
      .populate("mentor")
      .populate("teamMembers");

    const formattedIdeas = ideas.map((i) => ({
      type: "idea",
      id: i._id,
      title: i.title,
      description: i.description,
      technology: i.technology,
      status: i.status,
      teamLead: i.teamLead,
      teamMembers: i.teamMembers,
      mentor: i.mentor,
      academicYear: i.academicYear,
      branch: i.branch,
      section: i.section,
      group: i.group,
    }));

    // ===========================
    // FETCH ASSIGNED PROJECTS
    // ===========================
    const assigned = await AssignedProject.find()
      .populate("teamMembers")
      .populate("selectedMentor")
      .populate("approvedMentor");

    const formattedAssigned = assigned.map((a) => ({
      type: "assigned",
      id: a._id,
      title: a.title,
      description: a.description,
      technology: a.technology,
      status: a.status,
      teamLead: a.teamLead,
      teamMembers: a.teamMembers,
      selectedMentor: a.selectedMentor,
      approvedMentor: a.approvedMentor,
      academicYear: a.academicYear,
      branch: a.branch,
      section: a.section,
      group: a.group,
    }));

    // ===========================
    // MERGE BOTH LISTS
    // ===========================
    const allProjects = [...formattedIdeas, ...formattedAssigned];

    return res.json({
      success: true,
      total: allProjects.length,
      projects: allProjects,
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

const getChecklistMetrics = async (req, res) => {
  try {
    const { branch, section, group } = req.query;

    // 🔒 Hierarchy validation (DOES NOT AFFECT DEFAULT CASE)
    if (section && !branch) {
      return res.status(400).json({
        success: false,
        message: "Section requires branch",
      });
    }

    if (group && (!branch || !section)) {
      return res.status(400).json({
        success: false,
        message: "Group requires branch and section",
      });
    }

    // 🧠 Build filter ONLY if filters exist
    const filter = {};
    if (branch) filter.branch = branch;
    if (section) filter.section = section;
    if (group) filter.group = group;

    // 📋 All checklist items (same as before)
    const checklistItems = await Checklist.find().lean();

    // 📊 Count uploads per checklist (filtered or not)
    const counts = await Promise.all(
      checklistItems.map(async (item) => {
        const uploadedCount = await StudentChecklist.countDocuments({
          checklistItem: item._id.toString(),
          ...filter, // 👈 THIS LINE IS THE ONLY CHANGE
        });

        return {
          _id: item._id,
          title: item.title,
          uploadedCount, // 👈 unchanged
        };
      }),
    );

    return res.status(200).json({
      success: true,
      data: counts, // 👈 unchanged
    });
  } catch (error) {
    console.error("Error fetching checklist counts:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

const getChecklistFilters = async (req, res) => {
  try {
    const branches = await StudentChecklist.distinct("branch");
    const sections = await StudentChecklist.distinct("section");
    const groups = await StudentChecklist.distinct("group");

    return res.status(200).json({
      success: true,
      data: {
        branches: branches.filter(Boolean),
        sections: sections.filter(Boolean),
        groups: groups.filter(Boolean),
      },
    });
  } catch (err) {
    console.error("Filter fetch error:", err);
    res.status(500).json({ success: false });
  }
};

const registerHead = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if head already exists
    const existingHead = await Head.findOne({ email });
    if (existingHead) {
      return res.status(400).json({ message: "Head already exists" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new head
    const newHead = await Head.create({
      name,
      email,
      password: hashedPassword,
      role: "head"
    });

    res.status(201).json({
      message: "Head registered successfully",
      head: {
        id: newHead._id,
        name: newHead.name,
        email: newHead.email,
        role: newHead.role
      }
    });

  } catch (error) {
    console.error("Register Head Error:", error);
    res.status(500).json({ message: "Server error" });
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

module.exports = {
  getProjectsByYear,
  getAvailableYears,
  uploadStudentList,
  uploadMentorList,
  uploadProjectBankExcel,
  uploadHeadDocument,
  getHeadDocuments,
  downloadHeadDocument,
  deleteHeadDocument,
  getPendingIdeasForHead,
  reviewIdeaByHead,
  getReviewedIdeasForHead,
  getAcceptedIdeasForInterview,
  scheduleInterview,
  getAllInterviews,
  reviewInterview,
  sendMessage,
  getMessages,
  addChecklistItem,
  getChecklistItems,
  deleteChecklistItem,
  createForm3ForAllProjects,
  getForm3Head,
  deleteForm3,
  getAllStudentChecklistSubmissions,
  getProjectsWithChecklist,
  getAllProjectsCount,
  getUpcomingInterview,
  getNewProjectIdeaCount,
  getSummaryCounts,
  getAllProjectsCombined,
  getChecklistMetrics,
  getChecklistFilters,
  registerHead,
  getProjectDocuments,
};
