import React, { useEffect, useState } from "react";
import { getDocuments, downloadDocument } from "../../services/mentorService";
import { FileText, Download, FolderOpen, Loader2 } from "lucide-react";

const Documentation = () => {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchDocuments = async () => {
    setLoading(true);
    try {
      const docs = await getDocuments();
      setDocuments(docs || []);
    } catch (err) {
      console.error(err);
      alert("Failed to fetch documents.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, []);

  return (
    <div className="min-h-screen bg-slate-100 p-4 md:p-8">
      <div className="max-w-[1000px] mx-auto">
        {/* Header */}
        <div className="bg-indigo-600 p-6 rounded-t-[2rem] flex items-center justify-between shadow-lg">
          <h2 className="text-white font-bold text-xl flex items-center gap-2">
            <FolderOpen /> Documents
          </h2>
          <span className="bg-white/20 text-white text-xs font-bold px-3 py-1 rounded-full">
            {documents.length} Files
          </span>
        </div>

        {/* Body */}
        <div className="bg-slate-50 rounded-b-[2rem] border-2 border-slate-200 shadow-xl p-6">
          {loading ? (
            <div className="flex justify-center py-10">
              <Loader2 className="animate-spin text-indigo-600" />
            </div>
          ) : documents.length === 0 ? (
            <p className="text-center text-slate-500">
              No documents available.
            </p>
          ) : (
            <div className="space-y-4">
              {documents.map((doc) => (
                <div
                  key={doc._id}
                  className="bg-white p-4 rounded-2xl border-2 border-slate-100 flex items-center justify-between hover:border-indigo-300 transition-all shadow-sm"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-indigo-100 text-indigo-600 rounded-xl flex items-center justify-center">
                      <FileText />
                    </div>
                    <div>
                      <p className="font-bold text-slate-900">
                        {doc.title || doc.fileName}
                      </p>
                      <p className="text-xs font-bold text-slate-400 uppercase">
                        {doc.fileName.split(".").pop()} File
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => downloadDocument(doc._id, doc.fileName)}
                    className="p-3 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all"
                  >
                    <Download />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Documentation;
