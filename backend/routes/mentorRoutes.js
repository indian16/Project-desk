const express = require("express");
const router = express.Router();
const { verifyToken, checkRole } = require("../middleware/authMiddleware");
const {
  getDocuments,
  downloadDocument,
  getMentorProject,
  reviewAssignedProject,
  getMentorIdeaProjects,
  reviewIdeaProject,
} = require("../controllers/mentorController");

router.use(verifyToken, checkRole(["mentor"]));


router.get("/documents", getDocuments);
router.get("/documents/download/:id", downloadDocument);

// GET /api/mentor/project
// Mentor automatically sees the project selected by the student
router.get("/project", verifyToken, getMentorProject);

// PATCH /api/mentor/project/review
// Mentor approves or rejects the assigned project
router.patch("/project/review", verifyToken, reviewAssignedProject);

// ===== Idea Projects =====
router.get("/idea-projects", verifyToken, getMentorIdeaProjects);
router.patch("/idea-projects/:id/review", verifyToken, reviewIdeaProject);

module.exports = router;
