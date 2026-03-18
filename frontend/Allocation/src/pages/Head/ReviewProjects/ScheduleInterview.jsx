import React, { useEffect, useState } from "react";
import {
  getAcceptedIdeasForInterview,
  scheduleInterview,
} from "../../../services/headService";

const ScheduleInterview = () => {
  const [ideas, setIdeas] = useState([]);
  const [selectedIdeaId, setSelectedIdeaId] = useState(null);
  const [interviewDetails, setInterviewDetails] = useState({
    date: "",
    time: "",
    location: "",
    notes: "",
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" }); // New message state

  useEffect(() => {
    async function fetchIdeas() {
      try {
        const data = await getAcceptedIdeasForInterview();
        setIdeas(data);
      } catch (error) {
        console.error("Failed to fetch accepted ideas:", error);
      }
    }
    fetchIdeas();
  }, []);

  const handleChange = (e) => {
    setInterviewDetails({
      ...interviewDetails,
      [e.target.name]: e.target.value,
    });
  };

  const handleSchedule = async (ideaId) => {
    const { date, time, location } = interviewDetails;
    if (!date || !time || !location) {
      setMessage({
        text: "Please fill in date, time, and location.",
        type: "error",
      });
      return;
    }

    setLoading(true);
    try {
      await scheduleInterview(ideaId, interviewDetails);

      setIdeas((prev) =>
        prev.map((idea) =>
          idea._id === ideaId
            ? { ...idea, status: "interview_scheduled" }
            : idea,
        ),
      );

      setMessage({
        text: "Interview scheduled successfully!",
        type: "success",
      });
      setSelectedIdeaId(null);
      setInterviewDetails({ date: "", time: "", location: "", notes: "" });
    } catch (error) {
      console.error(error);
      setMessage({ text: "Failed to schedule interview", type: "error" });
    } finally {
      setLoading(false);
      setTimeout(() => setMessage({ text: "", type: "" }), 4000); // Auto-hide after 4s
    }
  };

  return (
    <div className="p-4 sm:p-6 max-w-6xl mx-auto">
      <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-4 sm:mb-6">
        Accepted Project Ideas
      </h2>

      {message.text && (
        <div
          className={`mb-4 px-4 py-2 rounded text-sm font-medium ${
            message.type === "success"
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          {message.text}
        </div>
      )}

      {ideas.length === 0 && (
        <p className="text-gray-500 text-sm sm:text-base">
          No accepted ideas available.
        </p>
      )}

      <div className="space-y-4">
        {ideas.map((idea) => {
          const isSelected = selectedIdeaId === idea._id;
          const isScheduled = idea.status === "interview_scheduled";

          return (
            <div
              key={idea._id}
              onClick={() =>
                !isScheduled && setSelectedIdeaId(isSelected ? null : idea._id)
              }
              className={`relative rounded-lg border transition-all duration-200 
                ${isSelected ? "border-blue-500 ring-1 ring-blue-200 bg-blue-50/40" : "border-gray-200 bg-white hover:border-gray-300"}
                ${isScheduled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
              `}
            >
              {/* LEFT ACCENT BAR */}
              {isSelected && (
                <span className="absolute left-0 top-0 h-full w-1 bg-blue-500 rounded-l-lg" />
              )}

              {/* HEADER */}
              <div className="p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-0">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-800">
                    {idea.title}
                  </h3>
                  <p className="text-sm text-gray-600 mt-1">
                    Team Lead:{" "}
                    <span className="font-medium">
                      {idea.teamLead?.name || "N/A"}
                    </span>
                  </p>
                  <p className="text-sm text-gray-500 mt-2 line-clamp-2">
                    {idea.description || "No description provided"}
                  </p>
                </div>

                {isScheduled && (
                  <span className="mt-2 sm:mt-0 text-xs font-medium px-3 py-1 rounded-full bg-green-100 text-green-700">
                    Interview Scheduled
                  </span>
                )}
              </div>

              {/* FORM SECTION */}
              {isSelected && !isScheduled && (
                <div
                  className="border-t bg-white px-4 sm:px-6 py-4"
                  onClick={(e) => e.stopPropagation()}
                >
                  <h4 className="text-md font-semibold text-gray-700 mb-4">
                    Schedule Interview
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-600">
                        Date
                      </label>
                      <input
                        type="date"
                        name="date"
                        value={interviewDetails.date}
                        onChange={handleChange}
                        min={new Date().toISOString().split("T")[0]}
                        className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-200 outline-none"
                      />
                    </div>

                    <div>
                      <label className="text-sm font-medium text-gray-600">
                        Time
                      </label>
                      <input
                        type="time"
                        name="time"
                        value={interviewDetails.time}
                        onChange={handleChange}
                        className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-200 outline-none"
                      />
                    </div>

                    <div>
                      <label className="text-sm font-medium text-gray-600">
                        Location
                      </label>
                      <input
                        type="text"
                        name="location"
                        placeholder="Interview room / Online link"
                        value={interviewDetails.location}
                        onChange={handleChange}
                        className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-200 outline-none"
                      />
                    </div>

                    <div>
                      <label className="text-sm font-medium text-gray-600">
                        Notes
                      </label>
                      <textarea
                        name="notes"
                        value={interviewDetails.notes}
                        onChange={handleChange}
                        rows={3}
                        placeholder="Optional notes"
                        className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-200 outline-none resize-none"
                      />
                    </div>
                  </div>

                  <div className="mt-4 sm:mt-5 flex justify-end">
                    <button
                      onClick={() => handleSchedule(idea._id)}
                      disabled={loading}
                      className={`px-6 py-2 rounded-md text-sm font-medium transition
                        ${loading ? "bg-gray-300 cursor-not-allowed" : "bg-blue-600 text-white hover:bg-blue-700"}
                      `}
                    >
                      {loading ? "Scheduling..." : "Confirm Schedule"}
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ScheduleInterview;
