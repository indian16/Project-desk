// src/pages/student/ProjectDetails.jsx
import React, { useEffect, useState } from "react";
import { getAvailableMentors } from "../../services/commonService";
import { assignMentorToProject } from "../../services/studentService";

const ProjectDetails = ({ project, onClose }) => {
  const [mentors, setMentors] = useState([]);
  const [selectedMentor, setSelectedMentor] = useState(project.mentor?._id || "");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const fetchMentors = async () => {
      try {
        const list = await getAvailableMentors();
        setMentors(list || []);
      } catch (err) {
        console.error("Error loading mentors:", err);
        setError("Failed to load mentors.");
      }
    };
    fetchMentors();
  }, []);

  const handleSaveMentor = async () => {
    if (!selectedMentor) {
      setError("Please select a mentor.");
      return;
    }
  
    setSaving(true);
    setError("");
    try {
      const updatedProject = await assignMentorToProject({
        projectId: project._id,
        mentorId: selectedMentor,
      });
  
      setSuccess("Mentor assigned successfully!");
    } catch (err) {
      console.error("Error assigning mentor:", err);
      setError(err.message || "Failed to assign mentor.");
    } finally {
      setSaving(false);
    }
  };;
  if (!project) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-2xl relative">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-800"
        >
          ✕
        </button>

        <h2 className="text-2xl font-bold mb-4">Project Details</h2>

        {/* Project Info */}
        <p><strong>Title:</strong> {project.title}</p>
        <p><strong>Description:</strong> {project.description}</p>
        <p><strong>Technology:</strong> {project.technology}</p>

        <p className="mt-2"><strong>Academic Year:</strong> {project.academicYear}</p>
        <p><strong>Branch:</strong> {project.branch}</p>
        <p><strong>Section:</strong> {project.section}</p>
        <p><strong>Group:</strong> {project.group}</p>

        {/* Team Members */}
        {project.teamMembers?.length > 0 && (
          <div className="mt-4">
            <h3 className="font-semibold mb-2">Team Members:</h3>
            <ul className="list-disc pl-6 text-gray-700">
              {project.teamMembers.map((m) => (
                <li key={m._id}>
                  {m.name} ({m.rollno})
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Mentor Selection */}
        <div className="mt-4">
          <label className="block font-semibold mb-1">Select Mentor:</label>
          <select
            value={selectedMentor}
            onChange={(e) => setSelectedMentor(e.target.value)}
            className="w-full p-2 border rounded"
            disabled={
              !["approved_by_head", "interview_passed"].includes(
                project.status
              )
            }
          >
            <option value="">-- Select a Mentor --</option>
            {mentors.length > 0 ? (
              mentors.map((m) => (
                <option key={m._id} value={m._id}>
                  {m.name}
                </option>
              ))
            ) : (
              <option disabled>No mentors available</option>
            )}
          </select>
        </div>

        {error && <p className="text-red-500 mt-2">{error}</p>}
        {success && <p className="text-green-500 mt-2">{success}</p>}

        {/* Buttons */}
        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
          >
            Close
          </button>
          <button
            onClick={handleSaveMentor}
            disabled={saving || !["approved_by_head", "interview_passed"].includes(project.status)}
            className={`px-4 py-2 rounded text-white ${
              saving
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {saving ? "Saving..." : "Save Mentor"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetails;