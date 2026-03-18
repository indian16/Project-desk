import React from "react";
import { Check, ArrowRight, Activity } from "lucide-react"; // Assuming lucide-react is installed

const StudentPipeline = ({ project, checklist, form1, form2, form3 }) => {
  if (!project) return null;

  const safeChecklist = Array.isArray(checklist) ? checklist : [];
  const safeForm3 = Array.isArray(form3?.weeks) ? form3.weeks : [];

  const form3SubmittedWeeks = safeForm3.filter((w) => w.submitted).length;
  const form3Percentage =
    safeForm3.length > 0
      ? Math.round((form3SubmittedWeeks / safeForm3.length) * 100)
      : 0;

  
  const steps = [
    {label: "Project Submitted", completed: true},
    { label: "Mentor", completed: !!project.confirmedMentor || !!project.approvedMentor },
    { label: "Form 1", completed: form1?.status === "approved_by_mentor" },
    { label: "Form 2", completed: form2?.members?.every((m) => m.approvedByMentor) && form2?.members?.length > 0 },
    { label: "Form 3", completed: safeForm3.some((w) => w.submitted) },
    { label: "Checklist", completed: safeChecklist.length > 0 && safeChecklist.every((i) => i?.status === "submitted") },
  ];

  const completedCount = steps.filter((s) => s.completed).length;
  const percentage = Math.round(((completedCount - 1) / (steps.length - 1)) * 100);
  const nextStep = steps.find((s) => !s.completed);

  return (
    <div className="bg-white border border-slate-200 rounded-3xl p-5 md:p-8 shadow-sm mb-8 transition-all">
      {/* Header Area */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 md:mb-12">
        <div>
          <h3 className="text-xl font-bold text-slate-900 tracking-tight">Project Milestone</h3>
          <p className="text-sm text-slate-500 font-medium">Step {completedCount} of {steps.length} completed</p>
        </div>
        <div className="hidden sm:block text-right">
          <span className="text-3xl font-black text-indigo-600 leading-none">{Math.round((completedCount/steps.length)*100)}%</span>
          <p className="text-[10px] uppercase tracking-widest font-bold text-slate-400">Total Progress</p>
        </div>
      </div>

      {/* --- DESKTOP VIEW (Horizontal) --- */}
      <div className="hidden md:block relative mb-16 px-4">
        <div className="absolute top-5 left-8 right-8 h-1 bg-slate-100 rounded-full z-0"></div>
        <div 
          className="absolute top-5 left-8 h-1 bg-indigo-500 rounded-full transition-all duration-1000 ease-out z-0"
          style={{ width: `calc(${percentage}% - 10px)` }}
        ></div>

        <div className="flex justify-between">
          {steps.map((step, index) => {
            const isCompleted = step.completed;
            const isCurrent = nextStep?.label === step.label;
            return (
              <div key={index} className="flex flex-col items-center relative z-10">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center border-4 transition-all duration-500 ${
                  isCompleted ? "bg-indigo-600 border-indigo-100 text-white shadow-lg" : 
                  isCurrent ? "bg-white border-indigo-500 text-indigo-600 scale-110 shadow-xl" : "bg-white border-slate-100 text-slate-300"
                }`}>
                  {isCompleted ? <Check size={16} strokeWidth={3} /> : <span className="text-xs font-bold">{index + 1}</span>}
                </div>
                <span className={`mt-4 text-[11px] font-bold uppercase tracking-wider text-center max-w-[80px] ${isCompleted ? "text-slate-900" : isCurrent ? "text-indigo-600" : "text-slate-400"}`}>
                  {step.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* --- MOBILE VIEW (Vertical) --- */}
      <div className="md:hidden flex flex-col gap-4 mb-8">
        {steps.map((step, index) => {
          const isCompleted = step.completed;
          const isCurrent = nextStep?.label === step.label;
          return (
            <div key={index} className="flex items-center gap-4 group">
              <div className="flex flex-col items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 transition-all ${
                  isCompleted ? "bg-indigo-600 text-white" : isCurrent ? "bg-white border-2 border-indigo-500 text-indigo-600" : "bg-slate-100 text-slate-400"
                }`}>
                  {isCompleted ? <Check size={14} /> : index + 1}
                </div>
                {index !== steps.length - 1 && (
                  <div className={`w-0.5 h-6 my-1 ${isCompleted ? "bg-indigo-600" : "bg-slate-100"}`}></div>
                )}
              </div>
              <div className="flex-1 pb-4">
                <p className={`text-sm font-bold tracking-tight ${isCompleted ? "text-slate-900" : isCurrent ? "text-indigo-600" : "text-slate-400"}`}>
                  {step.label}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-slate-50">
        {nextStep && (
          <div className="bg-slate-50 border border-slate-100 p-4 rounded-2xl flex items-center gap-3">
            <div className="bg-indigo-100 p-2 rounded-lg">
              <ArrowRight size={18} className="text-indigo-600" />
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-widest font-bold text-slate-400">Next Task</p>
              <p className="text-sm font-bold text-slate-800">{nextStep.label}</p>
            </div>
          </div>
        )}

        {safeForm3.length > 0 && (
          <div className="bg-slate-50 border border-slate-100 p-4 rounded-2xl">
             <div className="flex justify-between items-center mb-2">
                <div className="flex items-center gap-2">
                   <Activity size={16} className="text-indigo-500" />
                   <p className="text-[10px] uppercase tracking-widest font-bold text-slate-400">Weekly Progress</p>
                </div>
                <span className="text-[10px] font-black text-slate-600">{form3Percentage}%</span>
             </div>
             <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                <div className="h-full bg-indigo-500 rounded-full" style={{ width: `${form3Percentage}%` }}></div>
             </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentPipeline;