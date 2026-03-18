import React, { useEffect, useState } from "react";
import {
  getMentorProject,
  reviewAssignedProject,
} from "../../services/mentorService";

export default function BankProject() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [rejectMap, setRejectMap] = useState({});
  const [notification, setNotification] = useState(null);

  const user = JSON.parse(localStorage.getItem("user"));
  const mentorId = user?._id || user?.id;

  const fetchProject = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getMentorProject();
      setProjects(data.projects || []);
    } catch (err) {
      setError(err.message || "Failed to fetch project");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProject();
  }, []);

  const handleReview = async (projectId, action) => {
    const reason = rejectMap[projectId]?.reason || "";

    try {
      const res = await reviewAssignedProject(projectId, action, reason);

      setProjects((prev) =>
        prev.map((p) =>
          p._id === projectId
            ? {
                ...p,
                status: action === "approve" ? "approved" : "rejected",
                approvedMentor:
                  action === "approve"
                    ? { _id: mentorId, name: user.name }
                    : p.approvedMentor,
                rejectedMentors:
                  action === "reject"
                    ? [
                        ...(p.rejectedMentors || []),
                        { _id: mentorId, name: user.name },
                      ]
                    : p.rejectedMentors,
              }
            : p,
        ),
      );

      setRejectMap((prev) => ({
        ...prev,
        [projectId]: { show: false, reason: "" },
      }));

      setNotification(res.message);
      setTimeout(() => setNotification(null), 3000);
    } catch (err) {
      setNotification(
        err.response?.data?.message || "Failed to update project",
      );
      setTimeout(() => setNotification(null), 3000);
    }
  };

  if (loading) return <p>Loading project...</p>;
  if (error) return <p className="text-red-500">{error}</p>;
  if (!projects.length) return <p>No project assigned yet.</p>;

  return (
    <div className="p-4 overflow-x-hidden">
      {notification && (
        <div className="fixed top-5 right-5 bg-gray-800 text-white px-4 py-2 rounded shadow-lg z-50">
          {notification}
        </div>
      )}

      <h2 className="text-2xl font-bold mb-6">Assigned Bank Projects</h2>

      {/* ✅ GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
        {projects.map((p) => {
          const isApprovedByMe = p.approvedMentor?._id
            ? p.approvedMentor._id.toString() === mentorId
            : p.approvedMentor?.toString() === mentorId;

          const isRejectedByMe = p.rejectedMentors?.some((m) =>
            m._id ? m._id.toString() === mentorId : m.toString() === mentorId,
          );

          const isApprovedByOther = p.approvedMentor && !isApprovedByMe;

          const rejectState = rejectMap[p._id] || { show: false, reason: "" };

          return (
            <div
              key={p._id}
              className="bg-white rounded-2xl shadow-md border flex flex-col h-[420px] w-full"
            >
              <div className="p-5 flex flex-col h-full">
                {/* CONTENT */}
                <div className="flex-1 overflow-y-auto pr-1">
                  <div className="flex justify-between items-start mb-2 gap-2">
                    <h3 className="text-lg font-bold text-gray-800 break-words">
                      {p.projectId?.title || "N/A"}
                    </h3>

                    <span
                      className={`text-xs px-2 py-1 rounded-full font-semibold whitespace-nowrap ${
                        isApprovedByMe
                          ? "bg-green-100 text-green-700"
                          : isRejectedByMe
                            ? "bg-red-100 text-red-700"
                            : isApprovedByOther
                              ? "bg-gray-100 text-gray-700"
                              : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {isApprovedByMe
                        ? "You approved"
                        : isRejectedByMe
                          ? "You rejected"
                          : isApprovedByOther
                            ? "Approved by another mentor"
                            : "Pending"}
                    </span>
                  </div>

                  <p className="text-sm text-gray-500 mb-3 line-clamp-3 break-words">
                    {p.projectId?.description || "No description provided"}
                  </p>

                  {/* TEAM MEMBERS */}

                  <div className="bg-blue-50 p-3 rounded-lg mb-3">
                    <p className="text-xs font-bold text-blue-700">Team Lead</p>
                    <p className="text-sm font-semibold">
                      {p.teamLead?.name || "Not assigned yet"}
                    </p>
                    <p className="text-xs text-gray-500">
                      {p.teamLead?.email || "-"}
                    </p>
                  </div>
                  {/* TEAM & INFO */}
                  <div>
                    <p className="text-xs font-bold text-gray-400 uppercase mb-1">
                      Team Members ({p.teamMembers?.length || 0})
                    </p>

                    <div className="space-y-1 max-h-24 overflow-y-auto mb-3">
                      {p.teamMembers?.map((m) => (
                        <div
                          key={m._id}
                          className="flex justify-between gap-2 bg-gray-50 px-3 py-2 rounded text-sm"
                        >
                          <span className="font-semibold break-words">
                            {m.name}
                          </span>
                          <span className="text-gray-500 text-xs break-all">
                            {m.email}
                          </span>
                        </div>
                      ))}
                    </div>

                    {/* ✅ Project Info */}
                    <div className="text-xs text-gray-600 space-y-1 mt-2">
                      <div>
                        <span className="font-semibold">Branch: </span>
                        {p.branch || "N/A"}
                      </div>
                      <div>
                        <span className="font-semibold">Academic Year: </span>
                        {p.academicYear || "N/A"}
                      </div>
                      <div>
                        <span className="font-semibold">Section: </span>
                        {p.section || "N/A"}
                      </div>
                      <div>
                        <span className="font-semibold">Group: </span>
                        {p.group || "N/A"}
                      </div>
                    </div>
                  </div>
                </div>

                {/* ACTIONS */}
                {!isApprovedByMe && !isRejectedByMe && !isApprovedByOther && (
                  <div className="mt-4 pt-3 border-t flex flex-col gap-2">
                    <button
                      onClick={() => handleReview(p._id, "approve")}
                      className="bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg text-sm font-semibold"
                    >
                      Approve
                    </button>

                    {!rejectState.show && (
                      <button
                        onClick={() =>
                          setRejectMap((prev) => ({
                            ...prev,
                            [p._id]: { show: true, reason: "" },
                          }))
                        }
                        className="bg-red-600 hover:bg-red-700 text-white py-2 rounded-lg text-sm font-semibold"
                      >
                        Reject
                      </button>
                    )}

                    {rejectState.show && (
                      <div className="flex flex-col gap-2">
                        <textarea
                          placeholder="Reason for rejection"
                          value={rejectState.reason}
                          onChange={(e) =>
                            setRejectMap((prev) => ({
                              ...prev,
                              [p._id]: {
                                ...rejectState,
                                reason: e.target.value,
                              },
                            }))
                          }
                          className="border rounded p-2 text-sm"
                        />
                        <button
                          onClick={() => handleReview(p._id, "reject")}
                          className="bg-red-600 text-white py-2 rounded-lg text-sm font-semibold"
                        >
                          Confirm Reject
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
