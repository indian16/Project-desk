// src/services/headService.js
import api from "../utils/axios";

/* -------------------- IDEA MANAGEMENT -------------------- */

// Fetch pending project ideas for a specific academic year
export const getPendingIdeasForHead = async (academicYear) => {
  const res = await api.get(`/head/pending-ideas`, {
    params: { academicYear },
  });
  return res.data;
};

// Review (approve or reject) a project idea
export const reviewIdeaByHead = async (ideaId, action, reason = "") => {
  const res = await api.put(`/head/idea-review/${ideaId}`, { action, reason });
  return res.data;
};

export const getReviewedIdeasForHead = async (academicYear) => {
  const res = await api.get("/head/idea-reviewed", {
    params: { academicYear },
  });
  return res.data;
};
/* -------------------- INTERVIEW MANAGEMENT -------------------- */

export const getAcceptedIdeasForInterview = async () => {
  const res = await api.get("/head/idea-accepted");
  return res.data;
};

// Schedule an interview for a project idea
export const scheduleInterview = async (id, interviewDetails) => {
  // interviewDetails = { date, time, location, notes }
  const res = await api.put(`/head/idea-interview/${id}`, interviewDetails);
  return res.data;
};

export const getScheduledInterviews = async (academicYear) => {
  const res = await api.get("/head/idea-scheduled-interviews", {
    params: academicYear ? { academicYear } : {},
  });
  return res.data;
};

// Review interview (pass / fail only, no feedback)
export const reviewInterview = async (id, action) => {
  const res = await api.put(`/head/idea-review-interview/${id}`, { action });
  return res.data;
};

/* -------------------- UPLOAD MANAGEMENT -------------------- */

// Upload Project Bank Excel file
export const uploadProjectBank = async (file, year) => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("year", year);

  const res = await api.post("/head/upload-project-bank", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

  return res.data;
};

// Upload Student List Excel file
export const uploadStudentList = async (file, year) => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("year", year);

  const res = await api.post("/head/upload-student-list", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

  return res.data;
};

// Upload Mentor List Excel file
export const uploadMentorList = async (file) => {
  const formData = new FormData();
  formData.append("file", file);

  const res = await api.post("/head/upload-mentor-list", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

  return res.data;
};

/* -------------------- YEAR MANAGEMENT -------------------- */

// Fetch available academic years
export const getAvailableYears = async () => {
  const res = await api.get("/head/years"); // <-- here is the API call
  return res.data;
};

export const getProjectsByYear = async (year) => {
  const res = await api.get("/head/projects", { params: { year } });
  return res.data;
};

/* -------------------- DOCUMENT MANAGEMENT -------------------- */

export const uploadDocument = async (file, title) => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("title", title);

  const res = await api.post("/head/upload-document", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

  return res.data;
};

// Get all uploaded documents
export const getDocuments = async () => {
  const res = await api.get(`/head/documents`);
  return res.data;
};

// Delete a document by ID
export const deleteDocument = async (id) => {
  const res = await api.delete(`/head/documents/${id}`);
  return res.data;
};

// Download a document by ID
export const downloadDocument = async (id, fileName) => {
  try {
    const response = await api.get(`/head/documents/download/${id}`, {
      responseType: "blob", // important for file download
    });

    // Create a link to download
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", fileName || "document");
    document.body.appendChild(link);
    link.click();
    link.remove();
  } catch (error) {
    console.error("Download error:", error);
    throw error;
  }
};

/* -------------------- MESSAGE MANAGEMENT -------------------- */
export const sendMessage = async (payload) => {
  if (!payload?.content || !payload?.receiverRoles?.length) {
    throw new Error("Invalid message data"); // This is where your error comes from
  }
  const res = await api.post("head/message/send", payload);
  return res.data;
};

export const getMessages = async () => {
  const res = await api.get("/head/message/get"); // 🔹 include /head prefix
  return res.data?.data || [];
};

// ➕ Add Checklist Item
export const addChecklistItem = async (data) => {
  const res = await api.post(`/head/checklist`, data);
  return res.data;
};

// 📜 Get All Checklist Items (Optional Academic Year Filter)
export const getChecklistItems = async (academicYear) => {
  const res = await api.get(`/head/getchecklist`, {
    params: academicYear ? { academicYear } : {},
  });
  return res.data;
};

// ❌ Delete Checklist Item
export const deleteChecklistItem = async (id) => {
  const res = await api.delete(`/head/checklist/${id}`);
  return res.data;
};

// 📂 Get All Student Checklist Submissions for a specific checklist item
export const getAllStudentChecklistSubmissions = async (checklistItemId) => {
  const res = await api.get(`/head/checklist/submissions`, {
    params: { checklistItemId },
  });
  return res.data;
};

// 📊 Get all projects with checklist status
export const getProjectsWithChecklist = async (academicYear) => {
  const res = await api.get(`/head/projects-with-checklist`, {
    params: academicYear ? { academicYear } : {},
  });
  return res.data;
};

// frontend service
export const getAllProjectsCount = async () => {
  const res = await api.get("/head/all-projects-count");
  return res.data;
};

export const getUpcomingInterview = async () => {
  const res = await api.get("/head/interview/upcoming");
  return  res.data;
};

export const getNewProjectIdeaCount = async () => {
  const res = await api.get("/head/new-ideas-count");
  return res.data;
};

export const getHeadProfile = async () => {
  const res = await api.get("/head/me");
  return res.data;
};

// ------------------------------
// 1️⃣ GET SUMMARY COUNTS
// ------------------------------
export const getSummaryCounts = async () => {
  const res = await api.get("/head/dashboard/summary");
  return res.data;
};

// ------------------------------
// 2️⃣ GET ALL COMBINED PROJECTS
// ------------------------------
export const getAllCombinedProjects = async () => {
  const res = await api.get("/head/dashboard/projects");
  return res.data;   // returning only project list
};

export const getChecklistFilters = async () => {
  const res = await api.get("head/checklist/filters");
  return res.data;
};

export const getChecklistMetrics = async (filters = {}) => {
  const res = await api.get("head/dashboard/checklist-metrics", {
    params: filters,
  });
  return res.data;
};

export const createForm3ForAllProjects = async (formData) => {
  const res = await api.post("/head/form3", formData);
  return res.data;
};

export const getForm3Head = async (academicYear) => {
  const res = await api.get(`/head/form3/${academicYear}`);
  return res.data;
};

export const deleteForm3 = async (academicYear, weekNumber) => {
  const res = await api.delete(
    `/head/form3/${academicYear}/${weekNumber}`
  );
  return res.data;
};

// 👑 REGISTER HEAD (only head allowed)
export const registerHead = async (data) => {
  const res = await api.post("head/register-head", data);
  return res.data;
};

export const getProjectDocuments = async (projectId) => {
  try {
    const res = await api.get(
      `head/project-documents/${projectId}`
    );

    return res.data; 
  
  } catch (error) {
    console.error("Error fetching project documents:", error);
    throw error;
  }
};


export const getTotalProjects = async () => ({ count: 0 });
export const getTotalForms = async () => ({ count: 0 });
export const getTotalSRS = async () => ({ count: 0 });
export const getTotalMentors = async () => ({ count: 0 });
export const getTotalTeams = async () => ({ count: 0 });