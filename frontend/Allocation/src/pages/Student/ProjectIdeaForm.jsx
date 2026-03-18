// src/pages/student/ProjectIdeaForm.jsx
import React, { useEffect, useState } from "react";
import { submitProjectIdeaForm } from "../../services/studentService";
import {
  getAvailableMentors,
  getAvailableStudents,
} from "../../services/commonService";

const ProjectIdeaForm = ({ status }) => {
  const [mentors, setMentors] = useState([]);
  const [teamMembers, setTeamMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    technology: "",
    mentor: "",
    teamMembers: [],
    academicYear: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [mentorList, members] = await Promise.all([
          getAvailableMentors(),
          getAvailableStudents(),
        ]);

        setMentors(mentorList || []);
        setTeamMembers(members || []);

        setFormData((prev) => ({
          ...prev,
          academicYear: localStorage.getItem("academicYear") || "",
        }));
      } catch (err) {
        setError("Failed to load form data.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleTeamMemberChange = (e) => {
    const selected = Array.from(e.target.selectedOptions, (o) => o.value);
    setFormData((prev) => ({ ...prev, teamMembers: selected }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      const { academicYear, ...payload } = formData;
      const res = await submitProjectIdeaForm(payload);

      setSuccess("Project Idea submitted successfully!");

      setFormData((prev) => ({
        ...prev,
        title: "",
        description: "",
        technology: "",
        mentor: "",
        teamMembers: [],
        academicYear: res.data?.academicYear || prev.academicYear,
      }));
    } catch (err) {
      setError(err.message || "Submission failed");
    }
  };

  if (loading) return <p className="text-center">Loading form...</p>;

  return (
    <div className="max-w-5xl mx-auto bg-white rounded-3xl shadow-xl p-8">
      <h2 className="text-2xl font-extrabold text-slate-900 mb-6">
        Submit Project Idea
      </h2>

      {error && <p className="text-red-500 mb-4">{error}</p>}
      {success && <p className="text-green-600 mb-4">{success}</p>}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Title */}
        <div>
          <label className="form-label">Project Title</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="form-input"
            required
          />
        </div>

        {/* Description */}
        <div>
          <label className="form-label">Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={4}
            className="form-input"
            required
          />
        </div>

        {/* Technology */}
        <div>
          <label className="form-label">Technology Stack</label>
          <input
            type="text"
            name="technology"
            value={formData.technology}
            onChange={handleChange}
            className="form-input"
            required
          />
        </div>

        {/* Academic Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="form-label">Academic Year</label>
            <input
              type="text"
              value={formData.academicYear}
              readOnly
              className="form-input bg-gray-100"
            />
          </div>

          <div>
            <label className="form-label">Branch</label>
            <input
              type="text"
              value={localStorage.getItem("branch") || ""}
              readOnly
              className="form-input bg-gray-100"
            />
          </div>

          <div>
            <label className="form-label">Section</label>
            <input
              type="text"
              value={localStorage.getItem("section") || ""}
              readOnly
              className="form-input bg-gray-100"
            />
          </div>

          <div>
            <label className="form-label">Group</label>
            <input
              type="text"
              value={localStorage.getItem("group") || ""}
              readOnly
              className="form-input bg-gray-100"
            />
          </div>
        </div>

        {/* Team Members */}
        <div>
          <label className="form-label">Team Members</label>
          <select
            multiple
            value={formData.teamMembers}
            onChange={handleTeamMemberChange}
            className="form-input h-40"
          >
            {teamMembers.map((s) => (
              <option key={s._id} value={s._id}>
                {s.name} ({s.rollno})
              </option>
            ))}
          </select>
        </div>

        {/* Mentor */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="form-label mb-0">Select Mentor</label>
          </div>

          <select
            name="mentor"
            value={formData.mentor}
            onChange={handleChange}
            disabled={status !== "interview_passed"}
            className={`form-input ${
              status !== "interview_passed"
                ? "bg-gray-100 cursor-not-allowed"
                : ""
            }`}
          >
            <option value="">-- Select Mentor --</option>
            {mentors.map((m) => (
              <option key={m._id} value={m._id}>
                {m.name}
              </option>
            ))}
          </select>
        </div>

        {/* Submit */}
        <div className="flex justify-end pt-4">
          <button
            type="submit"
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-xl font-semibold transition-all"
          >
            Submit Project Idea
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProjectIdeaForm;