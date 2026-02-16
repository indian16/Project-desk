import React, { useEffect, useState } from "react";
import { getForm3, submitForm3Week } from "../../services/studentService";

const Form3Student = () => {
  const [form3, setForm3] = useState(null);
  const [weeks, setWeeks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [savingWeek, setSavingWeek] = useState(null);

  useEffect(() => {
    const fetchForm3 = async () => {
      try {
        const res = await getForm3();

        // Handle different possible backend response structures
        const form3Data = res?.form3 || res?.data?.form3 || res?.data || res;

        if (!form3Data || !form3Data.weeks) {
          setError("Form-3 not configured yet");
          return;
        }

        setForm3(form3Data);
        setWeeks(form3Data.weeks || []);

        // Save projectId if available
        if (form3Data.projectId) {
          localStorage.setItem("projectId", form3Data.projectId);
        }
      } catch (err) {
        console.error("FORM3 ERROR:", err);
        setError("Failed to load Form-3");
      } finally {
        setLoading(false);
      }
    };

    fetchForm3();
  }, []);

  const handleChange = (index, field, value) => {
    const updatedWeeks = [...weeks];
    updatedWeeks[index][field] = value;
    setWeeks(updatedWeeks);
  };

  const handleSubmitWeek = async (week) => {
    try {
      const projectId = localStorage.getItem("projectId"); // ✅ Always get latest

      if (!projectId) {
        alert("Project not assigned yet");
        return;
      }

      setSavingWeek(week.weekNumber);

      await submitForm3Week(
        projectId,
        week.weekNumber,
        week.functionality,
        week.progress,
        week.taskDetails,
      );

      alert(`Week ${week.weekNumber} saved successfully`);
    } catch (err) {
      console.error("SUBMIT ERROR:", err);
      alert("Failed to save week");
    } finally {
      setSavingWeek(null);
    }
  };

  if (loading) return <p className="text-center mt-10">Loading Form-3...</p>;

  if (error) return <p className="text-center text-red-600 mt-10">{error}</p>;

  if (!form3) return <p className="text-center mt-10">Form-3 not available</p>;

  return (
    <div className="max-w-6xl mx-auto bg-gradient-to-br from-indigo-50 to-white p-10 rounded-3xl shadow-2xl mt-10 border-t-4 border-indigo-600">
      {/* Header */}
      <div className="mb-10">
        <h2 className="text-3xl font-extrabold text-indigo-700 mb-2">
          Weekly Progress Report
        </h2>
        <p className="text-gray-500">
          Submit your weekly implementation details and track your progress.
        </p>
      </div>

      {weeks.length === 0 ? (
        <div className="text-center py-10 text-gray-500">
          No weeks configured by Head yet.
        </div>
      ) : (
        <div className="space-y-8">
          {weeks.map((week, index) => (
            <div
              key={week.weekNumber}
              className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition duration-300"
            >
              {/* Week Header */}
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h3 className="text-xl font-bold text-indigo-700">
                    Week {week.weekNumber}
                  </h3>

                  {week.fromDate && week.toDate && (
                    <p className="text-sm text-gray-500 mt-1">
                      {new Date(week.fromDate).toLocaleDateString("en-GB")} —{" "}
                      {new Date(week.toDate).toLocaleDateString("en-GB")}
                    </p>
                  )}
                </div>

                <span className="bg-indigo-100 text-indigo-700 text-xs font-semibold px-3 py-1 rounded-full">
                  Academic Progress
                </span>
              </div>

              {/* Inputs */}
              <div className="space-y-4">
                <textarea
                  placeholder="Describe the functionality implemented this week..."
                  className="w-full border border-gray-200 p-3 rounded-xl focus:ring-4 focus:ring-indigo-200 focus:border-indigo-500 outline-none transition"
                  value={week.functionality || ""}
                  onChange={(e) =>
                    handleChange(index, "functionality", e.target.value)
                  }
                />

                <textarea
                  placeholder="Explain the progress achieved..."
                  className="w-full border border-gray-200 p-3 rounded-xl focus:ring-4 focus:ring-indigo-200 focus:border-indigo-500 outline-none transition"
                  value={week.progress || ""}
                  onChange={(e) =>
                    handleChange(index, "progress", e.target.value)
                  }
                />

                <textarea
                  placeholder="Provide detailed task information..."
                  className="w-full border border-gray-200 p-3 rounded-xl focus:ring-4 focus:ring-indigo-200 focus:border-indigo-500 outline-none transition"
                  value={week.taskDetails || ""}
                  onChange={(e) =>
                    handleChange(index, "taskDetails", e.target.value)
                  }
                />
              </div>

              {/* Button */}
              <div className="mt-6 flex justify-end">
                <button
                  onClick={() => handleSubmitWeek(week)}
                  disabled={savingWeek === week.weekNumber}
                  className={`px-6 py-2 rounded-full font-semibold text-white transition duration-300 ${
                    savingWeek === week.weekNumber
                      ? "bg-gray-400"
                      : "bg-gradient-to-r from-indigo-600 to-blue-500 hover:scale-105"
                  }`}
                >
                  {savingWeek === week.weekNumber ? "Saving..." : "Save Week"}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Form3Student;
