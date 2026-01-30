// import React, { useState } from "react";

// const StudentDashboardCards = ({ assignStatus, ideaStatus, onIdeaClick }) => {
//   const [openChecklistId, setOpenChecklistId] = useState(null);
//   const [checklist, setChecklist] = useState([]);

//   const fetchChecklist = async () => {
//     try {
//       const token = localStorage.getItem("token");
//       const res = await fetch(
//         "http://localhost:8000/api/student/project/checklist",
//         {
//           headers: { Authorization: `Bearer ${token}` },
//         }
//       );
//       const data = await res.json();

//       if (data.success) {
//         setChecklist(data.checklist || []);
//       } else {
//         setChecklist([]);
//       }
//     } catch (err) {
//       console.error("Error fetching checklist:", err);
//     }
//   };

//   const handleChecklistToggle = async (projectId) => {
//     if (openChecklistId !== projectId) {
//       await fetchChecklist();
//       setOpenChecklistId(projectId);
//     } else {
//       setOpenChecklistId(null);
//     }
//   };

//   const handleFileUpload = async (e, item, projectId) => {
//     e.stopPropagation();
//     const file = e.target.files[0];
//     if (!file) return;

//     const formData = new FormData();
//     formData.append("file", file);
//     formData.append("title", item.title);
//     formData.append("projectId", projectId);
//     formData.append("checklistItemId", item.checklistId);

//     try {
//       const token = localStorage.getItem("token");

//       const res = await fetch(
//         "http://localhost:8000/api/student/project/upload-checklist",
//         {
//           method: "POST",
//           headers: { Authorization: `Bearer ${token}` },
//           body: formData,
//         }
//       );

//       const data = await res.json();

//       if (data.success) {
//         setChecklist((prev) =>
//           prev.map((c) =>
//             c.checklistId === item.checklistId
//               ? {
//                   ...c,
//                   status: "submitted",
//                   fileName: data.submission.fileName,
//                   fileUrl: data.submission.filePath,
//                 }
//               : c
//           )
//         );
//       } else {
//         alert("❌ Upload failed: " + data.message);
//       }
//     } catch (err) {
//       console.error("File upload failed:", err);
//       alert("❌ Error while uploading file!");
//     }
//   };

//   const renderCard = (project, title, clickable = false) => {
//     if (!project) {
//       return (
//         <div className="p-6 bg-white shadow rounded">
//           <h2 className="text-xl font-bold mb-4">{title}</h2>
//           <p>No project submitted yet.</p>
//         </div>
//       );
//     }

//     const mentorName =
//       project.selectedMentor?.name ||
//       project.approvedMentor?.name ||
//       project.mentor?.name ||
//       "Not assigned";

//     const status = project.status
//       ? project.status.charAt(0).toUpperCase() + project.status.slice(1)
//       : "Pending";

//     const team = project.teamMembers || [];

//     return (
//       <div
//         className={`p-6 bg-white shadow rounded ${
//           clickable ? "cursor-pointer hover:bg-gray-100" : ""
//         }`}
//         onClick={clickable ? onIdeaClick : undefined}
//       >
//         <h2 className="text-xl font-bold mb-4">{title}</h2>
//         <h3 className="font-semibold text-lg mb-2">{project.title}</h3>
//         <p className="text-sm text-gray-600 mb-2">{project.description}</p>

//         <p className="text-sm">
//           <strong>Mentor:</strong> {mentorName}
//         </p>

//         <p className="text-sm mt-2">
//           <strong>Status:</strong>{" "}
//           <span
//             className={`font-semibold ${
//               status === "Pending"
//                 ? "text-yellow-600"
//                 : status === "Approved"
//                 ? "text-green-600"
//                 : "text-red-600"
//             }`}
//           >
//             {status}
//           </span>
//         </p>

//         {team.length > 0 && (
//           <div className="mt-4">
//             <h4 className="font-semibold mb-2">Team Members:</h4>
//             <ul className="space-y-1">
//               {team.map((member) => (
//                 <li key={member._id} className="text-sm text-gray-700">
//                   {member.name} ({member.rollno})
//                 </li>
//               ))}
//             </ul>
//           </div>
//         )}

//         {project.teamLead && (
//           <p className="mt-2 text-sm">
//             <strong>Team Lead:</strong> {project.teamLead.name} (
//             {project.teamLead.email})
//           </p>
//         )}

//         {/* ✅ Checklist Button */}
//         <button
//           onClick={(e) => {
//             e.stopPropagation();
//             handleChecklistToggle(project._id);
//           }}
//           className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
//         >
//           {openChecklistId === project._id ? "Hide Checklist" : "View Checklist"}
//         </button>

//         {/* ✅ Checklist Upload Section */}
//         {openChecklistId === project._id && (
//           <div className="mt-4 border-t pt-3">
//             <h4 className="font-semibold mb-3">Upload Checklist Documents:</h4>

//             {checklist.length > 0 ? (
//               checklist.map((item) => (
//                 <div
//                   key={item.checklistId}
//                   className="mb-3 p-3 border rounded bg-gray-50 flex justify-between items-center"
//                 >
//                   <div>
//                     <p className="font-medium">{item.title}</p>

//                     <p className="text-xs text-gray-500">
//                       Status:{" "}
//                       <span
//                         className={
//                           item.status === "submitted"
//                             ? "text-green-600"
//                             : "text-yellow-600"
//                         }
//                       >
//                         {item.status}
//                       </span>
//                     </p>

//                     {item.status === "submitted" && item.fileName && (
//                       <p className="text-xs text-gray-600 mt-1">
//                         📄 {item.fileName}
//                       </p>
//                     )}
//                   </div>

//                   {/* ✅ Updated: Allow Replace File */}
//                   <div>
//                     {item.status === "submitted" ? (
//                       <div className="flex flex-col items-end">
//                         <button
//                           className="text-blue-600 underline text-xs mb-1"
//                           onClick={(e) => {
//                             e.stopPropagation(); // ✅ Prevent modal trigger
//                             document
//                               .getElementById(`file-${item.checklistId}`)
//                               .click();
//                           }}
//                         >
//                           Replace File
//                         </button>

//                         <input
//                           id={`file-${item.checklistId}`}
//                           type="file"
//                           accept=".pdf,.doc,.docx,.xls,.xlsx"
//                           className="hidden"
//                           onClick={(e) => e.stopPropagation()} // ✅ Prevent modal trigger
//                           onChange={(e) =>
//                             handleFileUpload(e, item, project._id)
//                           }
//                         />
//                       </div>
//                     ) : (
//                       <input
//                         type="file"
//                         accept=".pdf,.doc,.docx,.xls,.xlsx"
//                         className="text-sm"
//                         onClick={(e) => e.stopPropagation()}
//                         onChange={(e) =>
//                           handleFileUpload(e, item, project._id)
//                         }
//                       />
//                     )}
//                   </div>
//                 </div>
//               ))
//             ) : (
//               <p className="text-sm text-gray-600">No checklist available.</p>
//             )}
//           </div>
//         )}
//       </div>
//     );
//   };

//   if (!assignStatus && !ideaStatus) {
//     return <p>No project assigned or idea submitted yet.</p>;
//   }

//   return (
//     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//       {renderCard(ideaStatus, "My Project Idea", true)}
//       {renderCard(assignStatus, "My Assigned Project")}
//     </div>
//   );
// };

// export default StudentDashboardCards;