//studentservice.js
import api from "../utils/axios";

// Get all projects from project bank
export const getProjectBankList = async () => {
  try {
    const res = await api.get("/student/project-bank");
    return res.data.projects || [];
  } catch (error) {
    console.error("Error fetching project bank list:", error);
    return [];
  }
};

// Submit project selection from bank
export const submitProjectBankForm = async (formData) => {
  try {
    const payload = {
      student: localStorage.getItem("studentId"),
      projectId: formData.projectId,
      title: formData.title,
      description: formData.description,
      technology: formData.technology,
      selectedMentor1: formData.selectedMentor1, // Mentor ID
      selectedMentor2: formData.selectedMentor2, // Mentor ID
      selectedMentor3: formData.selectedMentor3, // Mentor ID
      teamMembers: formData.teamMembers || [],
      teamLead: {
        id: localStorage.getItem("studentId"),
        name: localStorage.getItem("studentName"),
        email: localStorage.getItem("studentEmail"),
      },
      academicYear: localStorage.getItem("academicYear"),
      branch: localStorage.getItem("branch"),
      section: localStorage.getItem("section"),
      group: localStorage.getItem("group"),
    };

    const res = await api.post("/student/submit-bank", payload);
    return res.data.data;
  } catch (error) {
    console.error("Error submitting project bank form:", error);
    throw new Error(
      error.response?.data?.message || "Failed to submit project bank form",
    );
  }
};

// Submit project idea form
export const submitProjectIdeaForm = async (formData) => {
  try {
    const payload = {
      title: formData.title,
      description: formData.description,
      technology: formData.technology,
      teamMembers: formData.teamMembers || [],
    };

    // ✅ Only add mentor if provided
    if (formData.mentor) {
      payload.mentor = formData.mentor;
    }

    const res = await api.post("/student/submit-idea", payload);
    return res.data.data; // projectIdea from backend
  } catch (error) {
    console.error("Error submitting project idea:", error);
    throw new Error(
      error.response?.data?.message || "Failed to submit project idea",
    );
  }
};

// Get my idea project
export const getMyIdeaProject = async () => {
  try {
    const res = await api.get("/student/idea-project");
    return res.data.projectIdea;
  } catch (error) {
    console.error("Error fetching idea project:", error);
    throw new Error(
      error.response?.data?.message || "Failed to fetch idea project",
    );
  }
};

// Get student's assigned project only
export const getMyAssignedProject = async () => {
  try {
    const res = await api.get("/student/assigned-project");
    return res.data.project;
  } catch (error) {
    console.error("Error fetching assigned project:", error);
    throw new Error(
      error.response?.data?.message || "Failed to fetch assigned project",
    );
  }
};

export const getMentorList = async () => {
  try {
    const res = await api.get("/student/mentors");

    if (Array.isArray(res.data)) {
      return res.data;
    } else if (res.data && Array.isArray(res.data.mentors)) {
      return res.data.mentors;
    } else {
      console.warn("Unexpected mentor data:", res.data);
      return [];
    }
  } catch (err) {
    console.error("Error fetching mentors:", err);
    return [];
  }
};

export const selectMentorsForProject = async ({
  projectId,
  selectedMentor1,
  selectedMentor2,
  selectedMentor3,
}) => {
  try {
    const res = await api.post("/student/select-mentors", {
      projectId,
      selectedMentor1,
      selectedMentor2,
      selectedMentor3,
    });

    return res.data;
  } catch (err) {
    console.error("Error selecting mentors:", err);
    throw new Error(err.response?.data?.message || "Failed to select mentors");
  }
};

export const getDocuments = async () => {
  const res = await api.get("/student/documents");
  return res.data;
};

export const downloadDocument = async (id, fileName) => {
  const res = await api.get(`/student/documents/download/${id}`, {
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

export const assignMentorToProject = async ({ projectId, mentorId }) => {
  try {
    const res = await api.post("/student/submit-idea", {
      projectId,
      mentor: mentorId,
    });
    return res.data.data; // updated project
  } catch (error) {
    console.error("Error assigning mentor:", error);
    throw new Error(error.response?.data?.message || "Failed to assign mentor");
  }
};

export const getChecklist = async () => {
  try {
    const res = await api.get("/student/project/checklist");
    return res.data; // ✅ return full object
  } catch (error) {
    console.error("Error fetching checklist:", error);
    throw new Error(
      error.response?.data?.message || "Failed to fetch checklist",
    );
  }
};

// ⬆ Upload a student checklist file (with title)
export const uploadChecklistFile = async (formData) => {
  try {
    const data = new FormData();
    data.append("file", formData.file);
    data.append("title", formData.title);

    const res = await api.post("/student/project/upload-checklist", data, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    return res.data;
  } catch (error) {
    console.error("Error uploading checklist document:", error);
    throw new Error(
      error.response?.data?.message || "Failed to upload checklist document",
    );
  }
};

export const saveForm1 = async (formData) => {
  try {
    const res = await api.post("/student/form1/save", formData);
    return res.data;
  } catch (error) {
    console.error("Error saving Form 1:", error);
    throw new Error(error.response?.data?.message || "Failed to save Form 1");
  }
};

export const getMyForm1 = async () => {
  try {
    const res = await api.get("/student/form1");
    return res.data;
  } catch (error) {
    console.error("Error fetching Form 1:", error);
    throw new Error(error.response?.data?.message || "Error fetching Form 1");
  }
};

// ✅ Save or update Form 2
export const saveForm2 = async (formData) => {
  try {
    const res = await api.post("/student/form2/save", formData);
    return res.data;
  } catch (error) {
    console.error("Error saving Form 2:", error);
    throw new Error(error.response?.data?.message || "Failed to save Form 2");
  }
};

// ✅ Get all Form 2 entries for the logged-in student's project
export const getForm2ByProject = async () => {
  try {
    const res = await api.get("/student/form2");
    return res.data;
  } catch (error) {
    console.error("Error fetching Form 2 data:", error);
    throw new Error(
      error.response?.data?.message || "Failed to fetch Form 2 data",
    );
  }
};

export const getForm3 = async () => {
  const res = await api.get("/student/form3");
  return res.data;
};

export const submitForm3Week = async (formData) => {
  try {
    const res = await api.post(`/student/form3/week`, formData);
    return res.data;
  } catch (error) {
    console.error("Error submitting Form 3 week:", error);
    throw new Error(
      error.response?.data?.message || "Failed to submit Form 3 week"
    );
  }
};