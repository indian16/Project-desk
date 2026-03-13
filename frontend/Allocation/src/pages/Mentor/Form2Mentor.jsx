import React, { useEffect, useState } from "react";
import { getForm2ByProject, approveForm2 } from "../../services/mentorService";

const Form2Mentor = ({ projectId }) => {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchSubmissions = async () => {
    setLoading(true);
    try {
      const res = await getForm2ByProject(projectId);
      if (res.success) setSubmissions(res.submissions);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (studentId) => {
    try {
      const res = await approveForm2(projectId, studentId);
      if (res.success) {
        alert(`Form2 approved successfully}`);
        fetchSubmissions(); 
      }
    } catch (err) {
      console.error(err);
      alert("Failed to approve Form2");
    }
  };

  useEffect(() => {
    if (projectId) fetchSubmissions();
  }, [projectId]);

  if (loading) return <p className="text-gray-500">Loading submissions...</p>;
  if (!submissions.length)
    return <p className="text-gray-500">No Form2 submissions yet.</p>;

  return (
    <div className="space-y-4">
      {submissions.map((form) => (
        <div
          key={form._id}
          className="bg-gray-50 p-4 rounded-lg shadow-sm border"
        >
          <p className="text-sm font-bold text-blue-600 mb-1">
            Student: {form.studentId?.name || "Unknown"} (
            {form.studentId?.email})
          </p>
          <p>
            <span className="font-semibold">Member:</span> {form.member}
          </p>
          <p>
            <span className="font-semibold">Module Name:</span> {form.moduleName}
          </p>
          <p>
            <span className="font-semibold">Functionality Name:</span>{" "}
            {form.functionalityName}
          </p>
          <p>
            <span className="font-semibold">Soft Deadline:</span>{" "}
            {new Date(form.softDeadline).toLocaleDateString()}
          </p>
          <p>
            <span className="font-semibold">Hard Deadline:</span>{" "}
            {new Date(form.hardDeadline).toLocaleDateString()}
          </p>
          <p>
            <span className="font-semibold">Details:</span> {form.details}
          </p>

          <button
            onClick={() => handleApprove(form.studentId._id)}
            disabled={form.approvedByMentor} // disable if already approved
            className={`mt-3 px-4 py-2 rounded-lg text-white font-bold ${
              form.approvedByMentor ? "bg-gray-400 cursor-not-allowed" : "bg-green-600 hover:bg-green-700"
            }`}
          >
            {form.approvedByMentor ? "Approved" : "Approve"}
          </button>
        </div>
      ))}
    </div>
  );
};

export default Form2Mentor;