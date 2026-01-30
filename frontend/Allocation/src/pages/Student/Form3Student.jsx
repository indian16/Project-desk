import React, { useEffect, useState } from "react";
import {
  getForm3,
  submitForm3Week,
} from "../../services/studentService";

const Form3Student = () => {
  const [form3, setForm3] = useState(null);
  const [loading, setLoading] = useState(true);
  const [savingWeek, setSavingWeek] = useState(null);

  // 🔹 Fetch merged Form3 (global dates + student progress)
  useEffect(() => {
    const fetchForm3 = async () => {
      try {
        const data = await getForm3();
        setForm3(data);
      } catch (err) {
        console.error("Error fetching Form3:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchForm3();
  }, []);

  // 🔹 Local state update only (not DB)
  const handleChange = (weekIndex, field, value) => {
    setForm3((prev) => {
      const updated = { ...prev };
      updated.weeks = [...updated.weeks];
      updated.weeks[weekIndex] = {
        ...updated.weeks[weekIndex],
        [field]: value,
      };
      return updated;
    });
  };

  // 🔹 Save ONE week → StudentForm3
  const handleSaveWeek = async (weekIndex) => {
    setSavingWeek(weekIndex);
    try {
      const week = form3.weeks[weekIndex];

      await submitForm3Week(
        form3.projectId,
        week.weekNumber,
        week.functionality,
        week.progress,
        week.taskDetails
      );

      alert(`Week ${week.weekNumber} saved successfully!`);
    } catch (err) {
      console.error("Error saving week:", err);
      alert("Failed to save. Try again!");
    } finally {
      setSavingWeek(null);
    }
  };

  // ---------------- UI STATES ----------------
  if (loading)
    return <p className="text-gray-500">Loading Form3...</p>;

  if (!form3)
    return <p className="text-red-500">Form3 not published yet.</p>;

  // ---------------- UI ----------------
  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">
        Form-3 : Weekly Progress Report
      </h2>

      {form3.weeks.map((week, index) => (
        <div
          key={week.weekNumber}
          className="bg-white shadow-md rounded-lg p-6 border border-gray-200 hover:shadow-lg transition"
        >
          <h4 className="text-lg font-semibold text-gray-700 mb-4">
            Week {week.weekNumber} (
            {new Date(week.fromDate).toLocaleDateString()} -{" "}
            {new Date(week.toDate).toLocaleDateString()})
          </h4>

          {/* -------- INPUTS -------- */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-gray-600 font-medium mb-1">
                Functionality
              </label>
              <input
                type="text"
                value={week.functionality || ""}
                onChange={(e) =>
                  handleChange(index, "functionality", e.target.value)
                }
                className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-blue-400"
              />
            </div>

            <div>
              <label className="block text-gray-600 font-medium mb-1">
                Progress (%)
              </label>
              <input
                type="number"
                min={0}
                max={100}
                value={week.progress ?? ""}
                onChange={(e) =>
                  handleChange(index, "progress", e.target.value)
                }
                className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-blue-400"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-gray-600 font-medium mb-1">
                Task Details
              </label>
              <textarea
                rows={3}
                value={week.taskDetails || ""}
                onChange={(e) =>
                  handleChange(index, "taskDetails", e.target.value)
                }
                className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-blue-400"
              />
            </div>
          </div>

          {/* -------- Mentor Marks -------- */}
          <p className="mb-4">
            <span className="font-medium">Mentor Marks:</span>{" "}
            {week.mentorMarks != null ? (
              <span className="text-green-600 font-semibold">
                {week.mentorMarks}
              </span>
            ) : (
              <span className="text-yellow-600 font-semibold">Pending</span>
            )}
          </p>

          {/* -------- SAVE BUTTON -------- */}
          <button
            onClick={() => handleSaveWeek(index)}
            disabled={savingWeek === index}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded transition disabled:opacity-50"
          >
            {savingWeek === index ? "Saving..." : "Save Week"}
          </button>
        </div>
      ))}
    </div>
  );
};

export default Form3Student;
