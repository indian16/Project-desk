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
  getMyApprovedProjects,
  getProjectDocuments,
  getForm1ByProject,
  approveForm1,
  getForm2ByProject,
  approveForm2,
  getProjectForm3,
  evaluateForm3Week,
} = require("../controllers/mentorController");

router.use(verifyToken, checkRole(["mentor"]));

router.get("/documents", getDocuments);
router.get("/documents/download/:id", downloadDocument);

router.get("/project", verifyToken, getMentorProject);
router.patch("/project/review", verifyToken, reviewAssignedProject);

// ===== Idea Projects =====
router.get("/idea-projects", verifyToken, getMentorIdeaProjects);
router.patch("/idea-projects/:id/review", verifyToken, reviewIdeaProject);

router.get("/approved-projects", getMyApprovedProjects);
router.get("/project-document/:projectId", getProjectDocuments);

//form1
router.get("/form1/:projectId", getForm1ByProject);
router.put("/form1/approve/:projectId",  approveForm1);

//form2
router.get("/form2/:projectId",getForm2ByProject,);
router.put("/form2/approve/:projectId/:studentId", approveForm2);

// Form 3
router.get("/project/:projectId/form3", getProjectForm3);
router.post("/project/:projectId/form3/evaluate", evaluateForm3Week);

module.exports = router;
