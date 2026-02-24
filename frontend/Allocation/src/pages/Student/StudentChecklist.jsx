import React, { useEffect, useState } from "react";
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

  const fetchChecklist = async () => {
    try {
      setLoading(true);

      const res = await api.get("/student/project/checklist", {
        params: { projectId },
      });

      setChecklist(
        Array.isArray(res.data?.checklist) ? res.data.checklist : [],
      );
    } catch (err) {
      console.error("Error fetching checklist:", err);
      setChecklist([]);
    } finally {
      setLoading(false);
    }
  };

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
      </div>
    </div>
  );
};

export default StudentChecklist;
