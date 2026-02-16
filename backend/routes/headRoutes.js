//src: backend/routes/headRoutes.js
const express = require("express");
const router = express.Router();
const multer = require("multer");
const { verifyToken, checkRole } = require("../middleware/authMiddleware");
const {
  uploadProjectBankExcel,
  uploadStudentList,
  uploadMentorList,
  uploadHeadDocument,
  getHeadDocuments,
  deleteHeadDocument,
  downloadHeadDocument,
  getAvailableYears,
  getProjectsByYear,
  getPendingIdeasForHead,
  reviewIdeaByHead,
  getReviewedIdeasForHead,
  getAcceptedIdeasForInterview,
  scheduleInterview,
  getAllInterviews,
  reviewInterview,
  sendMessage,
  getMessages,
  createForm3ForAllProjects,
  getForm3Head,
  deleteForm3,
  addChecklistItem,
  getChecklistItems,
  deleteChecklistItem,
  getAllStudentChecklistSubmissions,
  getProjectsWithChecklist,
  getAllProjectsCount,
  getUpcomingInterview,
  getNewProjectIdeaCount,
  getSummaryCounts,
  getAllProjectsCombined,
  getChecklistMetrics,
  getChecklistFilters,
} = require("../controllers/headController");
const upload = multer({ dest: "uploads/" });

// ✅ Middleware for head access
router.use(verifyToken, checkRole(["head"]));

// year
router.get("/projects", verifyToken, checkRole(["head"]), getProjectsByYear);
router.get("/years", verifyToken, checkRole(["head"]), getAvailableYears);

// File Uploads
router.post("/upload-project-bank",upload.single("file"),uploadProjectBankExcel);
router.post("/upload-student-list", upload.single("file"), uploadStudentList);
router.post("/upload-mentor-list", upload.single("file"), uploadMentorList);
router.post("/upload-document", upload.single("file"), uploadHeadDocument);

// Document management
router.get("/documents", getHeadDocuments);
router.delete("/documents/:id", deleteHeadDocument);
router.get("/documents/download/:id", downloadHeadDocument);

// Idea management
router.get("/pending-ideas", getPendingIdeasForHead);
router.put("/idea-review/:id", reviewIdeaByHead);
router.get("/idea-reviewed", getReviewedIdeasForHead);
router.get("/idea-accepted", getAcceptedIdeasForInterview);
// Interview management
router.put("/idea-interview/:id", scheduleInterview);
router.get("/idea-scheduled-interviews", getAllInterviews);
router.put("/idea-review-interview/:id", reviewInterview);

// Message management
router.post("/message/send", sendMessage);
router.get("/message/get", getMessages);

//Form 3
// CREATE
router.post("/form3", createForm3ForAllProjects);
router.get("/form3/:academicYear", getForm3Head);
router.delete("/form3/:academicYear/:weekNumber", deleteForm3);


// Checklist management
router.post("/checklist", addChecklistItem);
router.get("/getchecklist", getChecklistItems);
router.delete("/checklist/:id", deleteChecklistItem);
router.get("/checklist/submissions", getAllStudentChecklistSubmissions);
router.get("/projects-with-checklist",verifyToken,checkRole(["head"]),getProjectsWithChecklist);

//frontend routes
router.get("/all-projects-count", getAllProjectsCount);
router.get("/interview/upcoming", getUpcomingInterview);
router.get("/new-ideas-count", getNewProjectIdeaCount);

router.get("/me", verifyToken, checkRole(["head"]), (req, res) => {
  const { name, email, role } = req.user; // coming directly from token
  res.json({ name, email, role });
});

// Summary counts
router.get("/dashboard/summary", getSummaryCounts);

// All projects (ideas + assigned)
router.get("/dashboard/projects", getAllProjectsCombined);

router.get("/dashboard/checklist-metrics", getChecklistMetrics);
router.get("/checklist/filters",getChecklistFilters);

module.exports = router;
