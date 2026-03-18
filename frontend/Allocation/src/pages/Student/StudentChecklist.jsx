import React, { useEffect, useState } from "react";
import api from "../../utils/axios";
import { X, FileText, UploadCloud } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const StudentChecklist = ({ isOpen, onClose, projectId }) => {
  const [checklist, setChecklist] = useState([]);
  const [loading, setLoading] = useState(false);
  const [uploadingId, setUploadingId] = useState(null);

  useEffect(() => {
    if (isOpen && projectId) fetchChecklist();
  }, [isOpen, projectId]);

  const fetchChecklist = async () => {
    try {
      setLoading(true);
      const res = await api.get("/student/project/checklist", { params: { projectId } });
      const data = res.data?.checklist ?? res.data ?? [];
      setChecklist(Array.isArray(data) ? data : []);
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
    formData.append("checklistItemId", id);
    formData.append("title", item.title);

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

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* Glass background - Fixed for touch */}
          <div
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Checklist Modal - Optimized for Mobile (Bottom Sheet style on small screens) */}
          <motion.div
            className="relative w-full max-w-lg bg-white rounded-t-[2rem] sm:rounded-2xl shadow-2xl flex flex-col max-h-[92vh] sm:max-h-[85vh] z-10 overflow-hidden"
            initial={{ y: "100%", opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: "100%", opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
          >
            {/* Handle for mobile visual cue */}
            <div className="w-12 h-1.5 bg-gray-200 rounded-full mx-auto mt-3 sm:hidden" />

            {/* Header - Sticky */}
            <div className="flex justify-between items-center p-5 sm:p-6 border-b border-gray-100">
              <div>
                <h2 className="text-xl sm:text-2xl font-extrabold text-slate-800 tracking-tight">Project Checklist</h2>
                <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">Required Documents</p>
              </div>
              <button
                onClick={onClose}
                className="p-2.5 rounded-full bg-slate-50 hover:bg-slate-100 text-slate-600 transition-all active:scale-95"
              >
                <X size={20} />
              </button>
            </div>

            {/* Body - Scrollable */}
            <div className="overflow-y-auto p-4 sm:p-6 custom-scrollbar flex-1 bg-slate-50/50">
              {loading ? (
                <div className="flex flex-col items-center justify-center py-12 space-y-3">
                  <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
                  <p className="text-sm font-medium text-slate-500">Updating list...</p>
                </div>
              ) : !Array.isArray(checklist) || checklist.length === 0 ? (
                <p className="text-center text-slate-500 py-12 font-medium">No checklist available.</p>
              ) : (
                <div className="space-y-4">
                  {checklist.map((item) => {
                    const id = item.checklistId || item._id;
                    const isSubmitted = item.status === "submitted";
                    
                    return (
                      <div
                        key={id}
                        className="bg-white border border-slate-200 rounded-2xl p-4 flex flex-col space-y-4 shadow-sm hover:shadow-md transition-all group"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex items-start gap-3 flex-1 min-w-0">
                            <div className={`p-2 rounded-lg shrink-0 ${isSubmitted ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-50 text-slate-400'}`}>
                              <FileText size={20} />
                            </div>
                            <div className="truncate">
                              <p className="font-bold text-slate-800 text-sm sm:text-base truncate leading-tight">
                                {item.title}
                              </p>
                              <div className="flex items-center gap-2 mt-1">
                                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-tighter ${
                                  isSubmitted ? "bg-emerald-100 text-emerald-700" : "bg-red-50 text-red-600"
                                }`}>
                                  {item.status || "pending"}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>

                        {item.fileName && (
                          <div className="flex items-center gap-2 px-3 py-2 bg-slate-50 rounded-xl text-[11px] text-slate-500 border border-dashed border-slate-200">
                             <FileText size={14} className="shrink-0" />
                             <span className="truncate">{item.fileName}</span>
                          </div>
                        )}

                        <label className={`
                          w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold transition-all active:scale-[0.98] cursor-pointer
                          ${uploadingId === id 
                            ? "bg-slate-100 text-slate-400 cursor-not-allowed" 
                            : isSubmitted 
                              ? "bg-slate-100 text-slate-700 hover:bg-slate-200" 
                              : "bg-indigo-600 text-white hover:bg-indigo-700 shadow-lg shadow-indigo-100"
                          }
                        `}>
                          <UploadCloud size={18} />
                          {uploadingId === id ? "Uploading..." : isSubmitted ? "Replace Document" : "Upload Document"}
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
                  })}
                </div>
              )}
            </div>

            {/* Bottom Spacer for Mobile (safari bar protection) */}
            <div className="h-6 bg-white sm:hidden" />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default StudentChecklist;