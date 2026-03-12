import React from "react";
import { Calendar, Zap } from "lucide-react";
import HeadMessage from "./HeadMessage";

const InterviewSection = ({
  interviews,
  showInterview,
  setShowInterview,
  newIdeasCount,
}) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
      {/* ================= LEFT PANEL ================= */}

      <div className="lg:col-span-2 bg-white border border-slate-200 rounded-2xl p-6 shadow-sm h-[450px] flex flex-col">
        {/* Header */}

        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
              <Calendar size={18} />
            </div>

            <h2 className="text-sm font-bold text-slate-800">
              {showInterview ? "Scheduled Interview" : "Messages"}
            </h2>
          </div>

          <button
            onClick={() => setShowInterview(!showInterview)}
            className="text-[11px] font-bold px-4 py-1.5 rounded-lg border border-slate-200
                       text-slate-600 hover:bg-slate-100 hover:text-slate-800 transition"
          >
            {showInterview ? "View Messages" : "View Interview"}
          </button>
        </div>

        {/* Content */}

        <div className="flex-1 overflow-y-auto space-y-4 pr-2">
          {showInterview ? (
            interviews.length === 0 ? (
              <EmptyState text="No Interviews Scheduled" />
            ) : (
              interviews.map((item) => (
                <InterviewCard key={item._id} interview={item} />
              ))
            )
          ) : (
            <HeadMessage />
          )}
        </div>
      </div>

      {/* ================= RIGHT PANEL ================= */}

      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm max-h-[450px] flex flex-col">
        {/* Header */}

        <div className="flex items-center gap-3 mb-4">
          <div className="p-2.5 bg-slate-900 text-white rounded-xl">
            <Zap size={18} />
          </div>

          <h3 className="text-sm font-black text-slate-900">
            Immediate Actions Required
          </h3>
        </div>

        {/* Body */}

        <div className="flex-1 overflow-y-auto">
          {newIdeasCount === 0 ? (
            <EmptyState text="No Immediate Actions" />
          ) : (
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 shadow-sm">
              <p className="text-xs font-semibold text-slate-700">
                {newIdeasCount} new project idea pending review
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

/* ================= REUSABLE EMPTY STATE ================= */

const EmptyState = ({ text }) => (
  <div className="flex items-center justify-center h-full bg-slate-50 border border-dashed border-slate-200 rounded-xl">
    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
      {text}
    </p>
  </div>
);

/* Interview Card Component */
const InterviewCard = ({ interview }) => {
  return (
    <div className="border border-slate-200 rounded-xl p-4 bg-slate-50">
      <p className="text-sm font-semibold text-slate-800">
        {interview.projectTitle}
      </p>
    </div>
  );
};

export default InterviewSection;
