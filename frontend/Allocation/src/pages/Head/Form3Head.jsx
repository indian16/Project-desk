import React, { useEffect, useState } from "react";
import { getHeadProjectForm } from "../../services/headService";

const Form3Head = ({ projectId }) => {
  const [weeks, setWeeks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedWeek, setExpandedWeek] = useState(null);

  // Summary calculation
  const evaluatedWeeks = weeks.filter(
    (w) => w.marks !== undefined && w.marks !== null
  );

  const totalWeeks = evaluatedWeeks.length;

  const totalMarks = evaluatedWeeks.reduce(
    (sum, w) => sum + Number(w.marks || 0),
    0
  );

  const maxMarks = totalWeeks * 10;

  const average = totalWeeks ? (totalMarks / totalWeeks).toFixed(2) : 0;

  useEffect(() => {
    const fetchForm3 = async () => {
      try {
        const res = await getHeadProjectForm("form3", projectId);

        if (res.success) {
          setWeeks(res.data.weeks || []);
        }
      } catch (err) {
        console.error("Error loading Form3", err);
      } finally {
        setLoading(false);
      }
    };

    if (projectId) fetchForm3();
  }, [projectId]);

  if (loading) {
    return <p className="p-6 text-gray-500">Loading Form 3...</p>;
  }

  if (!weeks.length) {
    return (
      <p className="p-6 text-gray-500 text-center">
        No weekly evaluations submitted yet.
      </p>
    );
  }

  return (
    <div className="w-full max-w-6xl mx-auto bg-white rounded-2xl shadow p-6">

      {/* HEADER */}
      <div className="border-b pb-3 mb-6">
        <h2 className="text-xl font-bold text-gray-800">
          Weekly Project Evaluation
        </h2>
      </div>

      {/* WEEKS */}
      <div className="space-y-4">
        {weeks.map((week) => (
          <div
            key={week.weekNumber}
            className="border rounded-xl overflow-hidden"
          >
            {/* WEEK HEADER */}
            <div
              onClick={() =>
                setExpandedWeek(
                  expandedWeek === week.weekNumber
                    ? null
                    : week.weekNumber
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

                {week.marks !== undefined && week.marks !== null ? (
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
                    <p className="font-medium">
                      {week.functionality}
                    </p>
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
                    <p className="font-medium">
                      {week.taskDetails}
                    </p>
                  </div>
                </div>

                {/* MENTOR EVALUATION */}
                <div className="border-t pt-4 grid md:grid-cols-2 gap-4 text-sm">

                  <div>
                    <p className="text-xs text-gray-500 font-semibold">
                      Mentor Marks
                    </p>
                    <p className="font-semibold text-indigo-700">
                      {week.marks !== undefined && week.marks !== null
                        ? `${week.marks} / 10`
                        : "Not evaluated"}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-gray-500 font-semibold">
                      Mentor Remark
                    </p>
                    <p className="text-gray-700">
                      {week.mentorRemark || "No remark"}
                    </p>
                  </div>

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
            <p className="text-xs text-gray-500">Evaluated Weeks</p>
            <p className="text-2xl font-bold text-indigo-700">
              {totalWeeks}
            </p>
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

export default Form3Head;