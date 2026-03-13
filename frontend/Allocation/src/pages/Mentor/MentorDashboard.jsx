// MentorDashboard.jsx
import React, { useState, useEffect } from "react";
import SideMenu from "../../components/SideMenu";
import Documentation from "./Documentation";
import BankProject from "./BankProject";
import MentorMessage from "./MentorMessage";
import IdeaProject from "./IdeaProject";
import ProjectCard from "./ProjectCard";
import Navbar from "../../components/Navbar";

import Form1Mentor from "./Form1Mentor";
import Form2Mentor from "./Form2Mentor";
import Form3Mentor from "./Form3Mentor";

import { getMentorApprovedProjects } from "../../services/mentorService";
import { motion, AnimatePresence } from "framer-motion";

const MentorDashboard = () => {
  const [section, setSection] = useState("dashboard");
  const [ideaProjects, setIdeaProjects] = useState([]);
  const [bankProjects, setBankProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  // ==========================
  // Right Panel
  // ==========================
  const [activeForm, setActiveForm] = useState(null); // "form1" | "form2" | "form3"
  const [selectedProjectId, setSelectedProjectId] = useState(null);

  // ==========================
  // Load Mentor Projects
  // ==========================
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await getMentorApprovedProjects();
        setIdeaProjects(res?.ideaProjects || []);
        setBankProjects(res?.approvedProjects || []);
      } catch (err) {
        console.error("Failed to load mentor projects", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  // ==========================
  // Close right panel on section change
  // ==========================
  useEffect(() => {
    if (activeForm) {
      setActiveForm(null);
      setSelectedProjectId(null);
    }
  }, [section]);

  // ==========================
  // Open any form panel
  // ==========================
  const openFormPanel = (formType, projectId) => {
    setActiveForm(formType);
    setSelectedProjectId(projectId);
  };

  const closeFormPanel = () => {
    setActiveForm(null);
    setSelectedProjectId(null);
  };

  // ==========================
  // Render Dashboard Sections
  // ==========================
  const renderSection = () => {
    switch (section) {
      case "dashboard":
        return (
          <div className="space-y-8">
            <h1 className="text-3xl font-bold text-gray-800">
              Mentor Dashboard
            </h1>

            {/* SUMMARY */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white p-5 rounded-2xl shadow">
                <p className="text-sm text-gray-500">Approved Idea Projects</p>
                <p className="text-3xl font-bold">{ideaProjects.length}</p>
              </div>
              <div className="bg-white p-5 rounded-2xl shadow">
                <p className="text-sm text-gray-500">Approved Bank Projects</p>
                <p className="text-3xl font-bold">{bankProjects.length}</p>
              </div>
            </div>

            {loading && (
              <p className="text-center text-gray-500">Loading projects...</p>
            )}

            {/* PROJECT CARDS */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...ideaProjects, ...bankProjects].map((p) => (
                <ProjectCard
                  key={p._id}
                  project={p}
                  openForm1={(id) => openFormPanel("form1", id)}
                  openForm2={(id) => openFormPanel("form2", id)}
                  openForm3={(id) => openFormPanel("form3", id)}
                />
              ))}
            </div>
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
      default:
        return <p>Invalid section</p>;
    }
  };

  // ==========================
  // Determine panel width based on form type
  // ==========================
  const getPanelWidth = () => {
    switch (activeForm) {
      case "form1":
        return 600;
      case "form2":
        return 550;
      case "form3":
        return 650;
      default:
        return 600;
    }
  };

  return (
    <div className="flex flex-col h-screen w-full bg-gray-100">
      <Navbar activeSection={section} />
      <div className="flex flex-1 overflow-hidden">
        <SideMenu activeMenu={section} setSection={setSection} />

        <main className="flex-1 overflow-y-auto p-6 relative">
          {renderSection()}

          {/* ==========================
              Right Panel for Forms
          ========================== */}
          <AnimatePresence>
            {activeForm && selectedProjectId && (
              <motion.div
                className="fixed top-[4.5rem] bottom-5 right-5 z-50 flex overflow-y-auto"
                initial={{ x: "100%", opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: "100%", opacity: 0 }}
                transition={{ type: "tween", duration: 0.5, ease: "easeInOut" }}
                style={{ width: getPanelWidth(), maxWidth: "100%" }}
              >
                <div className="flex-1 bg-white shadow-2xl rounded-l-3xl overflow-y-auto">
                  <div className="flex justify-between items-center p-5 border-b sticky top-0 bg-white z-20 rounded-l-3xl">
                    <h2 className="text-2xl font-bold text-gray-800">
                      {activeForm === "form1"
                        ? "Form 1 Details"
                        : activeForm === "form2"
                          ? "Form 2 Details"
                          : "Form 3 Details"}
                    </h2>
                    <button
                      onClick={closeFormPanel}
                      className="text-2xl text-gray-400 hover:text-red-500 font-bold"
                    >
                      ✕
                    </button>
                  </div>

                  <div className="p-6">
                    {activeForm === "form1" && (
                      <Form1Mentor projectId={selectedProjectId} />
                    )}
                    {activeForm === "form2" && (
                      <Form2Mentor projectId={selectedProjectId} />
                    )}
                    {activeForm === "form3" && (
                      <Form3Mentor projectId={selectedProjectId} />
                    )}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
};

export default MentorDashboard;

// import React, { useState, useEffect } from "react";
// import SideMenu from "../../components/SideMenu";
// import Documentation from "./Documentation";
// import BankProject from "./BankProject";
// import MentorMessage from "./MentorMessage";
// import Form3Mentor from "./Form3Mentor";
// import IdeaProject from "./IdeaProject";
// import Navbar from "../../components/Navbar";
// import {
//   getMentorApprovedProjects,
//   getProjectDocuments,
// } from "../../services/mentorService";
// import Form1Mentor from "./Form1Mentor";
// import Form2Mentor from "./Form2Mentor";
// import { motion, AnimatePresence } from "framer-motion";

// const MentorDashboard = () => {
//   const [section, setSection] = useState("dashboard");
//   const [ideaProjects, setIdeaProjects] = useState([]);
//   const [bankProjects, setBankProjects] = useState([]);
//   const [loading, setLoading] = useState(true);

//   const [expandedId, setExpandedId] = useState(null);
//   const [documents, setDocuments] = useState([]);
//   const [docLoading, setDocLoading] = useState(false);

//   const [activeForm, setActiveForm] = useState(null);
//   const [selectedProjectId, setSelectedProjectId] = useState(null);

//   // =============================
//   // Load mentor projects
//   // =============================
//   useEffect(() => {
//     const fetchProjects = async () => {
//       try {
//         const res = await getMentorApprovedProjects();
//         setIdeaProjects(res?.ideaProjects || []);
//         setBankProjects(res?.approvedProjects || []);
//       } catch (error) {
//         console.error("Failed to load mentor projects", error);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchProjects();
//   }, []);

//   // =============================
//   // Load documents
//   // =============================
//   const handleViewDocuments = async (projectId) => {
//     setExpandedId(projectId);
//     setDocuments([]);
//     setDocLoading(true);
//     setActiveForm(null); // Ensure forms are closed when viewing docs

//     try {
//       const res = await getProjectDocuments(projectId);
//       if (res?.success) setDocuments(res.data || []);
//     } catch (err) {
//       console.error("Error loading documents", err);
//     } finally {
//       setDocLoading(false);
//     }
//   };

//   const handleOpenForm = (formType, projectId) => {
//     setActiveForm(formType);
//     setSelectedProjectId(projectId);
//     setExpandedId(projectId);
//     setDocuments([]); // Clear documents
//   };

//   const handleClosePanel = () => {
//     setActiveForm(null);
//     setExpandedId(null);
//     setSelectedProjectId(null);
//     setDocuments([]);
//   };

//   // =============================
//   // Dashboard UI
//   // =============================
//   const renderSection = () => {
//     switch (section) {
//       case "dashboard":
//         return (
//           <div className="space-y-8 relative">
//             <h1 className="text-3xl font-bold text-gray-800">
//               Mentor Dashboard
//             </h1>

//             {/* LOADING */}
//             {loading && (
//               <p className="text-center text-gray-500">Loading projects...</p>
//             )}

//             {/* PROJECT CARDS */}
//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//               {[...ideaProjects, ...bankProjects].map((p) => {
//                 const isOpen = expandedId === p._id;
//                 const title = p.title || p.projectId?.title;
//                 const description = p.description || p.projectId?.description;
//                 const isBankProject = !!p.projectId;
//                 const teamLeadName = p.teamLead?.id?.name || "Not Assigned";
//                 const teamLeadEmail = p.teamLead?.id?.email || "-";

//                 return (
//                   <div
//                     key={p._id}
//                     className={`relative bg-white rounded-2xl shadow-md border overflow-hidden transition-all ${
//                       isOpen ? "opacity-70 scale-95" : "opacity-100 scale-100"
//                     }`}
//                   >
//                     <div className="p-6">
//                       {/* HEADER */}
//                       <div className="flex justify-between items-start mb-3">
//                         <h2 className="text-xl font-bold text-gray-800">
//                           {title}
//                         </h2>
//                         <span
//                           className={`text-xs px-3 py-1 rounded-full font-bold ${
//                             isBankProject
//                               ? "bg-green-100 text-green-700"
//                               : "bg-purple-100 text-purple-700"
//                           }`}
//                         >
//                           {isBankProject ? "Bank Project" : "Idea Project"}
//                         </span>
//                       </div>

//                       {/* DESCRIPTION */}
//                       <p className="text-sm text-gray-500 mb-4">
//                         {description || "No description provided"}
//                       </p>

//                       {/* PROJECT DETAILS */}
//                       <div className="grid grid-cols-2 gap-4 text-sm border-t pt-4 mb-4">
//                         <div>
//                           <p className="text-xs text-gray-400 font-bold uppercase">
//                             Branch
//                           </p>
//                           <p className="font-semibold">{p.branch || "N/A"}</p>
//                         </div>
//                         <div>
//                           <p className="text-xs text-gray-400 font-bold uppercase">
//                             Section
//                           </p>
//                           <p className="font-semibold">{p.section || "N/A"}</p>
//                         </div>
//                         <div>
//                           <p className="text-xs text-gray-400 font-bold uppercase">
//                             Group
//                           </p>
//                           <p className="font-semibold">{p.group || "N/A"}</p>
//                         </div>
//                         <div>
//                           <p className="text-xs text-gray-400 font-bold uppercase">
//                             Academic Year
//                           </p>
//                           <p className="font-semibold">
//                             {p.academicYear || "N/A"}
//                           </p>
//                         </div>
//                       </div>

//                       {/* TEAM LEAD */}
//                       <div className="bg-blue-50 p-3 rounded-lg mb-4">
//                         <p className="text-xs font-bold text-blue-700 mb-1">
//                           Team Lead
//                         </p>
//                         <p className="text-sm font-semibold">{teamLeadName}</p>
//                         <p className="text-xs text-gray-600">{teamLeadEmail}</p>
//                       </div>

//                       {/* TEAM MEMBERS */}
//                       <div className="mb-4">
//                         <p className="text-xs font-bold text-gray-500 uppercase mb-2">
//                           Team Members ({p.teamMembers?.length || 0})
//                         </p>
//                         <div className="space-y-2 max-h-32 overflow-y-auto">
//                           {p.teamMembers?.map((m) => (
//                             <div
//                               key={m._id}
//                               className="flex justify-between bg-gray-50 px-3 py-2 rounded text-sm"
//                             >
//                               <span className="font-semibold">{m.name}</span>
//                               <span className="text-gray-500 text-xs">
//                                 {m.email}
//                               </span>
//                             </div>
//                           ))}
//                         </div>
//                       </div>

//                       {/* BUTTONS */}
//                       <div className="grid grid-cols-3 gap-2 mt-3">
//                         <button
//                           onClick={() => handleOpenForm("form1", p._id)}
//                           className="bg-blue-600 text-white py-2 rounded-lg text-xs font-bold hover:bg-blue-700"
//                         >
//                           Form 1
//                         </button>
//                         <button
//                           onClick={() => handleOpenForm("form2", p._id)}
//                           className="bg-purple-600 text-white py-2 rounded-lg text-xs font-bold hover:bg-purple-700"
//                         >
//                           Form 2
//                         </button>
//                         <button
//                           onClick={() => handleOpenForm("form3", p._id)}
//                           className="bg-green-600 text-white py-2 rounded-lg text-xs font-bold hover:bg-green-700"
//                         >
//                           Form 3
//                         </button>
//                         <button
//                           onClick={() => handleViewDocuments(p._id)}
//                           className="col-span-3 mt-2 w-full bg-slate-900 text-white py-2 rounded-xl text-sm font-bold hover:bg-slate-800"
//                         >
//                           View Documents
//                         </button>
//                       </div>
//                     </div>
//                   </div>
//                 );
//               })}
//             </div>

//             {/* =========================
//                 Animated Right-side Panel
//             ========================= */}
//             <AnimatePresence>
//               {(activeForm || (expandedId && documents.length > 0)) && (
//                 <motion.div
//                   className="fixed top-[4.5rem] bottom-5 z-50 overflow-y-auto bg-white shadow-2xl rounded-l-3xl border border-gray-200"
//                   style={{
//                     width:
//                       activeForm === "form1"
//                         ? "650px"
//                         : activeForm === "form2"
//                           ? "550px"
//                           : activeForm === "form3"
//                             ? "750px"
//                             : "600px", // documents default
//                     right: "20px", // space from right
//                   }}
//                   initial={{ x: "100%", opacity: 0 }}
//                   animate={{ x: 0, opacity: 1 }}
//                   exit={{ x: "100%", opacity: 0 }}
//                   transition={{
//                     type: "tween",
//                     duration: 0.5,
//                     ease: "easeInOut",
//                   }}
//                 >
//                   {/* HEADER */}
//                   <div className="flex justify-between items-center p-5 border-b border-gray-200 sticky top-0 bg-white z-20 rounded-l-3xl shadow-sm">
//                     <h2 className="text-2xl font-bold text-gray-800">
//                       {activeForm
//                         ? activeForm === "form1"
//                           ? "Form 1 Details"
//                           : activeForm === "form2"
//                             ? "Form 2 Details"
//                             : "Form 3 Details"
//                         : "Project Documents"}
//                     </h2>
//                     <button
//                       onClick={handleClosePanel}
//                       className="text-2xl text-gray-400 hover:text-red-500 font-bold transition-colors duration-300"
//                     >
//                       ✕
//                     </button>
//                   </div>

//                   {/* CONTENT */}
//                   <div className="p-6 space-y-6">
//                     {activeForm === "form1" && (
//                       <Form1Mentor projectId={selectedProjectId} />
//                     )}
//                     {activeForm === "form2" && selectedProjectId && (
//                       <Form2Mentor projectId={selectedProjectId} />
//                     )}
//                     {activeForm === "form3" && selectedProjectId && (
//                       <Form3Mentor projectId={selectedProjectId} />
//                     )}

//                     {!activeForm && documents.length > 0 && (
//                       <div className="space-y-4">
//                         {documents.map((doc) => (
//                           <div
//                             key={doc.checklistId}
//                             className="bg-gray-50 p-4 rounded-xl shadow-inner hover:shadow-md transition-shadow duration-300"
//                           >
//                             <p className="text-sm font-semibold text-blue-700 mb-2">
//                               {doc.title}
//                             </p>
//                             {doc.uploads.map((u) => (
//                               <div
//                                 key={u.uploadId}
//                                 className="flex justify-between items-center bg-white p-3 rounded-lg mb-2 border border-gray-200 hover:bg-gray-50 transition-colors duration-200"
//                               >
//                                 <span className="text-sm font-medium truncate w-40">
//                                   {u.fileName}
//                                 </span>
//                                 <a
//                                   href={u.fileUrl}
//                                   target="_blank"
//                                   rel="noreferrer"
//                                   className="text-blue-600 text-sm font-semibold hover:underline"
//                                 >
//                                   View
//                                 </a>
//                               </div>
//                             ))}
//                           </div>
//                         ))}
//                       </div>
//                     )}
//                   </div>
//                 </motion.div>
//               )}
//             </AnimatePresence>
//           </div>
//         );

//       case "mentorIdeaProjects":
//         return <IdeaProject />;
//       case "mentorBankProjects":
//         return <BankProject />;
//       case "documents":
//         return <Documentation />;
//       case "messages":
//         return <MentorMessage />;
//       case "form3Mentor":
//         return <Form3Mentor />;
//       default:
//         return <p>Invalid section</p>;
//     }
//   };

//   return (
//     <div className="flex flex-col h-screen w-full bg-gray-100">
//       {/* NAVBAR */}
//       <Navbar activeSection={section} />

//       {/* SIDEMENU + CONTENT */}
//       <div className="flex flex-1 overflow-hidden">
//         <SideMenu activeMenu={section} setSection={setSection} />
//         <main className="flex-1 overflow-y-auto p-6">{renderSection()}</main>
//       </div>
//     </div>
//   );
// };

// export default MentorDashboard;
