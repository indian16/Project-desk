// src/pages/mentor/BankProject.jsx
import React, { useEffect, useState } from "react";
import { getMentorProject, reviewAssignedProject } from "../../services/mentorService";

export default function BankProject() {
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const user = JSON.parse(localStorage.getItem("user"));
const mentorId = user?._id;

  const fetchProject = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getMentorProject();
      setProject(data.project);
    } catch (err) {
      setError(err.message || "Failed to fetch project");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProject();
  }, []);

  const handleReview = async (action) => {
    try {
      const res = await reviewAssignedProject(action);
      alert(res.message);
      setProject(res.project);
    } catch (err) {
      alert(err.message || "Failed to update project");
    }
  };

  if (loading) return <p>Loading project...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;
  if (!project) return <p>No project assigned yet.</p>;

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Assigned Project</h2>
      <table className="w-full border border-gray-200">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-4 py-2 border">Title</th>
            <th className="px-4 py-2 border">Description</th>
            <th className="px-4 py-2 border">Technology</th>
            <th className="px-4 py-2 border">Team Lead</th>
            <th className="px-4 py-2 border">Team Members</th>
            <th className="px-4 py-2 border">Status</th>
            <th className="px-4 py-2 border">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="px-4 py-2 border">{project.title}</td>
            <td className="px-4 py-2 border">{project.description}</td>
            <td className="px-4 py-2 border">{project.technology}</td>
            <td className="px-4 py-2 border">{project.teamLead?.name}</td>
            <td className="px-4 py-2 border">
              {project.teamMembers?.map((m) => (
                <div key={m._id}>{m.name}</div>
              ))}
            </td>
            <td className="px-4 py-2 border">{project.status}</td>
            <td className="px-4 py-2 border">
            <td className="px-4 py-2 border">
  {project.status === "pending" ? (
    <>
      <button
        onClick={() => handleReview("approve")}
        className="mr-2 px-3 py-1 bg-green-500 text-white rounded"
      >
        Approve
      </button>
      <button
        onClick={() => handleReview("reject")}
        className="px-3 py-1 bg-red-500 text-white rounded"
      >
        Reject
      </button>
    </>
  ) : project.status === "approve" ? (
    <span className="text-gray-600 font-semibold">
      Project is approved by another mentor
    </span>
  ) : project.status === "reject" ? (
    <span className="text-red-600 font-semibold">
      Project is rejected
    </span>
  ) : null}
</td>



            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}