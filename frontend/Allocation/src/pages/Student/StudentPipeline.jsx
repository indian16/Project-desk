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
      completed:
        project.status === "interview_passed" ||
        project.status === "approved_by_mentor",
    },
    {
      label: "Mentor Assigned",
      completed:
        !!project.confirmedMentor ||
        !!project.selectedMentor1 ||
        !!project.selectedMentor2 ||
        !!project.selectedMentor3,
    },
    {
      label: "Checklist Completed",
      completed:
        safeChecklist.length > 0 &&
        safeChecklist.every((item) => item?.status === "submitted"),
    },
    // {
    //   label: "Final Approval",
    //   completed: project.status === "approved_by_mentor",
    // },
  ];

  const completedSteps = steps.filter((s) => s.completed).length;
  const percentage = Math.round((completedSteps / steps.length) * 100);
  const nextStep = steps.find((s) => !s.completed);

  return (
    <div className="bg-white border rounded-xl p-6 shadow-sm mb-6">
      <h3 className="text-lg font-semibold text-slate-800 mb-6">
        Project Progress
      </h3>

      <div className="flex items-center justify-between relative">
        {/* Progress Line */}
        <div className="absolute top-4 left-0 w-full h-1 bg-slate-200"></div>

        <div
          className="absolute top-4 left-0 h-1 bg-blue-600 transition-all duration-500"
          style={{ width: `${percentage}%` }}
        ></div>

        {steps.map((step, index) => (
          <div key={index} className="flex flex-col items-center relative z-10">
            <div
              className={`w-8 h-8 flex items-center justify-center rounded-full text-xs font-bold ${
                step.completed
                  ? "bg-green-500 text-white"
                  : "bg-slate-300 text-slate-600"
              }`}
            >
              {index + 1}
            </div>

            <span
              className={`mt-2 text-xs text-center ${
                step.completed ? "text-slate-800 font-medium" : "text-slate-500"
              }`}
            >
              {step.label}
            </span>
          </div>
        ))}
      </div>

      {nextStep && (
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-3">
          <p className="text-sm text-blue-800">
            <strong>Next Task:</strong> {nextStep.label}
          </p>
        </div>
      )}
    </div>
  );
};

export default StudentPipeline;
