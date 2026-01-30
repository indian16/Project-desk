// src/pages/head/ProjectsData.jsx
import React, { useEffect, useState } from "react";
import { getAllCombinedProjects } from "../../services/headService";

const statusColors = {
  pending: "bg-yellow-100 text-yellow-800",
  approve: "bg-green-100 text-green-800",
  rejected: "bg-red-100 text-red-800",
  interview_scheduled: "bg-blue-100 text-blue-800",
  interview_passed: "bg-green-200 text-green-900",
  interview_failed: "bg-red-200 text-red-900",
  approved_by_mentor: "bg-green-200 text-green-900",
  rejected_by_mentor: "bg-red-200 text-red-900",
};

const ProjectsData = () => {
  const [allProjects, setAllProjects] = useState([]);
  const [filter, setFilter] = useState("all"); // all, idea, assigned
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true);
        const res = await getAllCombinedProjects();
        console.log("Projects response:", res);
        if (res?.success && res.projects) {
          setAllProjects(res.projects);
        }
      } catch (err) {
        console.error("Error fetching projects:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  // Filtered projects
  const filteredProjects = allProjects.filter((p) =>
    filter === "all" ? true : p.type === filter
  );

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Projects Dashboard</h1>

      {/* Filter Buttons */}
      <div className="flex flex-wrap gap-3 mb-6">
        {["all", "idea", "assigned"].map((f) => (
          <button
            key={f}
            className={`px-5 py-2 rounded-full font-semibold transition-colors duration-300
              ${filter === f ? "bg-blue-600 text-white shadow-lg" : "bg-gray-200 text-gray-700 hover:bg-blue-100"}
            `}
            onClick={() => setFilter(f)}
          >
            {f === "all"
              ? "All Projects"
              : f === "idea"
              ? "Project Ideas"
              : "Assigned Projects"}
          </button>
        ))}
      </div>

      {loading ? (
        <p className="text-gray-600">Loading projects...</p>
      ) : filteredProjects.length === 0 ? (
        <p className="text-gray-600">No projects found.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((p) => (
            <div
              key={p.id || p._id}
              className="bg-white rounded-2xl shadow-md p-6 border border-gray-200 transition-transform transform hover:scale-[1.03] hover:shadow-xl"
            >
              <div className="flex justify-between items-start mb-3">
                <h2 className="text-xl font-bold text-gray-800">{p.title}</h2>
                <span
                  className={`text-xs font-semibold px-3 py-1 rounded-full ${
                    p.type === "idea" ? "bg-purple-100 text-purple-800" : "bg-green-100 text-green-800"
                  }`}
                >
                  {p.type === "idea" ? "Project Idea" : "Assigned"}
                </span>
              </div>

              <p className="text-gray-700 mb-3">{p.description}</p>

              <div className="mb-2">
                <span className="font-semibold text-gray-800">Technology:</span>{" "}
                {p.technology || "N/A"}
              </div>

              <div className="mb-2">
                <span className="font-semibold text-gray-800">Status:</span>{" "}
                <span
                  className={`text-sm px-2 py-1 rounded-full ${
                    statusColors[p.status] || "bg-gray-100 text-gray-700"
                  }`}
                >
                  {p.status.replace("_", " ").toUpperCase()}
                </span>
              </div>

              <div className="mb-2">
                <span className="font-semibold text-gray-800">Team Lead:</span>{" "}
                {p.teamLead?.name || "N/A"}
              </div>

              <div className="mb-2">
                <span className="font-semibold text-gray-800">Team Members:</span>{" "}
                {p.teamMembers?.length > 0
                  ? p.teamMembers.map((m) => m.name || m.rollno || "N/A").join(", ")
                  : "N/A"}
              </div>

              {p.type === "idea" && (
                <div className="mb-2">
                  <span className="font-semibold text-gray-800">Mentor:</span>{" "}
                  {p.mentor?.name || "Not Assigned"}
                </div>
              )}

              {p.type === "assigned" && (
                <>
                  <div className="mb-2">
                    <span className="font-semibold text-gray-800">Selected Mentor:</span>{" "}
                    {p.selectedMentor?.name || "N/A"}
                  </div>
                  <div className="mb-2">
                    <span className="font-semibold text-gray-800">Approved Mentor:</span>{" "}
                    {p.approvedMentor?.name || "N/A"}
                  </div>
                </>
              )}

              <div className="text-sm text-gray-600 mt-3">
                <p>
                  <b>Academic Year:</b> {p.academicYear || "N/A"}
                </p>
                <p>
                  <b>Branch:</b> {p.branch || "N/A"} | <b>Section:</b> {p.section || "N/A"} | <b>Group:</b> {p.group || "N/A"}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProjectsData;