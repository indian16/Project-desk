import React, { useEffect, useState } from "react";
import { getScheduledInterviews, reviewInterview } from "../../../services/headService";

const InterviewStatus = ({ academicYear }) => {
  const [ideas, setIdeas] = useState([]);
  const [expanded, setExpanded] = useState({});
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [currentIdeaId, setCurrentIdeaId] = useState(null);

  useEffect(() => {
    if (academicYear) fetchInterviews();
  }, [academicYear]);

  const fetchInterviews = async () => {
    setLoading(true);
    try {
      const data = await getScheduledInterviews(academicYear);
      setIdeas(data);
    } catch (err) {
      console.error("Error fetching interviews:", err);
    } finally {
      setTimeout(() => setLoading(false), 300);
    }
  };

  const handlePass = async (id) => {
    try {
      await reviewInterview(id, "pass");
      fetchInterviews();
    } catch (err) {
      console.error("Error marking as passed:", err);
    }
  };

  const handleFailClick = (id) => {
    setCurrentIdeaId(id);
    setShowModal(true);
  };

  const handleFailConfirm = async () => {
    try {
      await reviewInterview(currentIdeaId, "fail");
      setShowModal(false);
      setCurrentIdeaId(null);
      fetchInterviews();
    } catch (err) {
      console.error("Error marking as failed:", err);
    }
  };

  const toggleExpand = (id) => {
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const scheduled = ideas.filter((i) => i.status === "interview_scheduled");
  const passed = ideas.filter((i) => i.status === "interview_passed");
  const failed = ideas.filter((i) => i.status === "interview_failed");

  const renderIdeaCard = (idea, variant = "default", index = 0) => {
    const isExpanded = expanded[idea._id];
    
    // Improved contrast styles
    const cardStyles = {
      default: "border-slate-200 bg-white shadow-[0_2px_8px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_20px_rgba(0,0,0,0.08)]",
      passed: "border-emerald-200 bg-emerald-50/40 shadow-sm",
      failed: "border-rose-200 bg-rose-50/40 shadow-sm",
    }[variant];

    return (
      <div
        key={idea._id}
        className={`group border rounded-2xl mb-4 transition-all duration-300 ${cardStyles} animate-in fade-in slide-in-from-bottom-2`}
        style={{ animationDelay: `${index * 50}ms` }}
      >
        {/* Header Row - Fills Width */}
        <div 
          className="p-5 flex items-center justify-between cursor-pointer"
          onClick={() => toggleExpand(idea._id)}
        >
          <div className="flex items-center gap-6">
            <div className={`w-3 h-3 rounded-full shadow-inner ${variant === 'passed' ? 'bg-emerald-500' : variant === 'failed' ? 'bg-rose-500' : 'bg-indigo-600'}`} />
            <div>
              <h3 className="text-lg font-bold text-slate-800 tracking-tight group-hover:text-indigo-600 transition-colors">
                {idea.title}
              </h3>
              <div className="flex items-center gap-4 mt-1">
                <span className="flex items-center gap-1.5 text-xs font-bold text-slate-500">
                  <span className="text-slate-400 font-normal">Team Lead:</span> {idea.teamLead?.name}
                </span>
                <div className="w-1 h-1 bg-slate-300 rounded-full" />
                <span className="px-2 py-0.5 bg-slate-100 text-slate-600 rounded text-[10px] font-black uppercase tracking-wider">
                  {idea.technology}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-6">
            {variant === "default" && (
              <div className="flex gap-3" onClick={(e) => e.stopPropagation()}>
                <button
                  onClick={() => handlePass(idea._id)}
                  className="px-5 py-2 bg-indigo-600 text-white rounded-xl text-xs font-black hover:bg-indigo-700 shadow-md shadow-indigo-200 transition-all active:scale-95"
                >
                  Pass
                </button>
                <button
                  onClick={() => handleFailClick(idea._id)}
                  className="px-5 py-2 bg-white text-rose-600 border-2 border-rose-100 rounded-xl text-xs font-black hover:bg-rose-50 hover:border-rose-200 transition-all active:scale-95"
                >
                  Fail
                </button>
              </div>
            )}
            <div className={`p-2 rounded-full transition-colors ${isExpanded ? 'bg-indigo-50 text-indigo-600' : 'text-slate-300'}`}>
              <svg className={`w-5 h-5 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>

        {/* Info Section - Now Multi-Column to fill space */}
        {isExpanded && (
          <div className="px-8 pb-8 pt-4 border-t border-slate-100 bg-slate-50/50">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
              
              {/* Column 1: Description (Takes 2/3 space) */}
              <div className="lg:col-span-2 space-y-3">
                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Project Overview</h4>
                <p className="text-sm text-slate-600 leading-relaxed font-medium bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
                  {idea.description}
                </p>
              </div>

              {/* Column 2: Team Roster (Compact but clear) */}
              <div className="space-y-4">
                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Validated Team</h4>
                <div className="space-y-2">
                  {idea.teamMembers?.map(m => (
                    <div key={m._id} className="flex justify-between items-center p-3 bg-white rounded-xl border border-slate-200 shadow-sm">
                      <div className="flex flex-col">
                        <span className="text-sm font-bold text-slate-700">{m.name}</span>
                        <span className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">ID: {m.rollno}</span>
                      </div>
                      <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-[10px] text-slate-400 italic">M</div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="w-full bg-slate-50/30 min-h-full px-2 py-4">
      {loading ? (
        <div className="flex flex-col items-center justify-center py-40">
          <div className="w-10 h-10 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin mb-4" />
          <span className="text-xs font-black text-slate-400 uppercase tracking-widest">Organizing Boards...</span>
        </div>
      ) : (
        <div className="space-y-16">
          
          {/* Active Queue Section */}
          <section>
            <div className="flex items-center gap-4 mb-8">
              <div className="h-8 w-1.5 bg-indigo-600 rounded-full" />
              <h2 className="text-xl font-black text-slate-800 tracking-tight">Active Interview Queue</h2>
              <span className="px-3 py-1 bg-indigo-600 text-white text-[10px] font-black rounded-lg shadow-lg shadow-indigo-100 uppercase">
                {scheduled.length} Projects
              </span>
            </div>
            
            <div className="grid grid-cols-1 gap-1">
              {scheduled.length === 0 ? (
                <div className="p-20 text-center border-2 border-dashed border-slate-200 rounded-[2rem] bg-white">
                  <div className="text-4xl mb-4 opacity-20">📂</div>
                  <p className="text-slate-400 text-sm font-bold uppercase tracking-widest">No projects currently waiting</p>
                </div>
              ) : (
                scheduled.map((idea, i) => renderIdeaCard(idea, "default", i))
              )}
            </div>
          </section>

          {/* Historic Results Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <section>
              <div className="flex items-center gap-3 mb-6">
                <span className="p-1.5 bg-emerald-100 text-emerald-600 rounded-lg">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"/></svg>
                </span>
                <h2 className="text-md font-black text-slate-700 uppercase tracking-widest">Passed Records</h2>
              </div>
              <div className="space-y-2">
                {passed.map((idea, i) => renderIdeaCard(idea, "passed", i))}
              </div>
            </section>

            <section>
              <div className="flex items-center gap-3 mb-6">
                <span className="p-1.5 bg-rose-100 text-rose-600 rounded-lg">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"/></svg>
                </span>
                <h2 className="text-md font-black text-slate-700 uppercase tracking-widest">Failed Records</h2>
              </div>
              <div className="space-y-2">
                {failed.map((idea, i) => renderIdeaCard(idea, "failed", i))}
              </div>
            </section>
          </div>
        </div>
      )}

      {/* Modern Fail Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md flex items-center justify-center z-[100] p-4">
          <div className="bg-white rounded-[2.5rem] p-10 w-full max-w-md shadow-2xl border border-white/20 animate-in zoom-in-95 duration-200">
            <div className="w-16 h-16 bg-rose-50 text-rose-500 rounded-2xl flex items-center justify-center mb-6">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>
            </div>
            <h3 className="text-2xl font-black text-slate-800 mb-2">Reject Interview?</h3>
            <p className="text-sm text-slate-500 font-medium mb-8 leading-relaxed">This action will disqualify the project. You are marking the technical interview for this team as failed.</p>
            <div className="flex gap-4">
              <button onClick={() => setShowModal(false)} className="flex-1 py-3 text-sm font-bold text-slate-400 hover:text-slate-600 transition-colors">Go Back</button>
              <button onClick={handleFailConfirm} className="flex-1 py-3 bg-rose-500 text-white rounded-2xl text-sm font-black hover:bg-rose-600 shadow-xl shadow-rose-200 transition-all">Confirm Failure</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InterviewStatus;