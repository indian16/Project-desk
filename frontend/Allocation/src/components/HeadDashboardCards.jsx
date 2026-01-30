// // src/components/HeadDashboardCards.jsx
// import React, { useState, useEffect } from "react";
// import axios from "axios";

// const HeadDashboardCards = ({
//   token,
//   pendingIdeas = [],
//   acceptedIdeas = [],
//   rejectedIdeas = [],
//   onApprove,
//   onReject,
// }) => {
//   const [activeTab, setActiveTab] = useState("pending");
//   const [expandedIdeaId, setExpandedIdeaId] = useState(null);
//   const [expandedProjectId, setExpandedProjectId] = useState(null);
//   const [projects, setProjects] = useState([]);

//   // --------------------------------------------
//   //  FETCH PROJECTS WITH CHECKLIST
//   // --------------------------------------------
//   const fetchProjects = async () => {
//     try {
//       const res = await axios.get(
//         "http://localhost:8000/api/head/projects-with-checklist",
//         {
//           headers: { Authorization: `Bearer ${token}` },
//         }
//       );
//       setProjects(res.data.projects || []);
//     } catch (err) {
//       console.error("Error fetching projects:", err);
//     }
//   };

//   useEffect(() => {
//     fetchProjects();
//   }, []);

//   const toggleProject = (projectId) => {
//     setExpandedProjectId(expandedProjectId === projectId ? null : projectId);
//   };

//   // --------------------------------------------
//   //  RENDER PENDING IDEA REVIEW
//   // --------------------------------------------
//   const renderPendingIdeas = () => (
//     <div>
//       {pendingIdeas.length === 0 ? (
//         <p>No pending ideas.</p>
//       ) : (
//         pendingIdeas.map((idea) => (
//           <div key={idea._id} className="border p-4 mb-4 rounded bg-white shadow">
//             <h3
//               className="font-bold cursor-pointer text-blue-600"
//               onClick={() =>
//                 setExpandedIdeaId(expandedIdeaId === idea._id ? null : idea._id)
//               }
//             >
//               {idea.title}
//             </h3>

//             {expandedIdeaId === idea._id && (
//               <div className="mt-2 text-sm text-gray-700">
//                 <p>{idea.description}</p>

//                 {idea.mentor && (
//                   <p>
//                     <strong>Mentor:</strong> {idea.mentor.name}
//                   </p>
//                 )}

//                 {idea.team?.length > 0 && (
//                   <p>
//                     <strong>Team:</strong>{" "}
//                     {idea.team.map((m) => m.name).join(", ")}
//                   </p>
//                 )}

//                 <div className="flex gap-2 mt-2">
//                   <button
//                     onClick={() => onApprove(idea._id)}
//                     className="bg-green-500 text-white px-3 py-1 rounded"
//                   >
//                     Approve
//                   </button>

//                   <button
//                     onClick={() => onReject(idea._id)}
//                     className="bg-red-500 text-white px-3 py-1 rounded"
//                   >
//                     Reject
//                   </button>
//                 </div>
//               </div>
//             )}
//           </div>
//         ))
//       )}
//     </div>
//   );

//   // --------------------------------------------
//   //  RENDER STATUS TAB (ACCEPTED + REJECTED)
//   // --------------------------------------------
//   const renderStatus = () => (
//     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//       {/* Accepted */}
//       <div className="p-4 bg-green-50 border rounded shadow">
//         <h3 className="font-bold mb-2 text-green-700">✅ Accepted Ideas</h3>
//         {acceptedIdeas.length === 0 ? (
//           <p>No accepted ideas.</p>
//         ) : (
//           acceptedIdeas.map((idea) => (
//             <div key={idea._id} className="mb-2 border-b pb-2">
//               <h4 className="font-semibold">{idea.title}</h4>
//               <p className="text-sm text-gray-600">{idea.description}</p>
//             </div>
//           ))
//         )}
//       </div>

//       {/* Rejected */}
//       <div className="p-4 bg-red-50 border rounded shadow">
//         <h3 className="font-bold mb-2 text-red-700">❌ Rejected Ideas</h3>
//         {rejectedIdeas.length === 0 ? (
//           <p>No rejected ideas.</p>
//         ) : (
//           rejectedIdeas.map((idea) => (
//             <div key={idea._id} className="mb-2 border-b pb-2">
//               <h4 className="font-semibold">{idea.title}</h4>
//               <p className="text-sm text-gray-600">{idea.description}</p>
//             </div>
//           ))
//         )}
//       </div>
//     </div>
//   );

//   // --------------------------------------------
//   //  RENDER PROJECTS WITH CHECKLIST
//   // --------------------------------------------
//   const renderProjects = () => (
//     <div className="space-y-4">
//       {projects.length === 0 ? (
//         <p>No projects found.</p>
//       ) : (
//         projects.map((project) => {
//           const totalChecklist = project.checklist?.length || 0;
//           const submittedCount = project.checklist?.reduce(
//             (acc, item) => acc + (item.studentUploads?.length || 0),
//             0
//           );

//           return (
//             <div key={project._id} className="border p-4 rounded bg-white shadow">
//               <div
//                 className="flex justify-between cursor-pointer"
//                 onClick={() => toggleProject(project._id)}
//               >
//                 <h3 className="font-bold text-lg">{project.title}</h3>
//                 <span className="text-sm text-gray-600">
//                   {submittedCount}/{totalChecklist} submitted
//                 </span>
//               </div>

//               {/* Expand project */}
//               {expandedProjectId === project._id && (
//                 <div className="mt-3 space-y-2">
//                   <p className="text-sm text-gray-700">{project.description}</p>

//                   {project.mentor && (
//                     <p className="text-sm">
//                       <strong>Mentor:</strong> {project.mentor.name}
//                     </p>
//                   )}

//                   {project.teamMembers?.length > 0 && (
//                     <p className="text-sm">
//                       <strong>Team:</strong>{" "}
//                       {project.teamMembers.map((m) => m.name).join(", ")}
//                     </p>
//                   )}

//                   {/* Checklist */}
//                   <div className="mt-3">
//                     <h4 className="font-semibold mb-1">Checklist:</h4>

//                     {project.checklist?.length === 0 ? (
//                       <p className="text-sm text-gray-500">No checklist items.</p>
//                     ) : (
//                       <ul className="space-y-1">
//                         {project.checklist.map((item) => (
//                           <li key={item._id} className="flex justify-between text-sm">
//                             <span>{item.title}</span>
//                             <span className="text-gray-600">
//                               {item.studentUploads?.length || 0} submitted
//                             </span>
//                           </li>
//                         ))}
//                       </ul>
//                     )}
//                   </div>
//                 </div>
//               )}
//             </div>
//           );
//         })
//       )}
//     </div>
//   );

//   // --------------------------------------------
//   //  MAIN RETURN WITH TABS
//   // --------------------------------------------
//   return (
//     <div>
//       {/* Tabs */}
//       <div className="flex gap-4 mb-4">
//         <button
//           onClick={() => setActiveTab("pending")}
//           className={`px-4 py-2 rounded ${
//             activeTab === "pending" ? "bg-blue-600 text-white" : "bg-gray-200"
//           }`}
//         >
//           Pending Ideas
//         </button>

//         <button
//           onClick={() => setActiveTab("status")}
//           className={`px-4 py-2 rounded ${
//             activeTab === "status" ? "bg-blue-600 text-white" : "bg-gray-200"
//           }`}
//         >
//           Status
//         </button>

//         <button
//           onClick={() => setActiveTab("projects")}
//           className={`px-4 py-2 rounded ${
//             activeTab === "projects" ? "bg-blue-600 text-white" : "bg-gray-200"
//           }`}
//         >
//           Project Checklist Overview
//         </button>
//       </div>

//       {/* Tab Content */}
//       {activeTab === "pending" && renderPendingIdeas()}
//       {activeTab === "status" && renderStatus()}
//       {activeTab === "projects" && renderProjects()}
//     </div>
//   );
// };

// export default HeadDashboardCards;


