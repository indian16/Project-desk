import React, { useEffect, useState } from "react";
import {
  getAllCombinedProjects,
  getProjectDocuments,
} from "../../services/headService";

import Form1Head from "./Form1Head";
import Form2Head from "./Form2Head";
import Form3Head from "./Form3Head";

import { motion, AnimatePresence } from "framer-motion";

const statusColors = {
  pending: "bg-yellow-100 text-yellow-800",
  approve: "bg-green-100 text-green-800",
  rejected: "bg-red-100 text-red-800",
  interview_scheduled: "bg-blue-100 text-blue-800",
  interview_passed: "bg-green-200 text-green-900",
  interview_failed: "bg-red-200 text-red-900",
  approved_by_mentor: "bg-green-200 text-green-900",
  rejected_by_mentor: "bg-red-200 text-red-900",
};

const cardVariants = {
  hidden: { opacity: 0, y: 25 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.45,
      ease: "easeOut",
    },
  },
};

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.05,
    },
  },
};

const ProjectsData = () => {
  const [allProjects, setAllProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  const [expandedId, setExpandedId] = useState(null);
  const [documents, setDocuments] = useState([]);
  const [docLoading, setDocLoading] = useState(false);

  const [activeForm, setActiveForm] = useState(null);
  const [selectedProjectId, setSelectedProjectId] = useState(null);

  // ─── FILTER STATES ───
  const [filterType, setFilterType] = useState("all"); // all / idea / assigned
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await getAllCombinedProjects();
        if (res?.success) {
          setAllProjects(res.projects);
        }
      } catch (err) {
        console.error("Error fetching projects:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  const handleViewDocuments = async (project) => {
    const id = project.id || project._id;

    setExpandedId(id);
    setActiveForm(null);
    setDocuments([]);
    setDocLoading(true);

    try {
      const res = await getProjectDocuments(id);
      if (res.success) setDocuments(res.data);
    } catch (err) {
      console.error("Error loading documents:", err);
    } finally {
      setDocLoading(false);
    }
  };

  const handleOpenForm = (formType, projectId) => {
    setActiveForm(formType);
    setSelectedProjectId(projectId);
    setExpandedId(projectId);
    setDocuments([]);
  };

  const handleClosePanel = () => {
    setActiveForm(null);
    setExpandedId(null);
    setSelectedProjectId(null);
    setDocuments([]);
  };

  // ─── FILTERED PROJECTS ───
  const filteredProjects = allProjects.filter((p) => {
    // Filter by type
    if (filterType !== "all" && p.type !== filterType) return false;

    // Filter by project name (case-insensitive)
    if (
      searchQuery &&
      !p.title.toLowerCase().includes(searchQuery.toLowerCase())
    )
      return false;

    return true;
  });

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">
        Projects Dashboard
      </h1>

      {/* ─── FILTER CONTROLS ─── */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6 items-start sm:items-center">
        {/* Type Filter */}
        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          className="border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          <option value="all">All Projects</option>
          <option value="idea">Idea Projects</option>
          <option value="assigned">Assigned Projects</option>
        </select>

        {/* Search Filter */}
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search by project name..."
          className="border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 flex-1"
        />
      </div>

      <AnimatePresence mode="wait">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="bg-white rounded-2xl shadow-md border border-gray-100 p-6 h-[520px]"
              >
                <div className="animate-pulse space-y-4">
                  <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-200 rounded w-full"></div>
                  <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            layout
            className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6"
          >
            {filteredProjects.map((p) => {
              const projectId = p.id || p._id;

              return (
                <motion.div
                  key={projectId}
                  variants={cardVariants}
                  layout
                  className="bg-white rounded-2xl shadow-md border border-gray-100 p-4 sm:p-6 flex flex-col min-h-[420px] hover:shadow-xl transition-all duration-300"
                >
                  {/* HEADER */}
                  <div className="flex justify-between items-start mb-2">
                    <h2 className="text-xl font-bold text-gray-800">
                      {p.title}
                    </h2>

                    <span
                      className={`text-xs px-3 py-1 rounded-full font-bold ${
                        p.type === "idea"
                          ? "bg-purple-100 text-purple-700"
                          : "bg-green-100 text-green-700"
                      }`}
                    >
                      {p.type === "idea" ? "Idea Project" : "Assigned"}
                    </span>
                  </div>

                  <p className="text-gray-500 text-sm mb-4">{p.description}</p>

                  {/* CONTENT */}
                  <div className="flex-1 overflow-y-auto pr-2 scroll-smooth-card">
                    <div className="grid grid-cols-2 gap-4 text-sm border-t pt-4">
                      <div>
                        <p className="text-xs text-gray-400 font-bold uppercase">
                          Technology
                        </p>
                        <p className="font-semibold">{p.technology || "N/A"}</p>
                      </div>

                      <div>
                        <p className="text-xs text-gray-400 font-bold uppercase">
                          Status
                        </p>
                        <span
                          className={`text-xs px-2 py-1 rounded font-bold ${
                            statusColors[p.status] || "bg-gray-100"
                          }`}
                        >
                          {p.status}
                        </span>
                      </div>

                      <div>
                        <p className="text-xs text-gray-400 font-bold uppercase">
                          Team Lead
                        </p>
                        <p className="font-semibold">
                          {p.teamLead?.name || "N/A"}
                        </p>
                      </div>

                      <div>
                        <p className="text-xs text-gray-400 font-bold uppercase">
                          Academic Year
                        </p>
                        <p className="font-semibold">
                          {p.academicYear || "N/A"}
                        </p>
                      </div>
                    </div>

                    {p.teamMembers?.length > 0 && (
                      <div className="mt-4">
                        <p className="text-xs text-gray-400 font-bold uppercase mb-1">
                          Team Members
                        </p>
                        {p.teamMembers.map((m, i) => (
                          <p key={i} className="text-sm text-gray-700">
                            {m.name} — {m.email}
                          </p>
                        ))}
                      </div>
                    )}

                    <div className="mt-4">
                      <p className="text-xs text-gray-400 font-bold uppercase mb-1">
                        Selected Mentors
                      </p>
                      <p className="text-sm">
                        Mentor 1 : {p.mentors?.mentor1?.name || "N/A"}
                      </p>
                      <p className="text-sm">
                        Mentor 2 : {p.mentors?.mentor2?.name || "N/A"}
                      </p>
                      <p className="text-sm">
                        Mentor 3 : {p.mentors?.mentor3?.name || "N/A"}
                      </p>
                    </div>

                    <div className="mt-4">
                      <p className="text-xs text-green-600 font-bold uppercase mb-1">
                        {p.type === "idea"
                          ? "Confirmed Mentor"
                          : "Approved Mentor"}
                      </p>
                      <p className="text-sm font-semibold">
                        {p.type === "idea"
                          ? p.confirmedMentor?.name || "N/A"
                          : p.approvedMentor?.name || "N/A"}
                      </p>
                    </div>
                  </div>

                  {/* BUTTONS */}
                  <div className="mt-4 pt-4 border-t space-y-2">
                    {/* TOP 3 BUTTONS */}
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleOpenForm("form1", projectId)}
                        className="flex-1 bg-blue-600 text-white py-2 rounded-lg text-xs font-bold hover:bg-blue-700 hover:shadow-md active:scale-95 transition-all duration-200"
                      >
                        Form 1
                      </button>

                      <button
                        onClick={() => handleOpenForm("form2", projectId)}
                        className="flex-1 bg-purple-600 text-white py-2 rounded-lg text-xs font-bold hover:bg-purple-700 hover:shadow-md active:scale-95 transition-all duration-200"
                      >
                        Form 2
                      </button>

                      <button
                        onClick={() => handleOpenForm("form3", projectId)}
                        className="flex-1 bg-green-600 text-white py-2 rounded-lg text-xs font-bold hover:bg-green-700 hover:shadow-md active:scale-95 transition-all duration-200"
                      >
                        Form 3
                      </button>
                    </div>

                    {/* BOTTOM BUTTON */}
                    <button
                      onClick={() => handleViewDocuments(p)}
                      className="w-full bg-slate-900 text-white py-2 rounded-xl text-sm font-bold hover:bg-slate-800 hover:shadow-md active:scale-95 transition-all duration-200"
                    >
                      View Documents
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>

      {/* RIGHT PANEL */}
      <AnimatePresence>
        {(activeForm || expandedId) && (
          <motion.div
            className="fixed top-[4.5rem] bottom-3 right-0 sm:right-5 w-full sm:w-[90%] md:w-[700px] bg-white shadow-2xl sm:rounded-l-3xl border z-50 overflow-y-auto"
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{
              type: "tween",
              duration: 0.4,
              ease: "easeInOut",
            }}
          >
            <div className="flex justify-between items-center p-5 border-b">
              <h2 className="text-xl font-bold">
                {activeForm === "form1"
                  ? "Form 1 Details"
                  : activeForm === "form2"
                    ? "Form 2 Details"
                    : activeForm === "form3"
                      ? "Form 3 Evaluation"
                      : "Project Documents"}
              </h2>

              <button
                onClick={handleClosePanel}
                className="text-xl text-gray-400 hover:text-red-500"
              >
                ✕
              </button>
            </div>

            <div className="p-6 space-y-6">
              {activeForm === "form1" && (
                <Form1Head projectId={selectedProjectId} />
              )}
              {activeForm === "form2" && (
                <Form2Head projectId={selectedProjectId} />
              )}
              {activeForm === "form3" && (
                <Form3Head projectId={selectedProjectId} />
              )}

              {!activeForm && (
                <div className="space-y-4">
                  {docLoading ? (
                    <p>Loading documents...</p>
                  ) : (
                    documents.map((doc) => (
                      <div
                        key={doc.checklistId}
                        className="bg-gray-50 p-4 rounded-xl"
                      >
                        <p className="text-sm font-semibold text-blue-700 mb-2">
                          {doc.title}
                        </p>

                        {doc.uploads.map((u) => (
                          <div
                            key={u.uploadId}
                            className="flex justify-between items-center bg-white p-3 rounded-lg mb-2 border"
                          >
                            <span className="text-sm truncate w-40">
                              {u.fileName}
                            </span>

                            <a
                              href={u.fileUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="text-blue-600 text-sm font-semibold"
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
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ProjectsData;
