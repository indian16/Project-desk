import React, { useEffect, useState } from "react";
<<<<<<< HEAD
import api from "../../utils/axios";

const StudentChecklist = ({ isOpen, onClose, projectId }) => {
  const [checklist, setChecklist] = useState([]);
  const [loading, setLoading] = useState(false);
  const [uploadingId, setUploadingId] = useState(null);

  useEffect(() => {
    if (isOpen && projectId) {
      fetchChecklist();
    }
  }, [isOpen, projectId]);

=======
import api from "../../utils/axios"; // ✅ centralized axios

const StudentChecklist = ({ isOpen, onClose }) => {
  const [checklist, setChecklist] = useState([]);
  const [projectTitle, setProjectTitle] = useState("");
  const [projectId, setProjectId] = useState("");
  const [uploadingId, setUploadingId] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) fetchChecklist();
  }, [isOpen]);

  /* ---------------- FETCH CHECKLIST ---------------- */
>>>>>>> 30259a2b483949943a22a578009751d293343d6b
  const fetchChecklist = async () => {
    try {
      setLoading(true);

<<<<<<< HEAD
      const res = await api.get("/student/project/checklist", {
        params: { projectId },
      });

      setChecklist(
        Array.isArray(res.data?.checklist) ? res.data.checklist : [],
      );
    } catch (err) {
      console.error("Error fetching checklist:", err);
=======
      const res = await api.get("/student/project/checklist");

      setChecklist(res.data.checklist || []);
      setProjectTitle(res.data.title || "");
      setProjectId(res.data.projectId || "");
    } catch (err) {
      console.error("Checklist fetch error:", err);
>>>>>>> 30259a2b483949943a22a578009751d293343d6b
      setChecklist([]);
    } finally {
      setLoading(false);
    }
  };

<<<<<<< HEAD
  const handleFileUpload = async (e, item) => {
    const file = e.target.files[0];
    if (!file) return;

    const id = item.checklistId || item._id;

    const formData = new FormData();
    formData.append("file", file);
    formData.append("projectId", projectId);
    formData.append("checklistItemId", id); // ✅ must match backend
    formData.append("title", item.title); // ✅ required by backend

    try {
      setUploadingId(id);

      await api.post("/student/project/upload-checklist", formData);

      fetchChecklist();
    } catch (err) {
      console.error("Upload failed:", err.response?.data);
    } finally {
      setUploadingId(null);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
      <div className="bg-white w-[600px] max-h-[80vh] overflow-y-auto rounded-xl shadow-lg p-6">
        <h2 className="text-xl font-bold mb-4">Project Checklist</h2>

        {loading ? (
          <p>Loading...</p>
        ) : checklist.length === 0 ? (
          <p>No checklist available.</p>
        ) : (
          checklist.map((item) => {
            const id = item.checklistId || item._id;

            return (
              <div
                key={id}
                className="border rounded-lg p-4 flex justify-between items-center mb-3"
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
                    {(item.status || "pending").toUpperCase()}
                  </p>

                  {item.fileName && (
                    <p className="text-xs text-slate-500 mt-1">
                      📄 {item.fileName}
                    </p>
                  )}
                </div>

                <label className="cursor-pointer text-blue-600 font-medium hover:underline">
                  {uploadingId === id
                    ? "Uploading..."
                    : item.status === "submitted"
                      ? "Replace File"
                      : "Upload File"}

                  <input
                    type="file"
                    accept=".pdf,.doc,.docx"
                    onChange={(e) => handleFileUpload(e, item)}
                    disabled={uploadingId === id}
                    className="hidden"
                  />
                </label>
              </div>
            );
          })
        )}

        <div className="mt-6 text-right">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-700 text-white rounded-lg"
          >
            Close
          </button>
        </div>
=======
  /* ---------------- FILE UPLOAD ---------------- */
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
      setUploadingId(item.checklistId);

      await api.post(
        "/student/project/upload-checklist",
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      await fetchChecklist(); // refresh
    } catch (error) {
      console.error("Upload failed:", error);
      alert("File upload failed.");
    } finally {
      setUploadingId(null);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-black/50 z-50"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg p-6 w-full max-w-lg shadow-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-xl font-bold mb-4">
          Checklist {projectTitle && `- ${projectTitle}`}
        </h2>

        {loading ? (
          <p className="text-gray-500">Loading checklist...</p>
        ) : checklist.length === 0 ? (
          <p>No checklist items available yet.</p>
        ) : (
          <ul className="space-y-4">
            {checklist.map((item) => (
              <li
                key={item.checklistId}
                className="border p-3 rounded-md flex justify-between items-center"
              >
                <div>
                  <span className="font-medium">{item.title}</span>

                  <p
                    className={`text-sm ${
                      item.status === "submitted"
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    Status: {item.status}
                  </p>

                  {item.status === "submitted" && item.fileName && (
                    <p className="text-sm text-gray-600 mt-1">
                      📄 {item.fileName}
                    </p>
                  )}
                </div>

                {/* Upload / Replace Section */}
                <div>
                  {item.status === "submitted" ? (
                    <div className="flex flex-col items-end">
                      <a
                        href={`${import.meta.env.VITE_API_URL.replace(
                          "/api",
                          ""
                        )}/${item.fileUrl}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 text-sm underline"
                        onClick={(e) => e.stopPropagation()}
                      >
                        Download
                      </a>

                      <button
                        className="text-blue-600 underline text-xs mt-1"
                        onClick={(e) => {
                          e.stopPropagation();
                          document
                            .getElementById(`modal-file-${item.checklistId}`)
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
                        disabled={uploadingId === item.checklistId}
                      />
                    </div>
                  ) : (
                    <input
                      type="file"
                      accept=".pdf,.doc,.docx"
                      className="text-sm"
                      onClick={(e) => e.stopPropagation()}
                      onChange={(e) => handleFileUpload(e, item)}
                      disabled={uploadingId === item.checklistId}
                    />
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}

        <button
          onClick={onClose}
          className="mt-5 bg-gray-700 text-white px-4 py-2 rounded hover:bg-gray-800"
        >
          Close
        </button>
>>>>>>> 30259a2b483949943a22a578009751d293343d6b
      </div>
    </div>
  );
};

export default StudentChecklist;
