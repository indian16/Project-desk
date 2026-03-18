import React, { useEffect, useState } from "react";
import {
  getMentorIdeaProjects,
  reviewIdeaProject,
} from "../../services/mentorService";

export default function IdeaProject() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [rejectingId, setRejectingId] = useState(null);
  const [feedback, setFeedback] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const user = JSON.parse(localStorage.getItem("user"));

  const fetchProjects = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getMentorIdeaProjects();
      setProjects(data.projects || []);
    } catch (err) {
      console.error("Error fetching idea projects:", err);
      setError(err.message || "Server error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleReview = async (id, action, customFeedback = "") => {
    try {
      const res = await reviewIdeaProject(id, action, customFeedback);

      // ✅ success message instead of alert
      setSuccessMsg(res.message || "Action completed");

      setRejectingId(null);
      setFeedback("");

      fetchProjects();

      // auto hide message
      setTimeout(() => {
        setSuccessMsg("");
      }, 2000);
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <p>Loading idea projects...</p>;
  if (error) return <p className="text-red-500">{error}</p>;
  if (!projects.length) return <p>No idea projects assigned to you yet.</p>;

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Idea Projects Assigned</h2>

      {/* ✅ SUCCESS MESSAGE */}
      {successMsg && (
        <p className="mb-4 text-green-600 text-sm font-semibold bg-green-50 px-3 py-2 rounded-lg border border-green-200">
          {successMsg}
        </p>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
        {projects.map((project) => {
          const currentMentorId = String(user?._id || user?.id);
          const confirmedMentorId = String(project.confirmedMentor);
          const isApprovingMentor = confirmedMentorId === currentMentorId;

          const mentorRejected = project.rejectedMentors?.some(
            (m) => String(m._id || m) === currentMentorId,
          );

          return (
            <div
              key={project._id}
              className="bg-white rounded-2xl shadow-md border flex flex-col h-[420px]"
            >
              <div className="p-5 flex flex-col h-full">
                <div className="flex-1 overflow-y-auto pr-1">
                  {/* TITLE */}
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-bold text-gray-800">
                      {project.title}
                    </h3>

                    <span
                      className={`text-xs px-2 py-1 rounded-full font-semibold ${
                        project.status === "interview_passed"
                          ? "bg-yellow-100 text-yellow-700"
                          : project.status === "approved_by_mentor"
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                      }`}
                    >
                      {project.status}
                    </span>
                  </div>

                  {/* DESCRIPTION */}
                  <p className="text-sm text-gray-500 mb-3 line-clamp-3">
                    {project.description}
                  </p>

                  {/* TECHNOLOGY */}
                  <div className="mb-3">
                    <p className="text-xs font-bold text-gray-400 uppercase">
                      Technology
                    </p>
                    <p className="text-sm font-semibold">
                      {project.technology}
                    </p>
                  </div>
                  {/* ✅ Project Info */}
                  {/* ✅ Project Info */}
                  <div className="text-xs text-gray-600 space-y-1 mt-2">
                    <div>
                      <span className="font-semibold">Branch: </span>
                      {project.branch || "N/A"}
                    </div>
                    <div>
                      <span className="font-semibold">Academic Year: </span>
                      {project.academicYear || "N/A"}
                    </div>
                    <div>
                      <span className="font-semibold">Section: </span>
                      {project.section || "N/A"}
                    </div>
                    <div>
                      <span className="font-semibold">Group: </span>
                      {project.group || "N/A"}
                    </div>
                  </div>

                  {/* TEAM LEAD */}
                  <div className="bg-blue-50 p-3 rounded-lg mb-3">
                    <p className="text-xs font-bold text-blue-700">Team Lead</p>

                    <p className="text-sm font-semibold">
                      {project.teamLead?.name || "N/A"}
                    </p>

                    <p className="text-xs text-gray-500">
                      {project.teamLead?.email}
                    </p>
                  </div>

                  {/* TEAM MEMBERS */}
                  <div>
                    <p className="text-xs font-bold text-gray-400 uppercase mb-1">
                      Team Members
                    </p>

                    <div className="space-y-1 max-h-24 overflow-y-auto">
                      {project.teamMembers?.map((m) => (
                        <div
                          key={m._id}
                          className="bg-gray-50 px-3 py-2 rounded text-sm"
                        >
                          <p className="font-medium">{m.name}</p>
                          <p className="text-xs text-gray-500">{m.email}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* ACTIONS */}
                <div className="mt-4 pt-3 border-t">
                  {project.status === "interview_passed" && !mentorRejected && (
                    <div className="flex flex-col gap-3">
                      {/* BUTTON ROW */}
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleReview(project._id, "approve")}
                          className={`flex-1 py-2 rounded-lg text-sm font-semibold transition ${
                            rejectingId === project._id
                              ? "bg-green-400 cursor-not-allowed text-white"
                              : "bg-green-600 hover:bg-green-700 text-white"
                          }`}
                          disabled={rejectingId === project._id}
                        >
                          Approve
                        </button>

                        <button
                          onClick={() => setRejectingId(project._id)}
                          className={`flex-1 py-2 rounded-lg text-sm font-semibold transition ${
                            rejectingId === project._id
                              ? "bg-red-400 text-white"
                              : "bg-red-600 hover:bg-red-700 text-white"
                          }`}
                        >
                          Reject
                        </button>
                      </div>

                      {/* FEEDBACK */}
                      {rejectingId === project._id && (
                        <div className="flex flex-col gap-2">
                          <textarea
                            value={feedback}
                            onChange={(e) => setFeedback(e.target.value)}
                            placeholder="Enter rejection feedback..."
                            className="w-full border rounded-lg p-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-400"
                          />

                          <div className="flex gap-2">
                            <button
                              onClick={() =>
                                handleReview(project._id, "reject", feedback)
                              }
                              className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 rounded-lg text-sm font-semibold transition"
                            >
                              Confirm Reject
                            </button>

                            <button
                              onClick={() => {
                                setRejectingId(null);
                                setFeedback("");
                              }}
                              className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 py-2 rounded-lg text-sm font-semibold transition"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {project.status === "interview_passed" && mentorRejected && (
                    <p className="text-red-500 font-semibold text-sm">
                      You rejected this project. Waiting for another mentor.
                    </p>
                  )}

                  {project.status === "approved_by_mentor" && (
                    <p className="text-green-600 font-semibold text-sm">
                      {isApprovingMentor
                        ? "You approved this project"
                        : mentorRejected
                          ? "You rejected this project"
                          : "This project was approved by another mentor"}
                    </p>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
