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
import StudentChecklist from "./StudentChecklist";

import {
  getMyAssignedProject,
  getMyIdeaProject,
} from "../../services/studentService";

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
        <p className="text-sm text-slate-600 mb-4 line-clamp-2">
          <span className="font-medium">Technology:</span> {project.technology}
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

  useEffect(() => {
    if (section !== "dashboard") return;

    const fetchDashboardData = async () => {
      setLoading(true);
      setError("");
      try {
        const [project, idea] = await Promise.all([
          getMyAssignedProject(),
          getMyIdeaProject(),
        ]);

        setAssignedProject(project);
        setIdeaProject(idea);
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
                />

                <DashboardCards
                  assignProject={assignedProject}
                  ideaProject={ideaProject}
                  onChecklistOpen={(projectId) =>
                    setChecklistOpenId(projectId)
                  }
                />

                {checklistOpenId && (
                  <StudentChecklist
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
