import React, { useEffect, useState } from "react";
import {
  getPendingIdeasForHead,
  reviewIdeaByHead,
} from "../../../services/headService";
import { CheckCircle, XCircle, ChevronRight } from "lucide-react";

const PendingIdeas = ({ academicYear }) => {
  const [ideas, setIdeas] = useState([]);
  const [expanded, setExpanded] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [currentIdeaId, setCurrentIdeaId] = useState(null);
  const [reason, setReason] = useState("");

  useEffect(() => {
    if (academicYear) fetchIdeas();
  }, [academicYear]);

  const fetchIdeas = async () => {
    try {
      const data = await getPendingIdeasForHead(academicYear);
      setIdeas(data);
    } catch (err) {
      console.error("Error fetching ideas:", err);
    }
  };

  const handleApprove = async (id) => {
    try {
      await reviewIdeaByHead(id, "approve");
      fetchIdeas();
    } catch (err) {
      console.error("Error approving idea:", err);
    }
  };

  const handleRejectClick = (id) => {
    setCurrentIdeaId(id);
    setReason("");
    setShowModal(true);
  };

  const handleRejectConfirm = async () => {
    try {
      await reviewIdeaByHead(
        currentIdeaId,
        "reject",
        reason || "No remarks provided",
      );
      setShowModal(false);
      setCurrentIdeaId(null);
      fetchIdeas();
    } catch (err) {
      console.error("Error rejecting idea:", err);
    }
  };

  const toggleExpand = (id) => {
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="space-y-4">
      {ideas.length === 0 && (
        <div className="text-center py-20 text-gray-400 font-medium">
          No pending project ideas
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {ideas.map((idea) => {
          const isOpen = expanded[idea._id];

          return (
            <div
              key={idea._id}
              className={`
                bg-white rounded-xl border p-4 flex flex-col
                ${
                  isOpen
                    ? "border-indigo-400 ring-1 ring-indigo-200 bg-indigo-50/30"
                    : "border-gray-200"
                }
              `}
            >
              {/* Header */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-0">
                <div
                  onClick={() => toggleExpand(idea._id)}
                  className="flex items-center gap-2 cursor-pointer flex-1"
                >
                  <ChevronRight
                    size={18}
                    className={`text-gray-400 transition-transform ${
                      isOpen ? "rotate-90 text-indigo-500" : ""
                    }`}
                  />
                  <h3 className="font-semibold text-gray-800 text-sm sm:text-base">
                    {idea.title}
                  </h3>
                </div>

                {/* Actions */}
                <div className="flex gap-2 w-full sm:w-auto">
                  <button
                    onClick={() => handleApprove(idea._id)}
                    className="flex-1 sm:flex-none flex items-center justify-center gap-1 px-3 py-2 text-sm font-medium text-green-600 border border-green-200 rounded-lg hover:bg-green-50 transition"
                  >
                    <CheckCircle size={16} />
                    Approve
                  </button>

                  <button
                    onClick={() => handleRejectClick(idea._id)}
                    className="flex-1 sm:flex-none flex items-center justify-center gap-1 px-3 py-2 text-sm font-medium text-red-600 border border-red-200 rounded-lg hover:bg-red-50 transition"
                  >
                    <XCircle size={16} />
                    Reject
                  </button>
                </div>
              </div>

              {/* Details */}
              {isOpen && (
                <div className="px-2 sm:px-4 pt-3 pb-2 text-sm text-gray-700 border-t border-gray-200 space-y-1">
                  <p>{idea.description}</p>

                  <p>
                    <span className="font-medium text-gray-600">
                      Technology:
                    </span>{" "}
                    {idea.technology}
                  </p>

                  {idea.teamLead && (
                    <p>
                      <span className="font-medium text-gray-600">
                        Team Lead:
                      </span>{" "}
                      {idea.teamLead.name} ({idea.teamLead.email})
                    </p>
                  )}

                  {idea.teamMembers?.length > 0 && (
                    <div>
                      <span className="font-medium text-gray-600">
                        Team Members:
                      </span>
                      <ul className="list-disc list-inside text-gray-600 mt-1">
                        {idea.teamMembers.map((member) => (
                          <li key={member._id}>
                            {member.name} ({member.rollno})
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Reject Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-2 sm:px-0">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              Reject Project Idea
            </h3>

            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Enter rejection reason..."
              className="w-full border border-gray-300 rounded-lg p-3 text-sm resize-none focus:outline-none focus:ring-1 focus:ring-red-500 focus:border-red-500"
              rows="4"
            />

            <div className="flex justify-end gap-3 mt-5 flex-wrap">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200"
              >
                Cancel
              </button>

              <button
                onClick={handleRejectConfirm}
                className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700"
              >
                Confirm Reject
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PendingIdeas;
