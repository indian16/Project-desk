import React, { useEffect, useState } from "react";
import { getForm1ByProject, approveForm1 } from "../../services/mentorService";

const Form1Mentor = ({ projectId }) => {
  const [form, setForm] = useState(null);
  const [loading, setLoading] = useState(true);
  const [approving, setApproving] = useState(false);

  useEffect(() => {
    const fetchForm = async () => {
      try {
        const res = await getForm1ByProject(projectId);

        if (res.success) {
          setForm(res.data);
        }
      } catch (error) {
        console.error("Error loading form1", error);
      } finally {
        setLoading(false);
      }
    };

    if (projectId) fetchForm();
  }, [projectId]);

  const handleApprove = async () => {
    try {
      setApproving(true);

      const res = await approveForm1(projectId); // calls your service correctly

      if (res.success) {
        alert("Form 1 Approved Successfully");

        // Update local form status so UI reflects approval
        setForm((prev) => ({ ...prev, status: "approved_by_mentor" }));
      }
    } catch (error) {
      console.error("Approval error", error);
      alert("Failed to approve Form 1");
    } finally {
      setApproving(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center text-gray-500 py-10">Loading Form 1...</div>
    );
  }

  if (!form) {
    return (
      <div className="text-center text-gray-500 py-10">
        Form 1 not submitted yet
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg space-y-6">
      {/* TITLE */}
      <div>
        <h2 className="text-xl font-bold text-gray-800">{form.title}</h2>
        <p className="text-sm text-gray-500">
          {form.branch} | Section {form.section} | Group {form.group}
        </p>
      </div>

      {/* STATUS */}
      <div className="bg-gray-50 p-3 rounded">
        <p className="text-sm">
          <b>Status:</b> {form.status}
        </p>
      </div>

      {/* INTRODUCTION */}
      <div>
        <h3 className="font-semibold mb-2">Introduction</h3>
        <p className="text-sm text-gray-700">{form.introduction}</p>
      </div>

      {/* PROJECT TRACK */}
      <div>
        <h3 className="font-semibold mb-2">Project Track</h3>

        {form.projectTrack?.map((track, i) => (
          <span
            key={i}
            className="bg-blue-100 text-blue-700 text-xs px-3 py-1 mr-2 rounded"
          >
            {track}
          </span>
        ))}
      </div>

      {/* TOOLS */}
      <div>
        <h3 className="font-semibold mb-2">Tools & Technologies</h3>

        {form.toolsTechnologies?.map((tool, i) => (
          <div key={i} className="border rounded p-3 mb-2 bg-gray-50 text-sm">
            <p>
              <b>Name:</b> {tool.name}
            </p>
            <p>
              <b>Version:</b> {tool.version}
            </p>
            <p>
              <b>Type:</b> {tool.type}
            </p>
            <p>
              <b>Purpose:</b> {tool.purpose}
            </p>
          </div>
        ))}
      </div>

      {/* MODULES */}
      <div>
        <h3 className="font-semibold mb-2">Proposed Modules</h3>

        {form.proposedModules?.map((module, i) => (
          <div key={i} className="border rounded p-3 mb-2 bg-gray-50 text-sm">
            <p>
              <b>Module:</b> {module.name}
            </p>
            <p>
              <b>Function:</b> {module.functionality}
            </p>
          </div>
        ))}
      </div>

      {/* TEAM MEMBERS */}
      <div>
        <h3 className="font-semibold mb-2">Team Members</h3>

        {form.teamMembers?.map((member, i) => (
          <div key={i} className="border rounded p-3 mb-2 bg-gray-50 text-sm">
            <p>
              <b>Name:</b> {member.name}
            </p>
            <p>
              <b>Mobile:</b> {member.mobile}
            </p>
            <p>
              <b>Expertise:</b> {member.expertise}
            </p>
            <p>
              <b>Role:</b> {member.role}
            </p>
          </div>
        ))}
      </div>

      {/* STUDENT */}
      <div>
        <h3 className="font-semibold mb-2">Submitted By</h3>

        <p className="text-sm">
          <b>Name:</b> {form.studentId?.name}
        </p>

        <p className="text-sm">
          <b>Email:</b> {form.studentId?.email}
        </p>
      </div>

      {/* MENTOR INFO */}
      <div>
        <h3 className="font-semibold mb-2">Mentor Info</h3>

        <p className="text-sm">
          <b>Mentor:</b> {form.mentorName}
        </p>

        <p className="text-sm">
          <b>Lab Coordinator:</b> {form.labCoordinatorName}
        </p>
      </div>

      {/* APPROVE BUTTON */}
      {form.status === "pending" && (
        <button
          onClick={handleApprove}
          disabled={approving}
          className={`px-6 py-2 rounded text-white ${
            approving ? "bg-gray-400" : "bg-green-600 hover:bg-green-700"
          }`}
        >
          {approving ? "Approving..." : "Approve Form1"}
        </button>
      )}
    </div>
  );
};
export default Form1Mentor;
