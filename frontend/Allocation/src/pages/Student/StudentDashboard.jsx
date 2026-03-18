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
import api from "../../utils/axios";

import { getMyAssignedProject, getMyIdeaProject } from "../../services/studentService";
import ProjectDetails from "./ProjectDetails";
import { motion, AnimatePresence } from "framer-motion";

/* ================= DASHBOARD CARDS ================= */
const DashboardCards = ({ assignProject, ideaProject, loading, onChecklistOpen, onSelectMentorClick }) => {
  const renderCard = (project, title, type) => {
    if (loading) {
      return (
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 flex flex-col h-[500px] p-5 animate-pulse w-full">
          <div className="h-6 bg-gray-300 rounded w-3/4 mb-3"></div>
          <div className="h-4 bg-gray-300 rounded w-full mb-2"></div>
          <div className="h-4 bg-gray-300 rounded w-full mb-2"></div>
          <div className="h-4 bg-gray-300 rounded w-5/6 mt-auto"></div>
        </div>
      );
    }

    if (!project) {
      return (
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 flex flex-col h-[500px] p-5 w-full">
          <h2 className="text-lg font-bold text-slate-800 mb-4">{title}</h2>
          <p className="text-sm text-slate-500 mt-auto">No project submitted yet.</p>
        </div>
      );
    }

   // Mentor display logic
let mentorDisplay = "Pending";
let mentorEmail = "";

if (type === "idea") {
  // For ideaProject, use confirmedMentor if present
  if (project.confirmedMentor) {
    mentorDisplay = project.confirmedMentor.name;
    mentorEmail = project.confirmedMentor.email;
  }
} else {
  // For assigned project
  mentorDisplay = project.mentorName || project.approvedMentor?.name || "Pending";
  mentorEmail = project.approvedMentor?.email || "";
}
    const statusText = project.status ? project.status.replaceAll("_", " ") : "Pending";
    const statusColor = statusText.toLowerCase().includes("pending")
      ? "bg-yellow-100 text-yellow-700"
      : statusText.toLowerCase().includes("approve") || statusText.toLowerCase().includes("passed")
      ? "bg-green-100 text-green-700"
      : "bg-red-100 text-red-700";

    // Team Lead
let teamLeadName = "N/A";
let teamLeadEmail = "-";

if (type === "idea") {
  teamLeadName = project.teamLead?.name || project.teamMembers?.[0]?.name || "N/A";
  teamLeadEmail = project.teamLead?.email || project.teamMembers?.[0]?.email || "-";
} else {
  teamLeadName = project.assignedTeamLead?.name || project.teamMembers?.[0]?.name || "N/A";
  teamLeadEmail = project.assignedTeamLead?.email || project.teamMembers?.[0]?.email || "-";
}

    return (
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 flex flex-col h-[500px] p-5 w-full">
        <div className="flex-1 overflow-y-auto pr-1">
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-lg font-bold text-slate-800">{project.title}</h3>
            <span className={`text-xs px-2 py-1 rounded-full font-semibold ${statusColor}`}>
              {statusText}
            </span>
          </div>

          <p className="text-sm text-slate-600 mb-3 line-clamp-3">{project.description}</p>

          <div className="mb-3 space-y-1">
            <p className="text-xs font-bold text-gray-400 uppercase">Academic Info</p>
            <p className="text-sm"><span className="font-medium">Year:</span> {project.academicYear || "N/A"}</p>
            <p className="text-sm"><span className="font-medium">Branch:</span> {project.branch || "N/A"}</p>
            <p className="text-sm"><span className="font-medium">Section:</span> {project.section || "N/A"}</p>
            <p className="text-sm"><span className="font-medium">Group:</span> {project.group || "N/A"}</p>
            <p className="text-sm"><span className="font-medium">Technology:</span> {project.technology || "N/A"}</p>
          </div>

          <div className="mb-3 space-y-1">
            <p className="text-xs font-bold text-gray-400 uppercase">Mentor</p>
            <p className="text-sm font-semibold">{mentorDisplay}</p>
            {mentorEmail && <p className="text-xs text-gray-500">{mentorEmail}</p>}
          </div>

          <div className="bg-blue-50 p-3 rounded-lg mb-3">
            <p className="text-xs font-bold text-blue-700">Team Lead</p>
            <p className="text-sm font-semibold">{teamLeadName}</p>
            {teamLeadEmail && <p className="text-xs text-gray-500">{teamLeadEmail}</p>}
          </div>

          <div className="mb-3">
            <p className="text-xs font-bold text-gray-400 uppercase mb-1">Team Members</p>
            <div className="space-y-1 max-h-24 overflow-y-auto">
              {project.teamMembers?.length > 0 ? (
                project.teamMembers.map((member, idx) => (
                  <div
                    key={member._id || `${member.email}-${idx}`}
                    className="bg-gray-50 px-3 py-2 rounded text-sm"
                  >
                    <p className="font-medium">{member.name}</p>
                    <p className="text-xs text-gray-500">{member.email}</p>
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-500">No members assigned</p>
              )}
            </div>
          </div>
        </div>

        <div className="mt-4 pt-3 border-t flex flex-col gap-2">
          <button
            onClick={() => onChecklistOpen(project._id)}
            className="w-full bg-blue-600 text-white py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition"
          >
            View Checklist
          </button>

          {type === "idea" && ["interview_passed", "approved_by_mentor"].includes(project.status) && (
            <button
              onClick={() => onSelectMentorClick()}
              disabled={project.mentorName && project.mentorName !== "Pending"}
              className={`w-full py-2 rounded-lg text-sm font-medium ${
                project.mentorName && project.mentorName !== "Pending"
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-green-600 text-white hover:bg-green-700"
              }`}
            >
              {project.mentorName && project.mentorName !== "Pending" ? "Mentor Assigned" : "Select Mentor"}
            </button>
          )}

          {type === "idea" && !["interview_passed", "approved_by_mentor"].includes(project.status) && (
            <button
              disabled
              className="w-full bg-gray-400 text-white py-2 rounded-lg text-sm cursor-not-allowed"
            >
              Interview Not Passed
            </button>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 w-full">
      {renderCard(ideaProject, "My Project Idea", "idea")}
      {renderCard(assignProject, "My Assigned Project", "assigned")}
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
  const [form1, setForm1] = useState(null);
  const [form2, setForm2] = useState(null);
  const [form3, setForm3] = useState(null);

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

const toggleSidebar = (state) => {
  if (typeof state === "boolean") {
    setIsSidebarOpen(state);
  } else {
    setIsSidebarOpen((prev) => !prev);
  }
};

  useEffect(() => {
    if (section !== "dashboard") return;

    const fetchDashboardData = async () => {
      setLoading(true);
      setError("");
      try {
        const [assigned, idea] = await Promise.all([getMyAssignedProject(), getMyIdeaProject()]);
        setAssignedProject(assigned);
        setIdeaProject(idea);

        const activeProject = idea || assigned;
        if (activeProject?._id) {
          const [checklistRes, form1Res, form2Res, form3Res] = await Promise.all([
            api.get("/student/project/checklist", { params: { projectId: activeProject._id } }),
            api.get("/student/form1"),
            api.get("/student/form2"),
            api.get("/student/form3"),
          ]);

          setChecklist(Array.isArray(checklistRes.data?.checklist) ? checklistRes.data.checklist : []);
          setForm1(form1Res.data?.form1 ?? null);
          setForm2(form2Res.data?.form2 ?? null);
          setForm3(form3Res.data?.form3 ?? null);
        }
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
     <Navbar
  activeSection={section}
  toggleSidebar={toggleSidebar}
  isSidebarOpen={isSidebarOpen}
/>

      <div className="flex flex-1 overflow-hidden">
        {/* SideMenu responsive */}
        <SideMenu
  activeMenu={section}
  setSection={setSection}
  toggleSidebar={toggleSidebar}
  isSidebarOpen={isSidebarOpen}
/>

        <main className="flex-1 overflow-y-auto px-2 sm:px-6 py-6">
          {loading ? (
            <div className="text-center py-20 text-slate-500">Loading...</div>
          ) : error ? (
            <div className="text-center py-20 text-red-500">{error}</div>
          ) : section === "dashboard" ? (
            <>
              <StudentPipeline
                project={ideaProject || assignedProject}
                checklist={checklist}
                form1={form1}
                form2={form2}
                form3={form3}
              />

              <DashboardCards
                assignProject={assignedProject}
                ideaProject={ideaProject}
                onChecklistOpen={(projectId) => setChecklistOpenId(projectId)}
                onSelectMentorClick={() => setSection("projectIdea")}
              />

              {/* Checklist Modal */}
              {checklistOpenId && (
                <StudentChecklist
                  isOpen={true}
                  onClose={() => setChecklistOpenId(null)}
                  projectId={checklistOpenId}
                />
              )}
            </>
          ) : section === "projectIdea" ? (
            ideaProject ? (
              <ProjectDetails
                project={ideaProject}
                onClose={() => setSection("dashboard")}
              />
            ) : (
              <ProjectIdeaForm />
            )
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
            <div className="text-center py-20 text-slate-500">Invalid section</div>
          )}
        </main>
      </div>
    </div>
  );
};

export default StudentDashboard;