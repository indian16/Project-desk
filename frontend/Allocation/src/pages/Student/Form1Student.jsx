import React, { useState, useEffect } from "react";
import api from "../../utils/axios";
import { Code, Cpu, Plus, Trash2, Users, FileText, Box } from "lucide-react";

const Form1Student = () => {
  const [formData, setFormData] = useState({
    branch: "",
    section: "",
    group: "",
    title: "",
    projectTrack: [],
    introduction: "",
    toolsTechnologies: [
      { name: "", version: "", type: "software", purpose: "" },
    ],
    proposedModules: [{ name: "", functionality: "" }],
    teamMembers: [{ name: "", mobile: "", expertise: "", role: "" }],
    mentorId: "",
    mentorName: "",
    labCoordinatorName: "",
  });

  const [message, setMessage] = useState("");
  const [isTeamLead, setIsTeamLead] = useState(true);
  const [formAlreadyFilled, setFormAlreadyFilled] = useState(false);

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchForm = async () => {
      try {
        const res = await api.get("/student/form1");

        if (res.data.form1) {
          setFormData(res.data.form1);
          setFormAlreadyFilled(true);
        }

        if (res.data.mentor) {
          setFormData((prev) => ({
            ...prev,
            mentorId: res.data.mentor._id,
            mentorName: res.data.mentor.name,
          }));
        }
        setIsTeamLead(res.data.isTeamLead);
      } catch (err) {
        console.error("Fetch form error:", err);
      }
    };

    if (token) fetchForm();
  }, []);

  const handleChange = (e, section = null, index = 0) => {
    const { name, value } = e.target;

    if (section === "tools") {
      const updated = [...formData.toolsTechnologies];
      updated[index][name] = value;
      setFormData({ ...formData, toolsTechnologies: updated });
    } else if (section === "modules") {
      const updated = [...formData.proposedModules];
      updated[index][name] = value;
      setFormData({ ...formData, proposedModules: updated });
    } else if (section === "team") {
      const updated = [...formData.teamMembers];
      updated[index][name] = value;
      setFormData({ ...formData, teamMembers: updated });
    } else if (section === "projectTrack") {
      const updated = [...formData.projectTrack];
      setFormData({
        ...formData,
        projectTrack: updated.includes(value)
          ? updated.filter((v) => v !== value)
          : [...updated, value],
      });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const addItem = (section) => {
    if (section === "tools") {
      setFormData((prev) => ({
        ...prev,
        toolsTechnologies: [
          ...prev.toolsTechnologies,
          { name: "", version: "", type: "software", purpose: "" },
        ],
      }));
    } else if (section === "modules") {
      setFormData((prev) => ({
        ...prev,
        proposedModules: [
          ...prev.proposedModules,
          { name: "", functionality: "" },
        ],
      }));
    } else if (section === "team") {
      setFormData((prev) => ({
        ...prev,
        teamMembers: [
          ...prev.teamMembers,
          { name: "", mobile: "", expertise: "", role: "" },
        ],
      }));
    }
  };

  const removeItem = (section, index) => {
    if (section === "tools") {
      setFormData((prev) => ({
        ...prev,
        toolsTechnologies: prev.toolsTechnologies.filter((_, i) => i !== index),
      }));
    } else if (section === "modules") {
      setFormData((prev) => ({
        ...prev,
        proposedModules: prev.proposedModules.filter((_, i) => i !== index),
      }));
    } else if (section === "team") {
      setFormData((prev) => {
        if (prev.teamMembers.length > 1) {
          return {
            ...prev,
            teamMembers: prev.teamMembers.filter((_, i) => i !== index),
          };
        } else {
          setMessage("⚠️ A project must have at least one team member.");
          return prev;
        }
      });
    }
  };

  const handleSubmit = async (submitType) => {
    if (!token) {
      setMessage("❌ No token found. Please login again.");
      return;
    }

    if (
      !formData.branch ||
      !formData.section ||
      !formData.group ||
      !formData.title
    ) {
      setMessage("❌ Please fill Branch, Section, Group, and Title.");
      return;
    }

    setMessage("⏳ Saving form...");

    try {
      const res = await api.post("/student/form1/save", {
        formData,
        submitType,
      });
      if (res.data.success) {
        let msg = "✅ Form saved!";
        if (submitType === "TEAM") msg = "✅ Form submitted to Team!";
        else if (submitType === "MENTOR") msg = "✅ Form submitted to Mentor!";
        else if (submitType === "HEAD") msg = "✅ Form submitted to Head!";
        setMessage(msg);
      } else {
        setMessage("❌ " + res.data.message);
      }
    } catch (err) {
      console.error("Axios error:", err.response || err);
      setMessage(
        "❌ Error: " +
          (err.response?.data?.message || err.message || "Unknown error")
      );
    }
  };

  return (
    <div className="p-4 md:p-8 max-w-6xl mx-auto bg-white shadow-2xl rounded-2xl my-8 font-sans">
      <h1 className="text-3xl font-extrabold mb-8 text-indigo-800 text-center tracking-tight">
        FORM-1
      </h1>

      {formAlreadyFilled && !isTeamLead && (
        <div className="mb-6 p-4 rounded-xl bg-yellow-100 border border-yellow-300 text-yellow-800 text-center font-semibold">
          ⚠️ This form has already been filled by the Team Lead. You can only
          view it.
        </div>
      )}

      <form className="space-y-6">
        {/* Branch / Section / Group */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <input
            name="branch"
            value={formData.branch}
            onChange={handleChange}
            placeholder="Branch"
            disabled={!isTeamLead}
            className="form-input"
          />
          <input
            name="section"
            value={formData.section}
            onChange={handleChange}
            placeholder="Section"
            disabled={!isTeamLead}
            className="form-input"
          />
          <input
            name="group"
            value={formData.group}
            onChange={handleChange}
            placeholder="Group"
            disabled={!isTeamLead}
            className="form-input"
          />
        </div>

        {/* Project Title */}
        <input
          name="title"
          value={formData.title}
          onChange={handleChange}
          placeholder="Project Title"
          disabled={!isTeamLead}
          className="form-input"
        />

        {/* Introduction */}
        <textarea
          name="introduction"
          value={formData.introduction}
          onChange={handleChange}
          placeholder="Project Introduction"
          disabled={!isTeamLead}
          className="form-input"
        />

        {/* Tools & Technologies */}
        <div>
          <h2 className="section-heading flex items-center gap-2">
            <Code size={18} /> Tools & Technologies
          </h2>
          {formData.toolsTechnologies.map((tool, i) => (
            <div
              key={i}
              className="flex flex-col sm:flex-row gap-2 mb-2 items-center"
            >
              <input
                name="name"
                value={tool.name}
                onChange={(e) => handleChange(e, "tools", i)}
                placeholder="Tool Name"
                disabled={!isTeamLead}
                className="form-input flex-1"
              />
              <input
                name="version"
                value={tool.version}
                onChange={(e) => handleChange(e, "tools", i)}
                placeholder="Version"
                disabled={!isTeamLead}
                className="form-input flex-1"
              />
              <input
                name="type"
                value={tool.type}
                onChange={(e) => handleChange(e, "tools", i)}
                placeholder="Type"
                disabled={!isTeamLead}
                className="form-input flex-1"
              />
              <input
                name="purpose"
                value={tool.purpose}
                onChange={(e) => handleChange(e, "tools", i)}
                placeholder="Purpose"
                disabled={!isTeamLead}
                className="form-input flex-1"
              />
              <button
                type="button"
                onClick={() => removeItem("tools", i)}
                disabled={!isTeamLead}
                className="btn-icon text-red-600"
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() => addItem("tools")}
            disabled={!isTeamLead}
            className="btn-add flex items-center gap-1 mt-2"
          >
            <Plus size={16} /> Add Tool
          </button>
        </div>

        {/* Proposed Modules */}
        <div>
          <h2 className="section-heading flex items-center gap-2">
            <Box size={18} /> Proposed Modules
          </h2>
          {formData.proposedModules.map((mod, i) => (
            <div
              key={i}
              className="flex flex-col sm:flex-row gap-2 mb-2 items-center"
            >
              <input
                name="name"
                value={mod.name}
                onChange={(e) => handleChange(e, "modules", i)}
                placeholder="Module Name"
                disabled={!isTeamLead}
                className="form-input flex-1"
              />
              <input
                name="functionality"
                value={mod.functionality}
                onChange={(e) => handleChange(e, "modules", i)}
                placeholder="Functionality"
                disabled={!isTeamLead}
                className="form-input flex-1"
              />
              <button
                type="button"
                onClick={() => removeItem("modules", i)}
                disabled={!isTeamLead}
                className="btn-icon text-red-600"
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() => addItem("modules")}
            disabled={!isTeamLead}
            className="btn-add flex items-center gap-1 mt-2"
          >
            <Plus size={16} /> Add Module
          </button>
        </div>

        {/* Team Members */}
        <div>
          <h2 className="section-heading flex items-center gap-2">
            <Users size={18} /> Team Members
          </h2>
          {formData.teamMembers.map((member, i) => (
            <div
              key={i}
              className="flex flex-col sm:flex-row gap-2 mb-2 items-center"
            >
              <input
                name="name"
                value={member.name}
                onChange={(e) => handleChange(e, "team", i)}
                placeholder="Name"
                disabled={!isTeamLead}
                className="form-input flex-1"
              />
              <input
                name="mobile"
                value={member.mobile}
                onChange={(e) => handleChange(e, "team", i)}
                placeholder="Mobile"
                disabled={!isTeamLead}
                className="form-input flex-1"
              />
              <input
                name="expertise"
                value={member.expertise}
                onChange={(e) => handleChange(e, "team", i)}
                placeholder="Expertise"
                disabled={!isTeamLead}
                className="form-input flex-1"
              />
              <input
                name="role"
                value={member.role}
                onChange={(e) => handleChange(e, "team", i)}
                placeholder="Role"
                disabled={!isTeamLead}
                className="form-input flex-1"
              />
              <button
                type="button"
                onClick={() => removeItem("team", i)}
                disabled={!isTeamLead}
                className="btn-icon text-red-600"
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() => addItem("team")}
            disabled={!isTeamLead}
            className="btn-add flex items-center gap-1 mt-2"
          >
            <Plus size={16} /> Add Member
          </button>
        </div>

        {/* Mentor / Lab Coordinator */}
        <input
          value={formData.mentorName}
          readOnly
          className="form-input bg-gray-100"
          placeholder="Mentor"
        />
        <input
          name="labCoordinatorName"
          value={formData.labCoordinatorName}
          onChange={handleChange}
          placeholder="Lab Coordinator Name"
          disabled={!isTeamLead}
          className="form-input"
        />

        {/* Project Track */}
        <div>
          <h2 className="section-heading flex items-center gap-2">
            <Cpu size={18} /> Project Track
          </h2>
          <div className="flex flex-wrap gap-4">
            {["AI/ML", "Web", "Mobile", "Embedded"].map((track) => (
              <label key={track} className="flex items-center gap-1">
                <input
                  type="checkbox"
                  value={track}
                  checked={formData.projectTrack.includes(track)}
                  onChange={(e) => handleChange(e, "projectTrack")}
                  disabled={!isTeamLead}
                />
                {track}
              </label>
            ))}
          </div>
        </div>

        {/* Submit Buttons */}
        <div className="pt-4 flex flex-col md:flex-row justify-center gap-4">
          <button
            type="button"
            onClick={() => handleSubmit("TEAM")}
            className="btn-primary"
          >
            📝 Submit to Team
          </button>
          <button
            type="button"
            onClick={() => handleSubmit("MENTOR")}
            className="btn-primary"
          >
            🚀 Submit to Mentor
          </button>
          <button
            type="button"
            onClick={() => handleSubmit("HEAD")}
            className="btn-primary"
          >
            💾 Submit to Head
          </button>
        </div>

        {/* Message */}
        {message && (
          <p
            className={`mt-4 text-center font-semibold text-lg ${
              message.startsWith("✅")
                ? "text-green-600"
                : message.startsWith("❌")
                ? "text-red-600"
                : "text-indigo-600"
            }`}
          >
            {message}
          </p>
        )}
      </form>
    </div>
  );
};

export default Form1Student;