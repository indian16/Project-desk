//Form3Mentor.jsx
import React, { useEffect, useState } from "react";
import {
  getProjectForm3,
  evaluateForm3Week,
} from "../../services/mentorService";

const Form3Mentor = ({ projectId, onClose }) => {
  const [weeks, setWeeks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedWeek, setExpandedWeek] = useState(null);
  const [savingWeek, setSavingWeek] = useState(null);
  const [savedWeeks, setSavedWeeks] = useState([]); // Tracks evaluated weeks

  // Compute summary
  const evaluatedWeeks = weeks.filter((w) => savedWeeks.includes(w.weekNumber));
  const totalWeeks = evaluatedWeeks.length;
  const totalMarks = evaluatedWeeks.reduce(
    (sum, w) => sum + Number(w.marks || 0),
    0,
  );
  const maxMarks = totalWeeks * 10;
  const average = totalWeeks ? (totalMarks / totalWeeks).toFixed(2) : 0;

  useEffect(() => {
    const fetchForm3 = async () => {
      try {
        const res = await getProjectForm3(projectId);

        if (res.success && res.students?.length > 0) {
          const allWeeks = res.students.flatMap((s) =>
            (s.weeks || []).map((w) => ({
              ...w,
              studentName: s.name,
              studentId: s.studentId,
            })),
          );

          setWeeks(allWeeks);

          const alreadySaved = allWeeks
            .filter((w) => w.marks !== undefined && w.marks !== null)
            .map((w) => w.weekNumber);

          setSavedWeeks(alreadySaved);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchForm3();
  }, [projectId]);

  const handleChange = (index, field, value) => {
    const updated = [...weeks];
    updated[index][field] = value;
    setWeeks(updated);
  };

  const handleEvaluate = async (week, studentId) => {
    try {
      setSavingWeek(week.weekNumber);

      await evaluateForm3Week({
        projectId,
        studentId,
        weekNumber: week.weekNumber,
        marks: week.marks,
        mentorRemark: week.mentorRemark,
      });

      // Lock week after successful save
      setSavedWeeks([...savedWeeks, week.weekNumber]);

      alert(`Week ${week.weekNumber} evaluated successfully!`);
    } catch (err) {
      console.error(err);
      alert("Failed to submit evaluation");
    } finally {
      setSavingWeek(null);
    }
  };

  if (loading) return <p className="p-6">Loading Form 3...</p>;

  return (
    <div className="w-full max-w-6xl mx-auto bg-white rounded-2xl shadow p-6">
      {/* HEADER */}
      <div className="flex justify-between items-center border-b pb-3 mb-6">
        <h2 className="text-xl font-bold text-gray-800">
          Weekly Project Evaluation
        </h2>
        <button
          onClick={onClose}
          className="text-gray-500 hover:text-red-500 text-lg"
        >
          ✕
        </button>
      </div>

      {/* WEEKS */}
      <div className="space-y-4">
        {weeks.map((week, index) => (
          <div
            key={week.weekNumber}
            className="border rounded-xl overflow-hidden"
          >
            {/* WEEK HEADER */}
            <div
              onClick={() =>
                setExpandedWeek(
                  expandedWeek === week.weekNumber ? null : week.weekNumber,
                )
              }
              className="flex justify-between items-center bg-gray-50 px-5 py-4 cursor-pointer"
            >
              <div>
                <h3 className="font-semibold text-indigo-600">
                  Week {week.weekNumber}
                </h3>
                <p className="text-xs text-gray-500">
                  Progress: {week.progress}%
                </p>
              </div>

              <div className="flex items-center gap-4">
                {savedWeeks.includes(week.weekNumber) ? (
                  <span className="text-xs bg-green-100 text-green-700 px-3 py-1 rounded">
                    {week.marks}/10
                  </span>
                ) : (
                  <span className="text-xs bg-yellow-100 text-yellow-700 px-3 py-1 rounded">
                    Pending
                  </span>
                )}
                <span className="text-gray-400 text-sm">
                  {expandedWeek === week.weekNumber ? "▲" : "▼"}
                </span>
              </div>
            </div>

            {/* WEEK DETAILS */}
            {expandedWeek === week.weekNumber && (
              <div className="p-5 space-y-5">
                {/* STUDENT DETAILS */}
                <div className="grid md:grid-cols-2 gap-5 text-sm">
                  <div>
                    <p className="text-xs text-gray-500 font-semibold">
                      Functionality
                    </p>
                    <p className="font-medium">{week.functionality}</p>
                  </div>

                  <div>
                    <p className="text-xs text-gray-500 font-semibold">
                      Progress
                    </p>
                    <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                      <div
                        className="bg-indigo-500 h-2 rounded-full"
                        style={{ width: `${week.progress}%` }}
                      />
                    </div>
                  </div>

                  <div className="md:col-span-2">
                    <p className="text-xs text-gray-500 font-semibold">
                      Task Details
                    </p>
                    <p className="font-medium">{week.taskDetails}</p>
                  </div>
                </div>

                {/* EVALUATION */}
                <div className="border-t pt-4 grid md:grid-cols-3 gap-4">
                  <input
                    type="number"
                    min="1"
                    max="10"
                    placeholder="Marks (1-10)"
                    disabled={
                      savingWeek === week.weekNumber ||
                      savedWeeks.includes(week.weekNumber)
                    }
                    value={week.marks || ""}
                    className="border rounded-lg px-3 py-2 text-sm disabled:bg-gray-100"
                    onChange={(e) => {
                      const value = Number(e.target.value);
                      if (value >= 1 && value <= 10) {
                        handleChange(index, "marks", value);
                      } else if (e.target.value === "") {
                        handleChange(index, "marks", "");
                      }
                    }}
                  />

                  <textarea
                    rows={2}
                    placeholder="Mentor remark"
                    disabled={
                      savingWeek === week.weekNumber ||
                      savedWeeks.includes(week.weekNumber)
                    }
                    value={week.mentorRemark || ""}
                    className="border rounded-lg px-3 py-2 text-sm resize-none disabled:bg-gray-100"
                    onChange={(e) =>
                      handleChange(index, "mentorRemark", e.target.value)
                    }
                  />

                  <button
                    onClick={() => handleEvaluate(week, week.studentId)}
                    disabled={
                      savingWeek === week.weekNumber ||
                      savedWeeks.includes(week.weekNumber)
                    }
                    className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-indigo-700 disabled:bg-gray-400"
                  >
                    {savingWeek === week.weekNumber
                      ? "Saving..."
                      : "Submit Evaluation"}
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* SUMMARY */}
      <div className="mt-8 border-t pt-6">
        <div className="bg-indigo-50 rounded-xl p-6 flex flex-wrap justify-between text-center gap-6">
          <div>
            <p className="text-xs text-gray-500">Total Weeks</p>
            <p className="text-2xl font-bold text-indigo-700">{totalWeeks}</p>
          </div>

          <div>
            <p className="text-xs text-gray-500">Total Marks</p>
            <p className="text-2xl font-bold text-indigo-700">
              {totalMarks} / {maxMarks}
            </p>
          </div>

          <div>
            <p className="text-xs text-gray-500">Average</p>
            <p
              className={`text-2xl font-bold ${
                average >= 8
                  ? "text-green-600"
                  : average >= 6
                    ? "text-yellow-600"
                    : "text-red-600"
              }`}
            >
              {average}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Form3Mentor;
