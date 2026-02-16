// import React, { useEffect, useState } from "react";
// import axios from "axios";

// const StudentChecklist = ({ isOpen, onClose, token }) => {
//   const [checklist, setChecklist] = useState([]);
//   const [projectTitle, setProjectTitle] = useState("");
//   const [projectId, setProjectId] = useState("");
//   const [uploading, setUploading] = useState(false);

//   useEffect(() => {
//     if (isOpen) fetchChecklist();
//   }, [isOpen]);

//   const fetchChecklist = async () => {
//     try {
//       const res = await axios.get(
//         "http://localhost:8000/api/student/project/checklist",
//         { headers: { Authorization: `Bearer ${token}` } }
//       );

//       setChecklist(res.data.checklist || []);
//       setProjectTitle(res.data.title);
//       setProjectId(res.data.projectId);
//     } catch (err) {
//       console.error("Checklist fetch error:", err);
//     }
//   };

//   const handleFileUpload = async (e, item) => {
//     e.stopPropagation(); // ✅ Prevent modal click
//     const file = e.target.files[0];
//     if (!file) return;

//     const formData = new FormData();
//     formData.append("file", file);
//     formData.append("title", item.title);
//     formData.append("projectId", projectId);
//     formData.append("checklistItemId", item.checklistId);

//     try {
//       setUploading(true);

//       await axios.post(
//         "http://localhost:8000/api/student/project/upload-checklist",
//         formData,
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//             "Content-Type": "multipart/form-data",
//           },
//         }
//       );

//       await fetchChecklist();
//     } catch (error) {
//       console.error("Upload failed:", error);
//     } finally {
//       setUploading(false);
//     }
//   };

//   if (!isOpen) return null;

//   return (
//     <div
//       className="fixed inset-0 flex items-center justify-center bg-black/50 z-50"
//       onClick={onClose}
//     >
//       <div
//         className="bg-white rounded-lg p-6 w-full max-w-lg shadow-lg"
//         onClick={(e) => e.stopPropagation()} // ✅ Prevent closing modal when clicking inside
//       >
//         <h2 className="text-xl font-bold mb-4">Checklist - {projectTitle}</h2>

//         {checklist.length === 0 ? (
//           <p>No checklist items available yet.</p>
//         ) : (
//           <ul className="space-y-4">
//             {checklist.map((item) => (
//               <li
//                 key={item.checklistId}
//                 className="border p-3 rounded-md flex justify-between items-center"
//               >
//                 <div>
//                   <span className="font-medium">{item.title}</span>

//                   <p
//                     className={`text-sm ${
//                       item.status === "submitted"
//                         ? "text-green-600"
//                         : "text-red-600"
//                     }`}
//                   >
//                     Status: {item.status}
//                   </p>

//                   {item.status === "submitted" && item.fileName && (
//                     <p className="text-sm text-gray-600 mt-1">
//                       📄 {item.fileName}
//                     </p>
//                   )}
//                 </div>

//                 {/* ✅ Updated: Allow Replace File */}
//                 <div>
//                   {item.status === "submitted" ? (
//                     <div className="flex flex-col items-end">
//                       <a
//                         href={`http://localhost:8000/${item.fileUrl}`}
//                         target="_blank"
//                         rel="noopener noreferrer"
//                         className="text-blue-600 text-sm underline"
//                         onClick={(e) => e.stopPropagation()} // ✅ Prevent modal click
//                       >
//                         Download
//                       </a>

//                       <button
//                         className="text-blue-600 underline text-xs mt-1"
//                         onClick={(e) => {
//                           e.stopPropagation(); // ✅ Prevent modal trigger
//                           document
//                             .getElementById(`modal-file-${item.checklistId}`)
//                             .click();
//                         }}
//                       >
//                         Replace File
//                       </button>

//                       <input
//                         id={`modal-file-${item.checklistId}`}
//                         type="file"
//                         accept=".pdf,.doc,.docx"
//                         className="hidden"
//                         onClick={(e) => e.stopPropagation()} // ✅ Prevent modal trigger
//                         onChange={(e) => handleFileUpload(e, item)}
//                         disabled={uploading}
//                       />
//                     </div>
//                   ) : (
//                     <input
//                       type="file"
//                       accept=".pdf,.doc,.docx"
//                       className="text-sm"
//                       onClick={(e) => e.stopPropagation()} // ✅ Prevent modal trigger
//                       onChange={(e) => handleFileUpload(e, item)}
//                       disabled={uploading}
//                     />
//                   )}
//                 </div>
//               </li>
//             ))}
//           </ul>
//         )}

//         <button
//           onClick={onClose}
//           className="mt-5 bg-gray-700 text-white px-4 py-2 rounded hover:bg-gray-800"
//         >
//           Close
//         </button>
//       </div>
//     </div>
//   );
// };

// export default StudentChecklist;








import React, { useEffect, useState } from "react";
import api from "../../utils/axios"; // ✅ Use configured instance

const StudentChecklist = ({ isOpen, onClose }) => {
  const [checklist, setChecklist] = useState([]);
  const [projectTitle, setProjectTitle] = useState("");
  const [projectId, setProjectId] = useState("");
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (isOpen) fetchChecklist();
  }, [isOpen]);

  const fetchChecklist = async () => {
    try {
      const res = await api.get("/student/project/checklist");

      setChecklist(res.data.checklist || []);
      setProjectTitle(res.data.title);
      setProjectId(res.data.projectId);
    } catch (err) {
      console.error("Checklist fetch error:", err);
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
    formData.append("checklistItemId", item.checklistId);

    try {
      setUploading(true);

      await api.post(
        "/student/project/upload-checklist",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      await fetchChecklist();
    } catch (error) {
      console.error("Upload failed:", error);
    } finally {
      setUploading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-black/50 z-50 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl p-6 w-full max-w-2xl shadow-2xl border border-gray-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex justify-between items-center mb-5">
          <h2 className="text-2xl font-semibold text-gray-800">
            Project Checklist
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-800 text-lg"
          >
            ✕
          </button>
        </div>

        <p className="text-sm text-gray-600 mb-4">
          <span className="font-medium">Project:</span> {projectTitle}
        </p>

        {checklist.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No checklist items available yet.
          </div>
        ) : (
          <ul className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
            {checklist.map((item) => (
              <li
                key={item.checklistId}
                className="border rounded-xl p-4 flex justify-between items-center hover:shadow-md transition"
              >
                <div>
                  <h4 className="font-medium text-gray-800">
                    {item.title}
                  </h4>

                  <p
                    className={`text-sm mt-1 font-medium ${
                      item.status === "submitted"
                        ? "text-green-600"
                        : "text-red-500"
                    }`}
                  >
                    {item.status === "submitted"
                      ? "Submitted"
                      : "Pending"}
                  </p>

                  {item.status === "submitted" && item.fileName && (
                    <p className="text-xs text-gray-500 mt-1">
                      📄 {item.fileName}
                    </p>
                  )}
                </div>

                <div>
                  {item.status === "submitted" ? (
                    <div className="flex flex-col items-end space-y-1">
                      <a
                        href={`${import.meta.env.VITE_API_URL.replace(
                          "/api",
                          ""
                        )}/${item.fileUrl}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 text-sm hover:underline"
                        onClick={(e) => e.stopPropagation()}
                      >
                        Download
                      </a>

                      <button
                        className="text-blue-500 text-xs hover:underline"
                        onClick={(e) => {
                          e.stopPropagation();
                          document
                            .getElementById(
                              `modal-file-${item.checklistId}`
                            )
                            .click();
                        }}
                      >
                        Replace File
                      </button>

                      <input
                        id={`modal-file-${item.checklistId}`}
                        type="file"
                        accept=".pdf,.doc,.docx"
                        className="hidden"
                        onClick={(e) => e.stopPropagation()}
                        onChange={(e) => handleFileUpload(e, item)}
                        disabled={uploading}
                      />
                    </div>
                  ) : (
                    <input
                      type="file"
                      accept=".pdf,.doc,.docx"
                      className="text-sm border border-gray-300 rounded-md p-1"
                      onClick={(e) => e.stopPropagation()}
                      onChange={(e) => handleFileUpload(e, item)}
                      disabled={uploading}
                    />
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}

        {/* Footer */}
        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-900 transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default StudentChecklist;
