import React, { useEffect, useState } from "react";
import {
  getProjectForm3,
  evaluateForm3Week,
} from "../../services/mentorService";

const Form3Mentor = ({ projectId, onClose }) => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedStudent, setExpandedStudent] = useState(null);
  const [savingWeek, setSavingWeek] = useState(null);

  // Fetch Form3 data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getProjectForm3(projectId);
        if (res.success) {
          setStudents(
            res.students.map((s) => ({
              ...s,
              weeks: s.weeks.map((w) => ({
                ...w,
                marks: w.marks ?? "",
                mentorRemark: w.mentorRemark ?? "",
                locked: w.marks !== undefined && w.marks !== null,
              })),
            })),
          );
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [projectId]);

  const handleEvaluate = async (studentId, week) => {
    if (week.marks === "" || week.marks < 1 || week.marks > 10) return;

    try {
      setSavingWeek(`${studentId}-${week.weekNumber}`);

      await evaluateForm3Week({
        projectId,
        studentId,
        weekNumber: week.weekNumber,
        marks: week.marks,
        mentorRemark: week.mentorRemark,
      });

      setStudents((prev) =>
        prev.map((s) =>
          s.studentId === studentId
            ? {
                ...s,
                weeks: s.weeks.map((w) =>
                  w.weekNumber === week.weekNumber ? { ...w, locked: true } : w,
                ),
              }
            : s,
        ),
      );

      alert(`Week ${week.weekNumber} evaluated successfully!`);
    } catch (err) {
      console.error(err);
      alert(err.message || "Failed to submit evaluation");
    } finally {
      setSavingWeek(null);
    }
  };

  if (loading) return <p className="p-6">Loading Form 3...</p>;
  if (!students.length)
    return (
      <p className="p-6 text-gray-500">
        No students assigned or Form 3 not submitted yet.
      </p>
    );

  return (
    <div className="space-y-4">
      {students.map((student) => (
        <div
          key={student.studentId}
          className="border rounded-xl overflow-hidden shadow-sm"
        >
          {/* STUDENT HEADER */}
          <div
            onClick={() =>
              setExpandedStudent(
                expandedStudent === student.studentId
                  ? null
                  : student.studentId,
              )
            }
            className="flex justify-between items-center bg-gray-50 px-5 py-4 cursor-pointer"
          >
            <h3 className="font-semibold text-indigo-600">{student.name}</h3>
            <span className="text-gray-500">
              {expandedStudent === student.studentId ? "▲" : "▼"}
            </span>
          </div>

          {/* WEEK DETAILS */}
          {expandedStudent === student.studentId && (
            <div className="p-5 space-y-5">
              {/* STUDENT SUMMARY */}
              <div className="mb-4 p-3 bg-gray-100 rounded">
                <p className="font-semibold text-gray-700">
                  Total Weeks: {student.weeks.length}
                </p>
                <p className="font-semibold text-gray-700">
                  Total Marks:{" "}
                  {student.weeks.reduce(
                    (acc, w) =>
                      acc + (typeof w.marks === "number" ? w.marks : 0),
                    0,
                  )}
                </p>
                <p className="font-semibold text-gray-700">
                  Average Marks:{" "}
                  {(
                    student.weeks.reduce(
                      (acc, w) =>
                        acc + (typeof w.marks === "number" ? w.marks : 0),
                      0,
                    ) / student.weeks.length || 0
                  ).toFixed(2)}
                </p>
              </div>

              {/* WEEK DETAILS (keep your existing code here exactly as before) */}
              {student.weeks.map((week) => (
                <div key={week.weekNumber} className="border-t pt-3 space-y-3">
                  {/* WEEK HEADER */}
                  <div className="flex justify-between items-center">
                    <p className="font-medium">
                      Week {week.weekNumber} - {week.progress}% complete
                    </p>
                    {week.locked ? (
                      <span className="text-green-700 text-xs bg-green-100 px-2 py-1 rounded">
                        {week.marks}/10
                      </span>
                    ) : (
                      <span className="text-yellow-700 text-xs bg-yellow-100 px-2 py-1 rounded">
                        Pending
                      </span>
                    )}
                  </div>

                  {/* FUNCTIONALITY */}
                  <div>
                    <p className="text-xs text-gray-500 font-semibold">
                      Functionality
                    </p>
                    <p className="font-medium">{week.functionality}</p>
                  </div>

                  {/* TASK DETAILS */}
                  <div>
                    <p className="text-xs text-gray-500 font-semibold">
                      Task Details
                    </p>
                    <p className="font-medium">{week.taskDetails}</p>
                  </div>

                  {/* PROGRESS BAR */}
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

                  {/* EVALUATION */}
                  <div className="flex flex-wrap gap-2 items-center mt-2">
                    <input
                      type="number"
                      min="1"
                      max="10"
                      placeholder="Marks (1-10)"
                      value={week.marks}
                      disabled={week.locked}
                      onChange={(e) => {
                        let value =
                          e.target.value === "" ? "" : Number(e.target.value);
                        if (value !== "" && (value < 1 || value > 10)) return;
                        setStudents((prev) =>
                          prev.map((s) =>
                            s.studentId === student.studentId
                              ? {
                                  ...s,
                                  weeks: s.weeks.map((w) =>
                                    w.weekNumber === week.weekNumber
                                      ? { ...w, marks: value }
                                      : w,
                                  ),
                                }
                              : s,
                          ),
                        );
                      }}
                      className="border rounded px-2 py-1 w-20"
                    />

                    <input
                      type="text"
                      placeholder="Mentor Remark"
                      value={week.mentorRemark}
                      disabled={week.locked}
                      onChange={(e) => {
                        const value = e.target.value;
                        setStudents((prev) =>
                          prev.map((s) =>
                            s.studentId === student.studentId
                              ? {
                                  ...s,
                                  weeks: s.weeks.map((w) =>
                                    w.weekNumber === week.weekNumber
                                      ? { ...w, mentorRemark: value }
                                      : w,
                                  ),
                                }
                              : s,
                          ),
                        );
                      }}
                      className="border rounded px-2 py-1 flex-1"
                    />

                    <button
                      disabled={
                        week.locked ||
                        savingWeek ===
                          `${student.studentId}-${week.weekNumber}` ||
                        week.marks === "" ||
                        week.marks < 1 ||
                        week.marks > 10
                      }
                      onClick={() => handleEvaluate(student.studentId, week)}
                      className={`px-3 py-1 rounded text-white ${
                        week.locked ||
                        week.marks === "" ||
                        week.marks < 1 ||
                        week.marks > 10
                          ? "bg-gray-400 cursor-not-allowed"
                          : "bg-indigo-600 hover:bg-indigo-700"
                      }`}
                    >
                      {savingWeek === `${student.studentId}-${week.weekNumber}`
                        ? "Saving..."
                        : "Submit"}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default Form3Mentor;
