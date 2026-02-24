// frontend/Allocation/src/pages/Student/StudentPipeline.jsx
import React from "react";

const StudentPipeline = ({ project, checklist }) => {
  if (!project) return null;

  // 🔥 SAFETY FIX
  const safeChecklist = Array.isArray(checklist) ? checklist : [];

  const steps = [
    {
      label: "Project Submitted",
      completed: true,
    },
    {
      label: "Interview Passed",
      completed: project.status?.toLowerCase().includes("interview"),
    },
    {
      label: "Mentor Assigned",
      completed:
        !!project.selectedMentor ||
        !!project.approvedMentor ||
        !!project.mentor,
    },
    {
      label: "Checklist Completed",
      completed:
        safeChecklist.length > 0 &&
        safeChecklist.every((item) => item?.status === "submitted"),
    },
    {
      label: "Final Approval",
      completed: project.status?.toLowerCase().includes("approved"),
    },
  ];

  const completedSteps = steps.filter((s) => s.completed).length;
  const percentage = Math.round((completedSteps / steps.length) * 100);
  const nextStep = steps.find((s) => !s.completed);

  return (
    <div className="bg-white border rounded-xl p-6 shadow-sm mb-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-slate-800">
          Project Progress
        </h3>
        <span className="text-sm font-semibold text-blue-600">
          {percentage}% Complete
        </span>
      </div>

      <div className="w-full bg-slate-200 rounded-full h-2 mb-5">
        <div
          className="bg-blue-600 h-2 rounded-full transition-all duration-300"
          style={{ width: `${percentage}%` }}
        />
      </div>

      <ul className="space-y-3">
        {steps.map((step, index) => (
          <li key={index} className="flex items-center gap-3">
            <span
              className={`w-3 h-3 rounded-full ${
                step.completed ? "bg-green-500" : "bg-slate-300"
              }`}
            />
            <span
              className={`text-sm ${
                step.completed
                  ? "text-slate-800 font-medium"
                  : "text-slate-500"
              }`}
            >
              {step.label}
            </span>
          </li>
        ))}
      </ul>

      {nextStep && (
        <div className="mt-5 bg-blue-50 border border-blue-200 rounded-lg p-3">
          <p className="text-sm text-blue-800">
            <strong>Next Task:</strong> {nextStep.label}
          </p>
        </div>
      )}
    </div>
  );
};

export default StudentPipeline;