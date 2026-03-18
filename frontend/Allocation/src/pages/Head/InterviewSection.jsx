import React, { useEffect, useState } from "react";
import { Calendar } from "lucide-react";
import { getUpcomingInterview } from "../../services/headService";
import HeadMessage from "./HeadMessage";

const InterviewSection = ({ showInterview, setShowInterview }) => {
  const [interviews, setInterviews] = useState([]);
  const [expandedId, setExpandedId] = useState(null);

  useEffect(() => {
    let isMounted = true;

    const fetchInterviews = async () => {
      try {
        const data = await getUpcomingInterview();

        const interviewsArray = Array.isArray(data)
          ? data
          : data?.interviews || [];

        if (!isMounted) return;

        setInterviews((prev) => {
          const prevIds = prev.map((i) => i._id).join(",");
          const newIds = interviewsArray.map((i) => i._id).join(",");

          if (prevIds !== newIds) return interviewsArray;
          return prev;
        });
      } catch (err) {
        console.error(err);
      }
    };

    fetchInterviews();
    const interval = setInterval(fetchInterviews, 5000);

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  return (
    <div className="lg:col-span-2 bg-white border border-slate-200 rounded-2xl p-6 shadow-sm h-[450px] flex flex-col">
      {/* HEADER */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
            <Calendar size={18} />
          </div>

          <h2 className="text-sm font-bold text-slate-800">
            {showInterview ? "Scheduled Interview" : "Messages"}
          </h2>
        </div>

        <button
          onClick={() => setShowInterview(!showInterview)}
          className="text-[11px] font-bold px-4 py-1.5 rounded-lg border border-slate-200
          text-slate-600 hover:bg-slate-100 hover:text-slate-800 transition"
        >
          {showInterview ? "View Messages" : "View Interview"}
        </button>
      </div>

      {/* BODY */}
      <div className="h-full overflow-y-auto space-y-4 pr-2">
        {showInterview ? (
          interviews.length > 0 ? (
            interviews.map((item) => {
              const isExpanded = expandedId === item._id;

              return (
                <div
                  key={item._id}
                  className="p-3 border border-slate-200 rounded-xl bg-slate-50 shadow-sm transition"
                >
                  {/* TITLE FIXED */}
                  <p className="text-sm font-bold text-slate-800">
                    {item.idea?.title || "Project Interview"}
                  </p>

                  <p className="text-xs text-slate-500">
                    {item.date} • {item.time}
                  </p>

                  <p className="text-xs text-slate-600 mt-1">
                    Location: {item.location}
                  </p>

                  {/* SHOW LESS / MORE */}
                  {isExpanded && (
                    <>
                      {item.idea && (
                        <>
                          <p className="text-xs text-slate-600 mt-2">
                            <span className="font-semibold">Technology:</span>{" "}
                            {item.idea.technology}
                          </p>

                          <p className="text-xs text-slate-600">
                            <span className="font-semibold">Team Lead:</span>{" "}
                            {item.idea.teamLead?.name}
                          </p>
                        </>
                      )}

                      {item.notes && (
                        <p className="text-xs text-slate-500 mt-2">
                          Notes: {item.notes}
                        </p>
                      )}
                    </>
                  )}

                  {/* TOGGLE BUTTON */}
                  <button
                    onClick={() => setExpandedId(isExpanded ? null : item._id)}
                    className="mt-2 text-[11px] font-semibold text-indigo-600 hover:underline"
                  >
                    {isExpanded ? "Show Less" : "View More"}
                  </button>
                </div>
              );
            })
          ) : (
            <div className="flex items-center justify-center h-full bg-slate-50 border border-dashed border-slate-200 rounded-xl">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                No Interviews Scheduled
              </p>
            </div>
          )
        ) : (
          <HeadMessage />
        )}
      </div>
    </div>
  );
};

export default InterviewSection;
