// src/pages/student/StudentDashboard.jsx
import React, { useEffect, useState } from "react";
import SideMenu from "../../components/SideMenu";
import Navbar from "../../components/Navbar";
import ProjectIdeaForm from "./ProjectIdeaForm";
import ProjectBankForm from "./ProjectBankForm";
import MentorList from "./MentorList";
import Documentation from "./Documentation";
import StudentMessage from "./StudentMessage";
import StudentPipeline from "./StudentPipeline";
import Form1Student from "./Form1Student";
import Form2Student from "./Form2Student";
import Form3Student from "./Form3Student";
import {
  getMyAssignedProject,
  getMyIdeaProject,
} from "../../services/studentService";
import api from "../../utils/axios";

/* ================= CHECKLIST MODAL ================= */
const ChecklistModal = ({ isOpen, onClose, projectId }) => {
  const [checklist, setChecklist] = useState([]);
  const [projectTitle, setProjectTitle] = useState("");
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (isOpen) fetchChecklist();
  }, [isOpen]);

  const fetchChecklist = async () => {
    try {
      const res = await api.get("/student/project/checklist");
      setChecklist(res.data.checklist || []);
      setProjectTitle(res.data.title);
    } catch (err) {
      console.error(err);
    }
  };

  const handleFileUpload = async (e, item) => {
    e.stopPropagation();
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);
    formData.append("title", item.title);
    formData.append("projectId", projectId);
    formData.append("checklistItemId", item.checklistId || item._id);

    try {
      setUploading(true);
      await api.post("/student/project/upload-checklist", formData);
      fetchChecklist();
    } catch (err) {
      console.error(err);
    } finally {
      setUploading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-xl w-full max-w-2xl p-6 shadow-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-slate-800">
            Checklist – {projectTitle}
          </h2>
          <button
            onClick={onClose}
            className="text-slate-500 hover:text-slate-700"
          >
            ✕
          </button>
        </div>

        {checklist.length === 0 ? (
          <p className="text-sm text-slate-500">
            No checklist items available.
          </p>
        ) : (
          <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
            {checklist.map((item) => (
              <div
                key={item.checklistId || item._id}
                className="border rounded-lg p-4 flex justify-between items-center"
              >
                <div>
                  <p className="font-medium text-slate-800">{item.title}</p>
                  <p
                    className={`text-xs mt-1 font-medium ${
                      item.status === "submitted"
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    {item.status?.toUpperCase()}
                  </p>

                  {item.fileName && (
                    <p className="text-xs text-slate-500 mt-1">
                      📄 {item.fileName}
                    </p>
                  )}
                </div>

                <label className="cursor-pointer text-blue-600 font-medium hover:underline">
                  {item.status === "submitted"
                    ? "Replace file"
                    : "Upload file"}
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx"
                    onChange={(e) => handleFileUpload(e, item)}
                    disabled={uploading}
                    className="hidden"
                  />
                </label>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

/* ================= DASHBOARD CARDS ================= */
const DashboardCards = ({ assignProject, ideaProject, onChecklistOpen }) => {
  const renderCard = (project, title) => {
    if (!project) {
      return (
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <h2 className="text-lg font-semibold text-slate-800 mb-2">{title}</h2>
          <p className="text-sm text-slate-500">
            No project submitted yet.
          </p>
        </div>
      );
    }

    const mentorName =
      project.selectedMentor?.name ||
      project.approvedMentor?.name ||
      project.mentor?.name ||
      "Not assigned";

    const statusText = project.status
      ? project.status.replace("_", " ")
      : "Pending";

    const statusColor = statusText.toLowerCase().includes("pending")
      ? "bg-yellow-100 text-yellow-700"
      : statusText.toLowerCase().includes("approved") ||
        statusText.toLowerCase().includes("passed")
      ? "bg-green-100 text-green-700"
      : "bg-red-100 text-red-700";

    return (
      <div className="bg-white rounded-xl shadow-sm border hover:shadow-md transition p-6 flex flex-col">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold text-slate-800">{title}</h2>
          <span
            className={`text-xs px-3 py-1 rounded-full font-medium ${statusColor}`}
          >
            {statusText}
          </span>
        </div>

        <h3 className="text-base font-semibold text-slate-900 mb-1">
          {project.title}
        </h3>
        <p className="text-sm text-slate-600 mb-4 line-clamp-2">
          {project.description}
        </p>

        <div className="space-y-2 text-sm text-slate-700">
          <p>
            <span className="font-medium">Mentor:</span> {mentorName}
          </p>
        </div>

        <div className="mt-6">
          <button
            onClick={() => onChecklistOpen(project._id)}
            className="w-full bg-blue-600 text-white text-sm font-medium py-2 rounded-lg hover:bg-blue-700 transition"
          >
            View Checklist
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {renderCard(ideaProject, "My Project Idea")}
      {renderCard(assignProject, "My Assigned Project")}
    </div>
  );
};

/* ================= MAIN DASHBOARD ================= */
const StudentDashboard = () => {
  const [section, setSection] = useState("dashboard");
  const [assignedProject, setAssignedProject] = useState(null);
  const [ideaProject, setIdeaProject] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [checklistOpenId, setChecklistOpenId] = useState(null);
  const [checklist, setChecklist] = useState([]);

  useEffect(() => {
    if (section !== "dashboard") return;

    const fetchDashboardData = async () => {
      setLoading(true);
      setError("");
      try {
        const [project, idea, checklistRes] = await Promise.all([
          getMyAssignedProject(),
          getMyIdeaProject(),
          api.get("/student/project/checklist"),
        ]);

        setAssignedProject(project);
        setIdeaProject(idea);
        setChecklist(checklistRes.data.checklist || []);
      } catch (err) {
        console.error(err);
        setError("Failed to load project data.");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [section]);

  return (
    <div className="flex flex-col h-screen w-full bg-gray-100">
      <Navbar />
      <div className="flex flex-1 overflow-hidden">
        <SideMenu activeMenu={section} setSection={setSection} />
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-7xl mx-auto px-6 py-6">
            {loading ? (
              <div className="text-center py-20 text-slate-500">
                Loading...
              </div>
            ) : error ? (
              <div className="text-center py-20 text-red-500">
                {error}
              </div>
            ) : section === "dashboard" ? (
              <>
                <StudentPipeline
                  project={ideaProject || assignedProject}
                  checklist={checklist}
                />

                <DashboardCards
                  assignProject={assignedProject}
                  ideaProject={ideaProject}
                  onChecklistOpen={(projectId) =>
                    setChecklistOpenId(projectId)
                  }
                />

                {checklistOpenId && (
                  <ChecklistModal
                    isOpen={!!checklistOpenId}
                    onClose={() => setChecklistOpenId(null)}
                    projectId={checklistOpenId}
                  />
                )}
              </>
            ) : section === "projectIdea" ? (
              <ProjectIdeaForm />
            ) : section === "projectBank" ? (
              <ProjectBankForm />
            ) : section === "mentorList" ? (
              <MentorList />
            ) : section === "messages" ? (
              <StudentMessage />
            ) : section === "documentation" ? (
              <Documentation />
            ) : section === "form1" ? (
              <Form1Student />
            ) : section === "form2" ? (
              <Form2Student />
            ) : section === "form3" ? (
              <Form3Student />
            ) : (
              <div className="text-center py-20 text-slate-500">
                Invalid section
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default StudentDashboard;
