import React, { useState, useEffect, useRef } from "react";
import {
  uploadDocument,
  getDocuments,
  deleteDocument,
  downloadDocument,
  addChecklistItem,
  getChecklistItems,
  deleteChecklistItem,
} from "../../services/headService";

import {
  FileText,
  Download,
  Trash2,
  Plus,
  Loader2,
  ClipboardCheck,
  FolderOpen,
  X,
  Check,
  FileUp,
} from "lucide-react";

import { motion, AnimatePresence } from "framer-motion";

const Document = () => {
  const [documents, setDocuments] = useState([]);
  const [checklists, setChecklists] = useState([]);
  const [docLoading, setDocLoading] = useState(true);
  const [checkLoading, setCheckLoading] = useState(true);

  const [docTitle, setDocTitle] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [checkTitle, setCheckTitle] = useState("");
  const [uploading, setUploading] = useState(false);

  const [confirmDeleteId, setConfirmDeleteId] = useState(null);
  const [deleteType, setDeleteType] = useState(null);

  const fileInputRef = useRef(null);

  // Separate fetch functions
  const fetchDocs = async () => {
    try {
      const docs = await getDocuments();
      setDocuments(docs || []);
    } catch (err) {
      console.error(err);
    } finally {
      setDocLoading(false);
    }
  };

  const fetchChecks = async () => {
    try {
      const checks = await getChecklistItems();
      setChecklists(checks.items || checks || []);
    } catch (err) {
      console.error(err);
    } finally {
      setCheckLoading(false);
    }
  };

  useEffect(() => {
    fetchDocs();
    fetchChecks();
  }, []);

  const handleUpload = async () => {
    if (!selectedFile) return;
    setUploading(true);
    try {
      await uploadDocument(selectedFile, docTitle);
      setDocTitle("");
      setSelectedFile(null);
      fileInputRef.current.value = "";
      await fetchDocs();
    } catch {
      alert("Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const handleAddChecklist = async () => {
    if (!checkTitle.trim()) return;
    try {
      await addChecklistItem({ title: checkTitle });
      setCheckTitle("");
      await fetchChecks();
    } catch {
      alert("Failed to add checklist item");
    }
  };

  const handleDelete = async (id) => {
    try {
      if (deleteType === "doc") {
        await deleteDocument(id);
        await fetchDocs();
      } else {
        await deleteChecklistItem(id);
        await fetchChecks();
      }
      setConfirmDeleteId(null);
      setDeleteType(null);
    } catch {
      alert("Delete failed");
    }
  };

  // Smooth motion variants
  const itemVariants = {
    hidden: { opacity: 0, y: -10, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { type: "spring", stiffness: 300, damping: 25 },
    },
    exit: { opacity: 0, y: 10, scale: 0.95, transition: { duration: 0.3 } },
  };

  return (
    <div className="min-h-screen bg-slate-100 p-4 md:p-6 lg:p-10">
      <div className="max-w-[1300px] mx-auto flex flex-col lg:flex-row gap-6">
        {/* DOCUMENTS CARD */}
        <div className="flex flex-col w-full lg:w-1/2 h-[650px] md:h-[700px] lg:h-[750px]">
          <div className="bg-indigo-600 p-4 sm:p-6 rounded-t-[1rem] flex items-center justify-between shadow-md">
            <div className="flex flex-col">
              <h2 className="text-white font-bold text-lg sm:text-xl flex items-center gap-2">
                <FolderOpen /> Documents
              </h2>
              <p className="text-indigo-200 text-sm mt-1">
                Upload, download, or manage all project-related files here.
              </p>
            </div>
            <span className="bg-white/20 text-white text-xs sm:text-sm font-bold px-3 py-1 rounded-full">
              {documents.length} Files
            </span>
          </div>

          <div className="bg-slate-50 flex-1 rounded-b-[1rem] border-x-2 border-b-2 border-slate-200 shadow-lg flex flex-col overflow-hidden">
            {/* UPLOAD */}
            <div className="p-4 sm:p-6 bg-white border-b-2 border-slate-100 m-4 rounded-2xl shadow-sm space-y-3">
              <input
                type="text"
                placeholder="Document title"
                value={docTitle}
                onChange={(e) => setDocTitle(e.target.value)}
                className="w-full bg-slate-50 border-2 border-slate-100 rounded-xl px-3 sm:px-4 py-2 sm:py-3 font-semibold outline-none text-sm sm:text-base"
              />
              <div
                onClick={() => fileInputRef.current.click()}
                className="border-2 border-dashed border-indigo-200 rounded-xl p-4 sm:p-6 text-center cursor-pointer bg-indigo-50/30"
              >
                <FileUp className="mx-auto text-indigo-500 mb-1 sm:mb-2" />
                <p className="text-sm sm:text-base font-bold text-indigo-600">
                  {selectedFile ? selectedFile.name : "Select File"}
                </p>
                <input
                  type="file"
                  ref={fileInputRef}
                  hidden
                  onChange={(e) => {
                    const file = e.target.files[0];
                    setSelectedFile(file);
                    if (!docTitle) setDocTitle(file.name.split(".")[0]);
                  }}
                />
              </div>
              <button
                onClick={handleUpload}
                disabled={uploading || !selectedFile}
                className="w-full bg-indigo-600 text-white py-2 sm:py-3 rounded-xl font-bold flex items-center justify-center gap-2 text-sm sm:text-base"
              >
                {uploading ? <Loader2 className="animate-spin" /> : <Plus />}
                Upload
              </button>
            </div>

            {/* LIST */}
            <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-3">
              {docLoading ? (
                <div className="p-4 text-center text-slate-400 text-sm sm:text-base">
                  Loading Documents...
                </div>
              ) : (
                <AnimatePresence mode="popLayout" initial={false}>
                  {documents.map((doc) => (
                    <motion.div
                      key={doc._id}
                      layout
                      variants={itemVariants}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                      className="bg-white p-3 sm:p-4 rounded-2xl border-2 border-slate-100 flex justify-between items-center shadow-sm"
                    >
                      <div className="flex items-center gap-3 sm:gap-4">
                        <div className="w-10 h-10 sm:w-12 sm:h-12 bg-indigo-100 text-indigo-600 rounded-xl flex items-center justify-center">
                          <FileText size={18} />
                        </div>
                        <div>
                          <p className="font-bold text-slate-900 text-sm sm:text-base">
                            {doc.title}
                          </p>
                          <p className="text-xs sm:text-sm text-gray-400 uppercase">
                            {doc.fileName.split(".").pop()} File
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 sm:gap-2 relative">
                        <button
                          onClick={() =>
                            downloadDocument(doc._id, doc.fileName)
                          }
                          className="p-1 sm:p-2 text-slate-400 hover:text-indigo-600"
                        >
                          <Download size={18} />
                        </button>
                        <button
                          onClick={() => {
                            setConfirmDeleteId(doc._id);
                            setDeleteType("doc");
                          }}
                          className="p-1 sm:p-2 text-slate-400 hover:text-red-600"
                        >
                          <Trash2 size={18} />
                        </button>
                        {confirmDeleteId === doc._id &&
                          deleteType === "doc" && (
                            <div className="absolute right-0 top-10 z-20 bg-white shadow-md rounded-xl p-1 border-2 border-slate-100 flex gap-1">
                              <button
                                onClick={() => handleDelete(doc._id)}
                                className="bg-red-600 text-white p-2 rounded-lg"
                              >
                                <Check size={16} />
                              </button>
                              <button
                                onClick={() => setConfirmDeleteId(null)}
                                className="bg-slate-200 p-2 rounded-lg"
                              >
                                <X size={16} />
                              </button>
                            </div>
                          )}
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              )}
            </div>
          </div>
        </div>

        {/* CHECKLIST CARD */}
        <div className="flex flex-col w-full lg:w-1/2 h-[650px] md:h-[700px] lg:h-[750px]">
          <div className="bg-slate-900 p-4 sm:p-6 rounded-t-[1rem] flex items-center justify-between shadow-md">
            <div className="flex flex-col">
              <h2 className="text-white font-bold text-lg sm:text-xl flex items-center gap-2">
                <ClipboardCheck /> Checklist
              </h2>
              <p className="text-slate-300 text-sm mt-1">
                Track milestones, tasks, and project progress in one place.
              </p>
            </div>
            <span className="bg-white/20 text-white text-xs sm:text-sm font-bold px-3 py-1 rounded-full">
              {checklists.length} Items
            </span>
          </div>

          <div className="bg-slate-50 flex-1 rounded-b-[1rem] border-x-2 border-b-2 border-slate-200 shadow-lg flex flex-col overflow-hidden">
            <div className="p-4 sm:p-6 bg-white border-b-2 border-slate-100 m-4 rounded-2xl shadow-sm">
              <div className="flex flex-col sm:flex-row gap-2 items-stretch sm:items-center">
                <input
                  type="text"
                  value={checkTitle}
                  onChange={(e) => setCheckTitle(e.target.value)}
                  placeholder="New milestone..."
                  className="flex-1 bg-slate-50 border-2 border-slate-100 rounded-xl px-3 sm:px-4 py-2 sm:py-3 font-semibold text-sm sm:text-base outline-none"
                />
                <button
                  onClick={handleAddChecklist}
                  className="bg-slate-900 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-xl flex items-center justify-center flex-shrink-0"
                >
                  <Plus />
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-3">
              <AnimatePresence mode="popLayout" initial={false}>
                {checklists.map((item) => (
                  <motion.div
                    key={item._id}
                    layout
                    variants={itemVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    className="bg-white p-3 sm:p-4 rounded-2xl border-2 border-slate-100 flex items-center justify-between shadow-sm"
                  >
                    <span className="font-bold text-slate-800 text-sm sm:text-base">
                      {item.title}
                    </span>
                    <div className="relative">
                      <button
                        onClick={() => {
                          setConfirmDeleteId(item._id);
                          setDeleteType("check");
                        }}
                        className="text-slate-400 hover:text-red-500 p-1 sm:p-2"
                      >
                        <Trash2 size={18} />
                      </button>
                      {confirmDeleteId === item._id &&
                        deleteType === "check" && (
                          <div className="absolute right-0 top-10 z-20 bg-white shadow-md rounded-xl p-1 border-2 border-slate-100 flex gap-1">
                            <button
                              onClick={() => handleDelete(item._id)}
                              className="bg-red-600 text-white p-2 rounded-lg"
                            >
                              <Check size={16} />
                            </button>
                            <button
                              onClick={() => setConfirmDeleteId(null)}
                              className="bg-slate-200 p-2 rounded-lg"
                            >
                              <X size={16} />
                            </button>
                          </div>
                        )}
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Document;
