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
  getForm1ByProjectMentor,
  approveForm1,
  getAssignedForm1ByProject,
  approveAssignedForm1,
  getForm2ByProjectMentor,
  approveForm2,
  getProjectForm3,
  evaluateForm3Week,
} = require("../controllers/mentorController");

router.use(verifyToken, checkRole(["mentor"]));

router.get("/documents", getDocuments);
router.get("/documents/download/:id", downloadDocument);

router.get("/project", verifyToken, getMentorProject);
router.patch("/assigned-projects/:projectId/review",reviewAssignedProject);

// ===== Idea Projects =====
router.get("/idea-projects", verifyToken, getMentorIdeaProjects);
router.patch("/idea-projects/:id/review", verifyToken, reviewIdeaProject);

router.get("/approved-projects", getMyApprovedProjects);
router.get("/project-document/:projectId", getProjectDocuments);

//form1 (Idea)
router.get("/form1/:projectId", getForm1ByProjectMentor);
router.put("/form1/approve/:projectId", approveForm1);

//form1 (Assigned)
router.get("/assigned/form1/:projectId", getAssignedForm1ByProject);
router.put("/assigned/form1/approve/:projectId", approveAssignedForm1);

//form2
router.get("/form2/:projectId", getForm2ByProjectMentor);
router.put("/form2/approve/:projectId/:studentId", approveForm2);

// Form 3
router.get("/project/:projectId/form3", getProjectForm3);
router.post("/project/:projectId/form3/evaluate", evaluateForm3Week);

module.exports = router;
