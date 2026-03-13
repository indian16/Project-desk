// ProjectCard.jsx
import React, { useState } from "react";
import { getProjectDocuments } from "../../services/mentorService";

const ProjectCard = ({ project, openForm1, openForm2, openForm3 }) => {
  const [expanded, setExpanded] = useState(false);
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(false);

  const title = project.title || project.projectId?.title;
  const description = project.description || project.projectId?.description;

  const isBankProject = !!project.projectId;
  const teamLeadName = project.teamLead?.id?.name || "Not Assigned";
  const teamLeadEmail = project.teamLead?.id?.email || "-";

  // ==========================
  // LOAD DOCUMENTS
  // ==========================
  const handleViewDocuments = async () => {
    setExpanded(true);
    setDocuments([]);
    setLoading(true);

    try {
      const res = await getProjectDocuments(project._id);
      if (res?.success) setDocuments(res.data || []);
    } catch (err) {
      console.error("Error loading documents", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative bg-white rounded-2xl shadow-md border overflow-hidden h-full">
      {/* MAIN CARD */}
      <div
        className={`p-6 transition-all duration-500 ${
          expanded ? "blur-md opacity-20 scale-95" : ""
        }`}
      >
        {/* HEADER */}
        <div className="flex justify-between items-start mb-3">
          <h2 className="text-lg md:text-xl font-bold text-gray-800">{title}</h2>
          <span
            className={`text-xs px-3 py-1 rounded-full font-bold ${
              isBankProject
                ? "bg-green-100 text-green-700"
                : "bg-purple-100 text-purple-700"
            }`}
          >
            {isBankProject ? "Bank Project" : "Idea Project"}
          </span>
        </div>

        {/* DESCRIPTION */}
        <p className="text-sm text-gray-500 mb-4">
          {description || "No description provided"}
        </p>

        {/* DETAILS */}
        <div className="grid grid-cols-2 gap-4 text-sm border-t pt-4 mb-4">
          <div>
            <p className="text-xs text-gray-400 font-bold uppercase">Branch</p>
            <p className="font-semibold">{project.branch || "N/A"}</p>
          </div>

          <div>
            <p className="text-xs text-gray-400 font-bold uppercase">Section</p>
            <p className="font-semibold">{project.section || "N/A"}</p>
          </div>

          <div>
            <p className="text-xs text-gray-400 font-bold uppercase">Group</p>
            <p className="font-semibold">{project.group || "N/A"}</p>
          </div>

          <div>
            <p className="text-xs text-gray-400 font-bold uppercase">Academic Year</p>
            <p className="font-semibold">{project.academicYear || "N/A"}</p>
          </div>
        </div>

        {/* TEAM LEAD */}
        <div className="bg-blue-50 p-3 rounded-lg mb-4">
          <p className="text-xs font-bold text-blue-700 mb-1">Team Lead</p>
          <p className="text-sm font-semibold">{teamLeadName}</p>
          <p className="text-xs text-gray-600">{teamLeadEmail}</p>
        </div>

        {/* TEAM MEMBERS */}
        <div className="mb-4">
          <p className="text-xs font-bold text-gray-500 uppercase mb-2">
            Team Members ({project.teamMembers?.length || 0})
          </p>
          <div className="space-y-2 max-h-32 overflow-y-auto">
            {project.teamMembers?.map((m) => (
              <div
                key={m._id}
                className="flex justify-between bg-gray-50 px-3 py-2 rounded text-sm"
              >
                <span className="font-semibold">{m.name}</span>
                <span className="text-gray-500 text-xs">{m.email}</span>
              </div>
            ))}
          </div>
        </div>

        {/* BUTTONS */}
        <button
          onClick={handleViewDocuments}
          className="mt-3 w-full bg-slate-900 text-white py-3 rounded-xl text-sm font-bold hover:bg-slate-800"
        >
          📄 View Documents
        </button>

        <button
          onClick={() => openForm1(project._id)}
          className="mt-3 w-full bg-yellow-600 text-white py-3 rounded-xl text-sm font-bold hover:bg-yellow-700"
        >
          📋 View Form 1
        </button>

        <button
          onClick={() => openForm2(project._id)}
          className="mt-3 w-full bg-purple-600 text-white py-3 rounded-xl text-sm font-bold hover:bg-purple-700"
        >
          📊 View Form 2
        </button>

        <button
          onClick={() => openForm3(project._id)}
          className="mt-3 w-full bg-blue-600 text-white py-3 rounded-xl text-sm font-bold hover:bg-blue-700"
        >
          📊 View Form 3
        </button>
      </div>

      {/* DOCUMENTS OVERLAY */}
      {expanded && (
        <div className="absolute inset-0 bg-white z-10 p-6 overflow-y-auto transition-all duration-500 translate-y-0">
          <div className="flex justify-between items-center border-b pb-2 mb-4">
            <h3 className="font-bold text-lg">Project Documents</h3>
            <button
              onClick={() => {
                setExpanded(false);
                setDocuments([]);
              }}
              className="text-xl text-gray-400 hover:text-red-500"
            >
              ✕
            </button>
          </div>

          {loading ? (
            <p className="text-center text-gray-400">Loading documents...</p>
          ) : documents.length === 0 ? (
            <p className="text-center text-gray-500">No documents uploaded</p>
          ) : (
            documents.map((c) => (
              <div key={c.checklistId} className="mb-4">
                <p className="text-xs font-bold text-blue-600 mb-2">{c.title}</p>
                {c.uploads.map((u) => (
                  <div
                    key={u.uploadId}
                    className="flex justify-between bg-gray-50 p-3 rounded mb-2"
                  >
                    <span className="text-xs truncate w-40">{u.fileName}</span>
                    <a
                      href={u.fileUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-blue-600 text-xs font-bold"
                    >
                      View
                    </a>
                  </div>
                ))}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default ProjectCard;