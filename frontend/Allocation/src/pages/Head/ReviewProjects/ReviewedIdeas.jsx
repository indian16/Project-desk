import React, { useEffect, useState } from "react";
import { getReviewedIdeasForHead } from "../../../services/headService";

const ReviewedIdeas = ({ academicYear }) => {
  const [accepted, setAccepted] = useState([]);
  const [rejected, setRejected] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchIdeas = async () => {
      try {
        const data = await getReviewedIdeasForHead(academicYear);
        const approvedIdeas = data.filter(
          (idea) => idea.status === "approved_by_head",
        );
        const rejectedIdeas = data.filter(
          (idea) => idea.status === "rejected_by_head",
        );

        setAccepted(approvedIdeas);
        setRejected(rejectedIdeas);
      } catch (err) {
        console.error("Error fetching reviewed ideas:", err);
      } finally {
        setLoading(false);
      }
    };

    if (academicYear) fetchIdeas();
  }, [academicYear]);

  const renderIdeaCard = (idea, type) => (
    <div
      key={idea._id}
      className="group relative bg-white border border-slate-100 p-5 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 animate-in fade-in slide-in-from-bottom-3"
    >
      {/* Decorative Side Bar */}
      <div
        className={`absolute left-0 top-6 bottom-6 w-1 rounded-r-full transition-all duration-300 group-hover:w-1.5 ${
          type === "accepted" ? "bg-emerald-400" : "bg-rose-400"
        }`}
      />

      <div className="pl-3">
        <div className="flex justify-between items-start mb-2">
          <h4 className="font-bold text-slate-800 text-base group-hover:text-indigo-600 transition-colors">
            {idea.title}
          </h4>
          <span
            className={`text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded ${
              type === "accepted"
                ? "bg-emerald-50 text-emerald-600"
                : "bg-rose-50 text-rose-600"
            }`}
          >
            {type === "accepted" ? "Approved" : "Declined"}
          </span>
        </div>

        <p className="text-sm text-slate-500 leading-relaxed line-clamp-2 group-hover:line-clamp-none transition-all duration-500">
          {idea.description}
        </p>

        {idea.headRemarks && (
          <div className="mt-4 pt-3 border-t border-slate-50">
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-tight mb-1">
              Head Remarks
            </p>
            <p className="text-sm text-slate-600 italic bg-slate-50 p-2 rounded-lg border border-slate-100">
              "{idea.headRemarks}"
            </p>
          </div>
        )}
      </div>
    </div>
  );

  if (loading)
    return (
      <div className="flex flex-col items-center justify-center py-20 text-slate-400">
        <div className="w-8 h-8 border-4 border-slate-100 border-t-indigo-500 rounded-full animate-spin mb-4" />
        <p className="text-xs font-bold uppercase tracking-widest">
          Compiling Archive...
        </p>
      </div>
    );

  return (
    <div className="max-w-7xl mx-auto space-y-10">
      {/* Header Info */}
      <div className="flex items-center gap-4">
        <h2 className="text-xl font-black text-slate-800 tracking-tight">
          Review History
        </h2>
        <div className="h-px bg-slate-100 flex-grow" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* ✅ Accepted Column */}
        <div className="space-y-6">
          <div className="flex items-center justify-between px-2">
            <h3 className="text-sm font-black text-emerald-600 uppercase tracking-[0.2em] flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              Accepted Proposals
            </h3>
            <span className="text-xs font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">
              {accepted.length}
            </span>
          </div>

          <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
            {accepted.length === 0 ? (
              <div className="p-10 text-center border-2 border-dashed border-slate-100 rounded-[2rem] text-slate-300 text-sm italic">
                No approved projects yet.
              </div>
            ) : (
              accepted.map((idea) => renderIdeaCard(idea, "accepted"))
            )}
          </div>
        </div>

        {/* ❌ Rejected Column */}
        <div className="space-y-6">
          <div className="flex items-center justify-between px-2">
            <h3 className="text-sm font-black text-rose-600 uppercase tracking-[0.2em] flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-rose-500" />
              Rejected Proposals
            </h3>
            <span className="text-xs font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">
              {rejected.length}
            </span>
          </div>

          <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
            {rejected.length === 0 ? (
              <div className="p-10 text-center border-2 border-dashed border-slate-100 rounded-[2rem] text-slate-300 text-sm italic">
                No rejected projects yet.
              </div>
            ) : (
              rejected.map((idea) => renderIdeaCard(idea, "rejected"))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReviewedIdeas;
