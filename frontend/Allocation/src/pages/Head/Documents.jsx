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
  Upload,
  Download,
  Trash2,
  Plus,
  Search,
  Loader2,
  ClipboardCheck,
  FolderOpen,
  X,
  Check,
  FileUp
} from "lucide-react";

const Document = () => {
  const [documents, setDocuments] = useState([]);
  const [checklists, setChecklists] = useState([]);
  const [loading, setLoading] = useState(true);

  const [docTitle, setDocTitle] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [checkTitle, setCheckTitle] = useState("");
  const [uploading, setUploading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const [confirmDeleteId, setConfirmDeleteId] = useState(null);
  const fileInputRef = useRef(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [docs, checks] = await Promise.all([
        getDocuments(),
        getChecklistItems()
      ]);
      setDocuments(docs || []);
      setChecklists(checks.items || checks || []);
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleUpload = async () => {
    if (!selectedFile) return;
    setUploading(true);
    try {
      await uploadDocument(selectedFile, docTitle);
      setDocTitle("");
      setSelectedFile(null);
      fileInputRef.current.value = "";
      fetchData();
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
      fetchData();
    } catch {
      alert("Failed to add checklist item");
    }
  };

  const handleDelete = async (id, type) => {
    try {
      if (type === "doc") await deleteDocument(id);
      else await deleteChecklistItem(id);
      setConfirmDeleteId(null);
      fetchData();
    } catch {
      alert("Delete failed");
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 p-4 md:p-8 text-slate-800">
      <div className="max-w-[1300px] mx-auto">

        {/* --- HEADER --- */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-xl font-black text-slate-900 tracking-tight">
              Management <span className="text-indigo-600">Console</span>
            </h1>
            
          </div>

          {/* <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
            <input
              type="text"
              placeholder="Search by title..."
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-white border-2 border-slate-200 rounded-2xl pl-12 pr-6 py-3 text-sm w-full md:w-80 shadow-sm focus:border-indigo-500 transition-all outline-none text-slate-900 font-medium"
            />
          </div> */}
        </div>

        {/* --- MAIN CONTENT --- */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

          {/* LEFT: DOCUMENTS */}
          <div className="flex flex-col h-[750px]">
            <div className="bg-indigo-600 p-6 rounded-t-[2rem] flex items-center justify-between shadow-lg">
              <h2 className="text-white font-bold text-xl flex items-center gap-2">
                <FolderOpen size={24} /> Documents
              </h2>
              <span className="bg-white/20 text-white text-xs font-bold px-3 py-1 rounded-full">{documents.length} Files</span>
            </div>

            <div className="bg-slate-50 flex-1 rounded-b-[2rem] border-x-2 border-b-2 border-slate-200 shadow-xl overflow-hidden flex flex-col">
              
              {/* UPLOAD CARD (Solid white for contrast) */}
              <div className="p-6 bg-white border-b-2 border-slate-100 m-4 rounded-2xl shadow-sm space-y-4">
                <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-400 uppercase ml-1">Document Title</label>
                    <input
                        type="text"
                        placeholder="Enter descriptive name..."
                        value={docTitle}
                        onChange={(e) => setDocTitle(e.target.value)}
                        className="w-full bg-slate-50 border-2 border-slate-100 rounded-xl px-4 py-3 text-slate-900 font-semibold focus:border-indigo-400 outline-none transition-all"
                    />
                </div>
                
                <div
                    onClick={() => fileInputRef.current.click()}
                    className="border-2 border-dashed border-indigo-200 rounded-xl p-6 text-center cursor-pointer hover:bg-indigo-50 transition-all bg-indigo-50/30"
                >
                    <FileUp className="mx-auto text-indigo-500 mb-2" size={28} />
                    <p className="text-sm font-bold text-indigo-600">
                        {selectedFile ? selectedFile.name : "Select File to Upload"}
                    </p>
                    <input type="file" ref={fileInputRef} hidden onChange={(e) => {
                        setSelectedFile(e.target.files[0]);
                        if (!docTitle) setDocTitle(e.target.files[0].name.split(".")[0]);
                    }} />
                </div>

                <button
                    onClick={handleUpload}
                    disabled={uploading || !selectedFile}
                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-4 rounded-xl font-bold transition-all shadow-md active:scale-[0.98] flex items-center justify-center gap-2 disabled:bg-slate-300"
                >
                    {uploading ? <Loader2 className="animate-spin" /> : <Plus />}
                    Push to Repository
                </button>
              </div>

              {/* LIST AREA */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3 scrollbar-hide">
                {documents
                  .filter(d => d.title.toLowerCase().includes(searchTerm.toLowerCase()))
                  .map((doc) => (
                    <div key={doc._id} className="bg-white p-4 rounded-2xl border-2 border-slate-100 flex items-center justify-between hover:border-indigo-300 transition-all shadow-sm group">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-indigo-100 text-indigo-600 rounded-xl flex items-center justify-center">
                          <FileText size={24} />
                        </div>
                        <div>
                          <p className="font-bold text-slate-900 leading-tight">{doc.title}</p>
                          <p className="text-xs font-bold text-slate-400 uppercase mt-1">{doc.fileName.split(".").pop()} File</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <button onClick={() => downloadDocument(doc._id, doc.fileName)} className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all"><Download size={20} /></button>
                        
                        <div className="relative">
                          <button onClick={() => setConfirmDeleteId(confirmDeleteId === doc._id ? null : doc._id)} className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"><Trash2 size={20} /></button>
                          {confirmDeleteId === doc._id && (
                            <div className="absolute right-0 top-12 z-10 bg-white shadow-xl rounded-xl p-1 border-2 border-slate-100 flex gap-1">
                              <button onClick={() => handleDelete(doc._id, "doc")} className="bg-red-600 text-white p-2 rounded-lg hover:bg-red-700"><Check size={16}/></button>
                              <button onClick={() => setConfirmDeleteId(null)} className="bg-slate-200 text-slate-600 p-2 rounded-lg hover:bg-slate-300"><X size={16}/></button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>

          {/* RIGHT: CHECKLIST */}
          <div className="flex flex-col h-[750px]">
            <div className="bg-slate-900 p-6 rounded-t-[2rem] flex items-center justify-between shadow-lg">
              <h2 className="text-white font-bold text-xl flex items-center gap-2">
                <ClipboardCheck size={24} /> CheckList
              </h2>
            </div>

            <div className="bg-slate-50 flex-1 rounded-b-[2rem] border-x-2 border-b-2 border-slate-200 shadow-xl overflow-hidden flex flex-col">
              
              <div className="p-6 bg-white border-b-2 border-slate-100 m-4 rounded-2xl shadow-sm">
                <p className="text-xs font-bold text-slate-400 uppercase mb-2 ml-1">New Milestone</p>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={checkTitle}
                    onChange={(e) => setCheckTitle(e.target.value)}
                    placeholder="e.g. Project Approval"
                    className="flex-1 bg-slate-50 border-2 border-slate-100 rounded-xl px-4 py-3 text-slate-900 font-semibold focus:border-slate-900 outline-none transition-all"
                  />
                  <button
                    onClick={handleAddChecklist}
                    className="bg-slate-900 text-white px-6 rounded-xl hover:bg-indigo-600 transition-all shadow-md active:scale-95"
                  >
                    <Plus />
                  </button>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {checklists.map((item) => (
                  <div key={item._id} className="bg-white p-5 rounded-2xl border-2 border-slate-100 flex items-center justify-between hover:border-slate-400 transition-all shadow-sm">
                    <div className="flex items-center gap-4">
                      <div className="w-3 h-3 rounded-full bg-indigo-500 shadow-sm shadow-indigo-200"></div>
                      <span className="font-bold text-slate-800 tracking-tight">{item.title}</span>
                      <p> {item.createdAt && (
                  <p className="text-xs text-gray-400">
                    Added on: {new Date(item.createdAt).toLocaleString()}
                  </p>
                )}</p>
                    </div>

                    <div className="relative">
                      <button onClick={() => setConfirmDeleteId(confirmDeleteId === item._id ? null : item._id)} className="text-slate-300 hover:text-red-500 transition-all"><Trash2 size={20} /></button>
                      {confirmDeleteId === item._id && (
                        <div className="absolute right-0 top-10 z-10 bg-white shadow-xl rounded-xl p-1 border-2 border-slate-100 flex gap-1">
                          <button onClick={() => handleDelete(item._id, "check")} className="bg-red-600 text-white p-2 rounded-lg"><Check size={16}/></button>
                          <button onClick={() => setConfirmDeleteId(null)} className="bg-slate-200 text-slate-600 p-2 rounded-lg"><X size={16}/></button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Document;