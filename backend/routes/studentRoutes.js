const express = require("express");
const router = express.Router();
const { verifyToken, checkRole } = require("../middleware/authMiddleware");
const upload = require("../middleware/upload");
const {
  submitProjectBankForm,
  submitProjectIdeaForm,
  getMyIdeaProject,
  getMyAssignedProject,
  getProjectBankList,
  getMentorList,
  selectMentorsForProject,
  getDocuments,
  downloadDocument,
  getChecklist,
  uploadChecklistFile,
  getForm1ByProject,
  saveForm2,
  getForm2ByProject,
  saveForm1,
  getForm3,
  submitForm3Week,
} = require("../controllers/studentController");

// ✅ Protect all routes for students
router.use(verifyToken, checkRole(["student"]));

// ✅ Existing routes
router.post("/submit-idea", submitProjectIdeaForm);
router.get("/project-bank", getProjectBankList);
router.post("/submit-bank", submitProjectBankForm);
router.get("/idea-project", getMyIdeaProject);
router.get("/assigned-project", getMyAssignedProject);
router.get("/mentors", getMentorList);
router.post("/select-mentors", selectMentorsForProject);
router.get("/documents", getDocuments);
router.get("/documents/download/:id", downloadDocument);


// ✅ Checklist routes
router.get("/project/checklist", getChecklist);
router.post("/project/upload-checklist",upload.single("file"), uploadChecklistFile);

// ✅ New Form1 and Form2 routes
router.get("/form1",  getForm1ByProject);
router.post("/form1/save",  saveForm1);
router.get("/form2/project",  getForm2ByProject);
router.post("/form2/save",  saveForm2);
router.get("/form3", getForm3);
router.post("/form3/week", submitForm3Week);

module.exports = router;