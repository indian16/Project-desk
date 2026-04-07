// src/pages/student/ProjectBankForm.jsx
import React, { useEffect, useState } from "react";
import {
  getProjectBankList,
  submitProjectBankForm,
} from "../../services/studentService";
import {
  getAvailableMentors,
  getAvailableStudents,
} from "../../services/commonService";

const ProjectBankForm = () => {
  const [projects, setProjects] = useState([]);
  const [mentors, setMentors] = useState([]);
  const [teamMembers, setTeamMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [formData, setFormData] = useState({
    projectId: "",
    title: "",
    description: "",
    technology: "",
    selectedMentor1: "",
    selectedMentor2: "",
    selectedMentor3: "",
    teamMembers: [],
    academicYear: "",
    branch: "",
    section: "",
    group: "",
  });

  // Load data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [projList, mentorList, members] = await Promise.all([
          getProjectBankList(),
          getAvailableMentors(),
          getAvailableStudents(),
        ]);
        setProjects(projList || []);
        setMentors(mentorList || []);
        setTeamMembers(members || []);
      } catch {
        setError("Failed to load form data.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Autofill project data
  useEffect(() => {
    if (!formData.projectId) return;
    const p = projects.find((x) => x._id === formData.projectId);
    if (!p) return;

    setFormData((prev) => ({
      ...prev,
      title: p.title || "",
      description: p.description || "",
      technology: p.technology || "",
      academicYear:
        p.academicYear || localStorage.getItem("academicYear") || "",
      branch: p.branch || localStorage.getItem("branch") || "",
      section: p.section || localStorage.getItem("section") || "",
      group: p.group || localStorage.getItem("group") || "",
    }));
  }, [formData.projectId, projects]);

  const handleChange = (e) =>
    setFormData((p) => ({ ...p, [e.target.name]: e.target.value }));

  const handleTeamMemberChange = (e) => {
    const selected = Array.from(e.target.options)
      .filter((o) => o.selected)
      .map((o) => o.value);
    setFormData((p) => ({ ...p, teamMembers: selected }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      if (!formData.projectId) {
        setError("Please select a project");
        return;
      }

      if (
        !formData.selectedMentor1 ||
        !formData.selectedMentor2 ||
        !formData.selectedMentor3
      ) {
        setError("Please select all three mentor preferences");
        return;
      }

      if (
        formData.selectedMentor1 === formData.selectedMentor2 ||
        formData.selectedMentor1 === formData.selectedMentor3 ||
        formData.selectedMentor2 === formData.selectedMentor3
      ) {
        setError("Please select three different mentors");
        return;
      }

      const payload = {
        projectId: formData.projectId,
        title: formData.title,
        description: formData.description,
        technology: formData.technology,

        selectedMentor1: formData.selectedMentor1,
        selectedMentor2: formData.selectedMentor2,
        selectedMentor3: formData.selectedMentor3,

        teamMembers: formData.teamMembers,

        teamLead: {
          id: localStorage.getItem("studentId"),
          name: localStorage.getItem("studentName"),
          email: localStorage.getItem("studentEmail"),
        },

        academicYear: formData.academicYear,
        branch: formData.branch,
        section: formData.section,
        group: formData.group,
      };

      await submitProjectBankForm(payload);

      setSuccess("Project submitted successfully!");

      setFormData({
        projectId: "",
        title: "",
        description: "",
        technology: "",
        selectedMentor1: "",
        selectedMentor2: "",
        selectedMentor3: "",
        teamMembers: [],
        academicYear: "",
        branch: "",
        section: "",
        group: "",
      });
    } catch (err) {
      setError(err.response?.data?.message || "Submission failed");
    }
  };

  if (loading) return <p className="text-center mt-6">Loading form...</p>;

  return (
    <div className="flex justify-center">
      <div className="w-full max-w-4xl bg-white rounded-2xl shadow-lg p-8">
        <h2 className="text-2xl font-bold mb-6">Select Project from Bank</h2>

        {error && <p className="text-red-500 mb-3">{error}</p>}
        {success && <p className="text-green-500 mb-3">{success}</p>}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Project Selection */}
          <div>
            <label className="form-label">Select Project</label>
            <select
              name="projectId"
              value={formData.projectId}
              onChange={handleChange}
              className="form-input"
            >
              <option value="">-- Select a Project --</option>
              {projects.map((p) => (
                <option key={p._id} value={p._id}>
                  {p.title}
                </option>
              ))}
            </select>
          </div>

          {formData.projectId && (
            <>
              <div>
                <label className="form-label">Title</label>
                <input
                  className="form-input bg-gray-100"
                  readOnly
                  value={formData.title}
                />
              </div>

              <div>
                <label className="form-label">Description</label>
                <textarea
                  className="form-input h-28 bg-gray-100"
                  readOnly
                  value={formData.description}
                />
              </div>

              <div>
                <label className="form-label">Technology</label>
                <input
                  className="form-input bg-gray-100"
                  readOnly
                  value={formData.technology}
                />
              </div>

              {/* Academic Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="form-label">Academic Year</label>
                  <input
                    className="form-input bg-gray-100"
                    readOnly
                    value={formData.academicYear}
                  />
                </div>
                <div>
                  <label className="form-label">Branch</label>
                  <input
                    className="form-input bg-gray-100"
                    readOnly
                    value={formData.branch}
                  />
                </div>
                <div>
                  <label className="form-label">Section</label>
                  <input
                    className="form-input bg-gray-100"
                    readOnly
                    value={formData.section}
                  />
                </div>
                <div>
                  <label className="form-label">Group</label>
                  <input
                    className="form-input bg-gray-100"
                    readOnly
                    value={formData.group}
                  />
                </div>
              </div>

              {/* Mentor */}
              {/* Mentor Preferences */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="form-label">Mentor Preference 1</label>
                  <select
                    name="selectedMentor1"
                    value={formData.selectedMentor1}
                    onChange={handleChange}
                    className="form-input"
                  >
                    <option value="">-- Select Mentor --</option>
                    {mentors.map((m) => (
                      <option key={m._id} value={m._id}>
                        {m.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="form-label">Mentor Preference 2</label>
                  <select
                    name="selectedMentor2"
                    value={formData.selectedMentor2}
                    onChange={handleChange}
                    className="form-input"
                  >
                    <option value="">-- Select Mentor --</option>
                    {mentors.map((m) => (
                      <option key={m._id} value={m._id}>
                        {m.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="form-label">Mentor Preference 3</label>
                  <select
                    name="selectedMentor3"
                    value={formData.selectedMentor3}
                    onChange={handleChange}
                    className="form-input"
                  >
                    <option value="">-- Select Mentor --</option>
                    {mentors.map((m) => (
                      <option key={m._id} value={m._id}>
                        {m.name}
                      </option>
                    ))}
                  </select>
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
            </>
          )}

          <div className="flex justify-end pt-4">
            <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-xl">
              Submit Project
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProjectBankForm;
