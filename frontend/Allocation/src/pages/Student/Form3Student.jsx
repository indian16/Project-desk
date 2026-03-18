import React, { useEffect, useState } from "react";
import { getForm3, submitForm3Week } from "../../services/studentService";

const Form3Student = () => {
  const [form3, setForm3] = useState(null);
  const [weeks, setWeeks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [projectId, setProjectId] = useState(null);
  const [expandedWeek, setExpandedWeek] = useState(null);
  const [toast, setToast] = useState({
    show: false,
    message: "",
    type: "success",
  });

  const totalWeeks = weeks.length;
  const submittedWeeks = weeks.filter(
    (w) => w.submitted || w.evaluatedByMentor,
  ).length;
  const progressPercentage =
    totalWeeks > 0 ? Math.round((submittedWeeks / totalWeeks) * 100) : 0;

  useEffect(() => {
    const fetchForm3 = async () => {
      try {
        const res = await getForm3();
        if (!res?.form3?.weeks) {
          setError("Form-3 not configured yet");
          return;
        }
        setForm3(res.form3);
        setWeeks(res.form3.weeks);
        setProjectId(res.projectId);
      } catch (err) {
        console.error("FETCH ERROR:", err);
        setError("Failed to load Form-3");
      } finally {
        setLoading(false);
      }
    };
    fetchForm3();
  }, []);

  const handleChange = (index, field, value) => {
    const updatedWeeks = [...weeks];
    if (field === "progress") {
      let num = Number(value);
      if (num > 100) num = 100;
      if (num < 1) num = 1;
      updatedWeeks[index][field] = num;
    } else {
      updatedWeeks[index][field] = value;
    }
    setWeeks(updatedWeeks);
  };

  const toggleWeek = (weekNumber) => {
    setExpandedWeek(expandedWeek === weekNumber ? null : weekNumber);
  };

  const showToast = (message, type = "success") => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: "", type }), 3000);
  };

  const handleSubmitWeek = async (week, index) => {
    if (week.submitted || week.evaluatedByMentor) return;
    if (!projectId) {
      showToast("Project not found", "error");
      return;
    }
    try {
      if (week.progress < 1 || week.progress > 100) {
        showToast("Progress must be between 1% and 100%", "error");
        return;
      }
      await submitForm3Week({
        projectId,
        weekNumber: week.weekNumber,
        functionality: week.functionality,
        progress: week.progress,
        taskDetails: week.taskDetails,
      });

      // ✅ Update local state immediately
      const updatedWeeks = [...weeks];
      updatedWeeks[index] = { ...updatedWeeks[index], submitted: true };
      setWeeks(updatedWeeks);

      showToast(`Week ${week.weekNumber} submitted successfully`, "success");
    } catch (err) {
      console.error("SUBMIT ERROR:", err);
      showToast(
        err.response?.data?.message || "Failed to submit week",
        "error",
      );
    }
  };

  if (loading)
    return <p className="text-center mt-10 text-gray-700">Loading Form-3...</p>;
  if (error) return <p className="text-center text-red-600 mt-10">{error}</p>;
  if (!form3)
    return (
      <p className="text-center mt-10 text-gray-700">Form-3 not available</p>
    );

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 md:p-10 bg-gradient-to-br from-indigo-50 to-white rounded-3xl shadow-lg border-t-4 border-indigo-600 relative">
      {/* Toast Notification */}
      {toast.show && (
        <div
          className={`fixed top-5 left-1/2 transform -translate-x-1/2 z-50 px-6 py-3 rounded-xl shadow-lg text-white font-semibold text-center max-w-sm w-full transition duration-300 ${
            toast.type === "success" ? "bg-green-500" : "bg-red-500"
          }`}
        >
          {toast.message}
        </div>
      )}

      {/* Header */}
      <div className="mb-6 sm:mb-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center text-sm font-medium text-gray-600 mb-2">
          <span>Project Weekly Progress</span>
          <span className="mt-1 sm:mt-0">{progressPercentage}%</span>
        </div>

        <div className="w-full bg-gray-200 rounded-full h-3">
          <div
            className="bg-indigo-600 h-3 rounded-full transition-all duration-500"
            style={{ width: `${progressPercentage}%` }}
          ></div>
        </div>

        <p className="text-sm text-gray-500 mt-1">
          {submittedWeeks} / {totalWeeks} weeks completed
        </p>
      </div>

      {/* Weeks */}
      {weeks.length === 0 ? (
        <div className="text-center py-10 text-gray-500 text-base sm:text-lg">
          No weeks configured by Head yet.
        </div>
      ) : (
        <div className="space-y-6 sm:space-y-8">
          {weeks.map((week, index) => (
            <div
              key={week.weekNumber}
              className="bg-white rounded-2xl shadow-md hover:shadow-xl border border-gray-100 transition duration-300"
            >
              {/* Week Header */}
              <div
                onClick={() => toggleWeek(week.weekNumber)}
                className="flex justify-between items-center p-4 sm:p-6 cursor-pointer"
              >
                <div>
                  <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-indigo-700">
                    Week {week.weekNumber}
                  </h3>
                  {week.fromDate && week.toDate && (
                    <p className="text-xs sm:text-sm text-gray-500 mt-1">
                      {new Date(week.fromDate).toLocaleDateString("en-GB")} —{" "}
                      {new Date(week.toDate).toLocaleDateString("en-GB")}
                    </p>
                  )}
                </div>
                <span className="text-indigo-600 font-bold text-lg sm:text-xl">
                  {expandedWeek === week.weekNumber ? "▲" : "▼"}
                </span>
              </div>

              {/* Expandable Content */}
              {expandedWeek === week.weekNumber && (
                <div className="px-4 sm:px-6 pb-6 space-y-4">
                  <textarea
                    placeholder="Describe the functionality implemented this week..."
                    className="w-full border border-gray-200 p-3 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-indigo-300"
                    value={week.functionality || ""}
                    onChange={(e) =>
                      handleChange(index, "functionality", e.target.value)
                    }
                    rows={3}
                  />

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Progress Achieved (%) [Functionality + Task Completion]
                    </label>
                    <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4">
                      {/* Slider */}
                      <input
                        type="range"
                        min="1"
                        max="100"
                        value={week.progress || 0}
                        onChange={(e) =>
                          handleChange(index, "progress", e.target.value)
                        }
                        className="w-full sm:flex-1 accent-indigo-600"
                      />
                      {/* Percentage Input */}
                      <input
                        type="number"
                        min="1"
                        max="100"
                        value={week.progress || ""}
                        onChange={(e) =>
                          handleChange(index, "progress", e.target.value)
                        }
                        className="w-20 sm:w-24 border border-gray-300 rounded-lg p-2 text-center"
                      />
                      <span className="text-gray-600 font-medium">%</span>
                    </div>
                  </div>

                  <textarea
                    placeholder="Provide detailed task information..."
                    className="w-full border border-gray-200 p-3 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-indigo-300"
                    value={week.taskDetails || ""}
                    onChange={(e) =>
                      handleChange(index, "taskDetails", e.target.value)
                    }
                    rows={4}
                  />

                  <div className="flex justify-end">
                    <button
                      onClick={() => handleSubmitWeek(week, index)}
                      className={`px-4 py-2 rounded transition-colors duration-300 ${
                        week.submitted || week.evaluatedByMentor
                          ? "bg-gray-400 text-gray-700 cursor-not-allowed"
                          : "bg-indigo-600 text-white hover:bg-indigo-700"
                      }`}
                      disabled={week.submitted || week.evaluatedByMentor}
                    >
                      {week.submitted
                        ? "Submitted"
                        : week.evaluatedByMentor
                          ? "Evaluated"
                          : "Submit Week"}
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Form3Student;
