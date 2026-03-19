import React, { useState, useEffect } from "react";
import SideMenu from "../../components/SideMenu";
import Documentation from "./Documentation";
import BankProject from "./BankProject";
import MentorMessage from "./MentorMessage";
import Form3Mentor from "./Form3Mentor";
import IdeaProject from "./IdeaProject";
import Navbar from "../../components/Navbar";
import {
  getMyApprovedProjects,
  getProjectDocuments,
} from "../../services/mentorService";
import Form1Mentor from "./Form1Mentor";
import Form2Mentor from "./Form2Mentor";
import { motion, AnimatePresence } from "framer-motion";

const MentorDashboard = () => {
  const [section, setSection] = useState("dashboard");
  const [ideaProjects, setIdeaProjects] = useState([]);
  const [bankProjects, setBankProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  const [expandedId, setExpandedId] = useState(null);
  const [documents, setDocuments] = useState([]);
  const [docLoading, setDocLoading] = useState(false);

  const [activeForm, setActiveForm] = useState(null);
  const [selectedProjectId, setSelectedProjectId] = useState(null);

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const toggleSidebar = (val) =>
    setSidebarOpen(val !== undefined ? val : !sidebarOpen);

  // =============================
  // Load Projects
  // =============================
  useEffect(() => {
    let isMounted = true;
  
    const fetchProjects = async (silent = false) => {
      try {
        const res = await getMyApprovedProjects();
  
        if (!isMounted) return;
  
        // ✅ update only if data changed (prevents flicker)
        setIdeaProjects((prev) => {
          const newData = res?.ideaProjects || [];
          return JSON.stringify(prev) !== JSON.stringify(newData)
            ? newData
            : prev;
        });
  
        setBankProjects((prev) => {
          const newData = res?.approvedProjects || [];
          return JSON.stringify(prev) !== JSON.stringify(newData)
            ? newData
            : prev;
        });
      } catch (error) {
        console.error("Failed to load mentor projects", error);
      } finally {
        if (!silent) setLoading(false);
      }
    };
  
    // 🔹 Initial load (normal)
    fetchProjects();
  
    // 🔹 Live refresh every 5 sec (silent → no blinking)
    const interval = setInterval(() => {
      fetchProjects(true);
    }, 5000);
  
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  // =============================
  // Load Documents
  // =============================
  const handleViewDocuments = async (projectId) => {
    setExpandedId(projectId);
    setDocuments([]);
    setDocLoading(true);
    setActiveForm(null);

    try {
      const res = await getProjectDocuments(projectId);
      if (res?.success) setDocuments(res.data || []);
    } catch (err) {
      console.error("Error loading documents", err);
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


  const handleSingleDownload = (url, fileName) => {
    const backendURL = import.meta.env.VITE_API_URL.split('/api')[0];
    const fullURL = `${backendURL}${url}`;
    window.open(fullURL, '_blank');
  };
  // =============================
  // Render Section
  // =============================
  const renderSection = () => {
    switch (section) {
      case "dashboard":
        return (
          <div className="space-y-6 relative">
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800">
              Mentor Dashboard
            </h1>

            {loading && (
              <p className="text-center text-gray-500">
                Loading projects...
              </p>
            )}

            {/* Responsive Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 sm:gap-6">
              {[...ideaProjects, ...bankProjects].map((p) => {
                const isOpen = expandedId === p._id;
                const title = p.title || p.projectId?.title;
                const description =
                  p.description || p.projectId?.description;
                const isBankProject = !!p.projectId;

                const teamLeadName =
                  p.teamLead?.id?.name ||
                  p.teamLead?.name ||
                  p.teamMembers?.[0]?.name ||
                  "Not Assigned";

                const teamLeadEmail =
                  p.teamLead?.id?.email ||
                  p.teamLead?.email ||
                  p.teamMembers?.[0]?.email ||
                  "-";

                return (
                  <motion.div
                    key={p._id}
                    layout
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="relative bg-white rounded-2xl shadow-md border overflow-hidden flex flex-col min-h-[420px] sm:min-h-[450px] lg:min-h-[480px]"
                  >
                    <div className="p-5 flex flex-col h-full">
                      <div className="flex-1 overflow-y-auto pr-2">
                        {/* Header */}
                        <div className="flex justify-between items-start mb-3 gap-2">
                          <h2 className="text-base sm:text-lg font-bold text-gray-800 line-clamp-2">
                            {title}
                          </h2>

                          <span
                            className={`text-xs px-2 py-1 rounded-full font-bold whitespace-nowrap ${
                              isBankProject
                                ? "bg-green-100 text-green-700"
                                : "bg-purple-100 text-purple-700"
                            }`}
                          >
                            {isBankProject ? "Bank" : "Idea"}
                          </span>
                        </div>

                        {/* Description */}
                        <p className="text-sm text-gray-500 mb-4 line-clamp-3">
                          {description || "No description provided"}
                        </p>

                        {/* Details */}
                        <div className="grid grid-cols-2 gap-4 text-sm border-t pt-4 mb-4">
                          <div>
                            <p className="text-xs text-gray-400 font-bold uppercase">
                              Branch
                            </p>
                            <p className="font-semibold">
                              {p.branch || "N/A"}
                            </p>
                          </div>

                          <div>
                            <p className="text-xs text-gray-400 font-bold uppercase">
                              Section
                            </p>
                            <p className="font-semibold">
                              {p.section || "N/A"}
                            </p>
                          </div>

                          <div>
                            <p className="text-xs text-gray-400 font-bold uppercase">
                              Group
                            </p>
                            <p className="font-semibold">
                              {p.group || "N/A"}
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

                        {/* Team Lead */}
                        <div className="bg-blue-50 p-3 rounded-lg mb-4">
                          <p className="text-xs font-bold text-blue-700 mb-1">
                            Team Lead
                          </p>
                          <p className="text-sm font-semibold">
                            {teamLeadName}
                          </p>
                          <p className="text-xs text-gray-600">
                            {teamLeadEmail}
                          </p>
                        </div>

                        {/* Team Members */}
                        <div className="mb-4">
                          <p className="text-xs font-bold text-gray-500 uppercase mb-2">
                            Team Members ({p.teamMembers?.length || 0})
                          </p>

                          <div className="space-y-2 max-h-28 sm:max-h-32 overflow-y-auto pr-1">
                            {p.teamMembers?.map((m) => (
                              <div
                                key={m._id || m.id}
                                className="flex justify-between bg-gray-50 px-3 py-2 rounded text-sm"
                              >
                                <span className="font-semibold truncate">
                                  {m.name || m.id?.name}
                                </span>
                                <span className="text-gray-500 text-xs truncate">
                                  {m.email || m.id?.email || "-"}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Buttons */}
                      <div className="grid grid-cols-3 gap-2 mt-4">
                        <button
                          onClick={() => handleOpenForm("form1", p._id)}
                          className="bg-blue-600 text-white py-2 rounded-lg text-xs font-bold hover:bg-blue-700 transition"
                        >
                          Form 1
                        </button>

                        <button
                          onClick={() => handleOpenForm("form2", p._id)}
                          className="bg-purple-600 text-white py-2 rounded-lg text-xs font-bold hover:bg-purple-700 transition"
                        >
                          Form 2
                        </button>

                        <button
                          onClick={() => handleOpenForm("form3", p._id)}
                          className="bg-green-600 text-white py-2 rounded-lg text-xs font-bold hover:bg-green-700 transition"
                        >
                          Form 3
                        </button>

                        <button
                          onClick={() => handleViewDocuments(p._id)}
                          className="col-span-3 mt-2 w-full bg-slate-900 text-white py-2 rounded-xl text-sm font-bold hover:bg-slate-800 transition"
                        >
                          View Documents
                        </button>
                      </div>
                      
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* Right Panel */}
            <AnimatePresence>
              {(activeForm || (expandedId && documents.length > 0)) && (
                <motion.div
                  className="fixed top-[4.5rem] bottom-0 sm:bottom-5 z-50 overflow-y-auto bg-white shadow-2xl rounded-none sm:rounded-l-3xl border border-gray-200 w-full sm:w-[90%] md:w-[650px] lg:w-[700px] xl:w-[750px] right-0 sm:right-5"
                  initial={{ x: "100%", opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: "100%", opacity: 0 }}
                  transition={{ duration: 0.4 }}
                >
                  {/* Header */}
                  <div className="flex justify-between items-center p-4 sm:p-5 border-b sticky top-0 bg-white z-20">
                    <h2 className="text-lg sm:text-xl font-bold text-gray-800">
                      {activeForm
                        ? activeForm === "form1"
                          ? "Form 1"
                          : activeForm === "form2"
                          ? "Form 2"
                          : "Form 3"
                        : "Documents"}
                    </h2>

                    <button
                      onClick={handleClosePanel}
                      className="text-xl text-gray-400 hover:text-red-500"
                    >
                      ✕
                    </button>
                  </div>

                  {/* Content */}
                  <div className="p-4 sm:p-6 space-y-5">
                    {activeForm === "form1" && (
                      <Form1Mentor projectId={selectedProjectId} />
                    )}
                    {activeForm === "form2" && (
                      <Form2Mentor projectId={selectedProjectId} />
                    )}
                    {activeForm === "form3" && (
                      <Form3Mentor projectId={selectedProjectId} />
                    )}

                    {!activeForm && documents.length > 0 && (
                      <div className="space-y-4">
                        {documents.map((doc) => (
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

                                <button
                                  onClick={() =>
                                    handleSingleDownload(u.fileUrl, u.fileName)
                                  }
                                  className="text-green-600 text-sm font-semibold hover:underline"
                                >
                                  View
                                </button>
                              </div>
                            ))}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );

      case "mentorIdeaProjects":
        return <IdeaProject />;
      case "mentorBankProjects":
        return <BankProject />;
      case "documents":
        return <Documentation />;
      case "messages":
        return <MentorMessage />;
      case "form3Mentor":
        return <Form3Mentor />;
      default:
        return <p>Invalid section</p>;
    }
  };

  return (
    <div className="flex flex-col h-screen w-full bg-gray-100">
      <Navbar
        activeSection={section}
        toggleSidebar={toggleSidebar}
        isSidebarOpen={sidebarOpen}
      />

      <div className="flex flex-1 overflow-hidden">
        <SideMenu
          activeMenu={section}
          setSection={setSection}
          isSidebarOpen={sidebarOpen}
          toggleSidebar={toggleSidebar}
        />

        <main className="flex-1 overflow-y-auto p-4 sm:p-6 min-w-0">
          {renderSection()}
        </main>
      </div>
    </div>
  );
};

export default MentorDashboard;