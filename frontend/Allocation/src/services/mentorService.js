import api from "../utils/axios";

export const getDocuments = async () => {
  const res = await api.get("/mentor/documents");
  return res.data;
};

export const downloadDocument = async (id, fileName) => {
  const res = await api.get(`/mentor/documents/download/${id}`, {
    responseType: "blob",
  });

  // trigger download
  const url = window.URL.createObjectURL(new Blob([res.data]));
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", fileName);
  document.body.appendChild(link);
  link.click();
  link.remove();
};

export const getMentorProject = async () => {
  try {
    const res = await api.get("/mentor/project"); // no projectId needed
    return res.data;
  } catch (err) {
    console.error("Error fetching mentor project:", err);
    throw err.response?.data || err;
  }
};

// Approve or reject the project
export const reviewAssignedProject = async (action) => {
  try {
    const res = await api.patch("/mentor/project/review", { action });
    return res.data;
  } catch (err) {
    console.error("Error reviewing project:", err);
    throw err.response?.data || err;
  }
};

export const getMentorIdeaProjects = async () => {
  try {
    const res = await api.get("/mentor/idea-projects");
    return res.data;
  } catch (err) {
    console.error("Error fetching mentor idea projects:", err);
    throw err.response?.data || err;
  }
};

export const reviewIdeaProject = async (id, action, feedback) => {
  try {
    const res = await api.patch(`/mentor/idea-projects/${id}/review`, {
      action,
      feedback,
    });
    return res.data;
  } catch (err) {
    console.error("Error reviewing idea project:", err);
    throw err.response?.data || err;
  }
};

// Get mentor approved projects (Idea + Bank)
export const getMentorApprovedProjects = async () => {
  const res = await api.get("/mentor/approved-projects");
  return res.data;
};

export const getProjectDocuments = async (projectId) => {
  try {
    const res = await api.get(`/mentor/project-document/${projectId}`);

    return res.data;
  } catch (error) {
    console.error("Error fetching project documents:", error);
    throw error;
  }
};

export const getForm1ByProject = async (projectId) => {
  const res = await api.get(`/mentor/form1/${projectId}`);
  return res.data;
};

export const approveForm1 = async (projectId) => {
  const res = await api.put(`/mentor/form1/approve/${projectId}`);
  return res.data;
};
// Fetch all Form2 submissions for a specific project
export const getForm2ByProject = async (projectId) => {
  const res = await api.get(`/mentor/form2/${projectId}`);
  return res.data;
};

// Optionally, if you want to approve Form2 later
export const approveForm2 = async (projectId, studentId) => {
  const res = await api.put(`/mentor/form2/approve/${projectId}/${studentId}`);
  return res.data;
};

export const getProjectForm3 = async (projectId) => {
  const res = await api.get(`/mentor/project/${projectId}/form3`);
  return res.data;
};

export const evaluateForm3Week = async ({
  projectId,
  studentId,
  weekNumber,
  marks,
  mentorRemark,
}) => {
  if (!marks || marks < 1 || marks > 10) {
    throw { message: "Marks must be between 1 and 10" };
  }

  try {
    // Call backend route
    const res = await api.post(
      `/mentor/project/${projectId}/form3/evaluate`,
      { studentId, weekNumber, marks, mentorRemark } // studentId in body
    );
    return res.data;
  } catch (err) {
    console.error("Error evaluating Form3 week:", err);
    throw err.response?.data || err;
  }
};  