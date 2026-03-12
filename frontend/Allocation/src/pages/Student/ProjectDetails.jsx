//student/ProjectDetails.jsx
import React, { useEffect, useState } from "react";
import {
  getMentorList,
  selectMentorsForProject,
} from "../../services/studentService";

const ProjectDetails = ({ project, onClose }) => {
  const [mentors, setMentors] = useState([]);
  const [selectedMentor1, setSelectedMentor1] = useState("");
  const [selectedMentor2, setSelectedMentor2] = useState("");
  const [selectedMentor3, setSelectedMentor3] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // ✅ Check if mentors already selected
  const mentorsAlreadySelected =
    project?.selectedMentor1 &&
    project?.selectedMentor2 &&
    project?.selectedMentor3;

  // ✅ Fetch mentors
  useEffect(() => {
    const fetchMentors = async () => {
      try {
        const mentorData = await getMentorList();
        setMentors(Array.isArray(mentorData) ? mentorData : []);
      } catch (err) {
        console.error("Failed to load mentors:", err);
        setMentors([]);
      }
    };

    fetchMentors();
  }, []);

  // ✅ Handle both populated object AND plain ID string
  useEffect(() => {
    if (project) {
      setSelectedMentor1(
        typeof project.selectedMentor1 === "object"
          ? project.selectedMentor1?._id
          : project.selectedMentor1 || ""
      );

      setSelectedMentor2(
        typeof project.selectedMentor2 === "object"
          ? project.selectedMentor2?._id
          : project.selectedMentor2 || ""
      );

      setSelectedMentor3(
        typeof project.selectedMentor3 === "object"
          ? project.selectedMentor3?._id
          : project.selectedMentor3 || ""
      );
    }
  }, [project]);

  const handleSave = async () => {
    if (!selectedMentor1 || !selectedMentor2 || !selectedMentor3) {
      setError("Please select all 3 mentors");
      return;
    }

    if (
      selectedMentor1 === selectedMentor2 ||
      selectedMentor2 === selectedMentor3 ||
      selectedMentor1 === selectedMentor3
    ) {
      setError("Please select 3 different mentors");
      return;
    }

    try {
      setSaving(true);
      setError("");

      await selectMentorsForProject({
        projectId: project._id,
        selectedMentor1,
        selectedMentor2,
        selectedMentor3,
      });

      setSuccess("Mentors selected successfully!");

      setTimeout(() => {
        onClose();
      }, 1500);
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    } finally {
      setSaving(false);
    }
  };

  if (!project) return null;

  return (
    <div className="bg-white p-6 rounded-xl shadow-md max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Project Details</h2>

      <p><strong>Title:</strong> {project.title}</p>
      <p><strong>Description:</strong> {project.description}</p>
      <p><strong>Status:</strong> {project.status}</p>

      {!["interview_passed", "approved_by_mentor"].includes(project.status) ? (
        <div className="mt-4 p-3 bg-yellow-100 text-yellow-800 rounded">
          You can select mentors only after interview is passed.
        </div>
      ) : (
        <div className="mt-6">
          <label className="font-semibold block mb-2">
            Select 3 Preferred Mentors
          </label>

          {[1, 2, 3].map((num) => {
            const value =
              num === 1
                ? selectedMentor1
                : num === 2
                ? selectedMentor2
                : selectedMentor3;

            const setValue =
              num === 1
                ? setSelectedMentor1
                : num === 2
                ? setSelectedMentor2
                : setSelectedMentor3;

            return (
              <select
                key={num}
                value={value}
                onChange={(e) => setValue(e.target.value)}
                disabled={mentorsAlreadySelected}
                className="w-full p-2 border rounded mb-3"
              >
                <option value="">Select Mentor {num}</option>

                {mentors.map((mentor) => (
                  <option key={mentor._id} value={mentor._id}>
                    {mentor.name}
                  </option>
                ))}
              </select>
            );
          })}

          {error && <p className="text-red-500 mt-2">{error}</p>}
          {success && <p className="text-green-600 mt-2">{success}</p>}

          <div className="mt-4 flex gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-300 rounded"
            >
              Cancel
            </button>

            <button
              onClick={handleSave}
              disabled={saving || mentorsAlreadySelected}
              className="px-4 py-2 bg-blue-600 text-white rounded"
            >
              {mentorsAlreadySelected
                ? "Mentors Already Selected"
                : saving
                ? "Saving..."
                : "Save Mentors"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectDetails;