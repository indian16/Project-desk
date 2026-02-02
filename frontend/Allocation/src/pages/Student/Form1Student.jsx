import React, { useState, useEffect } from "react";
import axios from "axios";

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
        const res = await axios.get("/api/student/form1", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.data.form1) {
          setFormData(res.data.form1); // ✅ auto-fill
          setFormAlreadyFilled(true);
        }

        setIsTeamLead(res.data.isTeamLead); // ✅ role check
      } catch (err) {
        console.error("Fetch form error:", err);
      }
    };

    if (token) fetchForm();
  }, []);

  // ---------------------------
  // Input handler
  // ---------------------------
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

  // ---------------------------
  // Add / Remove items
  // ---------------------------
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

  // ---------------------------
  // Submit handler
  // ---------------------------
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
      const res = await axios.post(
        "http://localhost:8000/api/student/form1/save",
        { formData, submitType },
        { headers: { Authorization: `Bearer ${token}` } },
      );

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
          (err.response?.data?.message || err.message || "Unknown error"),
      );
    }
  };

  // Render
  return (
    <div className="p-4 md:p-8 max-w-6xl mx-auto bg-white shadow-2xl rounded-2xl my-8 font-sans">
      <h1 className="text-3xl font-extrabold mb-8 text-indigo-800 text-center tracking-tight">
        FORM-1{" "}
        {/* <span className="text-xl font-medium block text-gray-500">
          Form – 1
        </span> */}
      </h1>

      {formAlreadyFilled && !isTeamLead && (
        <div className="mb-6 p-4 rounded-xl bg-yellow-100 border border-yellow-300 text-yellow-800 text-center font-semibold">
          ⚠️ This form has already been filled by the Team Lead. You can only
          view it.
        </div>
      )}

      <form className="space-y-6">
        {/* Branch / Section / Group */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
          <h2 className="section-heading">Tools & Technologies</h2>

          {formData.toolsTechnologies.map((tool, i) => (
            <div key={i} className="flex gap-2 mb-2 items-center">
              <input
                name="name"
                value={tool.name}
                onChange={(e) => handleChange(e, "tools", i)}
                placeholder="Tool Name"
                disabled={!isTeamLead}
                className="form-input"
              />
              <input
                name="version"
                value={tool.version}
                onChange={(e) => handleChange(e, "tools", i)}
                placeholder="Version"
                disabled={!isTeamLead}
                className="form-input"
              />
              <input
                name="type"
                value={tool.type}
                onChange={(e) => handleChange(e, "tools", i)}
                placeholder="Type"
                disabled={!isTeamLead}
                className="form-input"
              />
              <input
                name="purpose"
                value={tool.purpose}
                onChange={(e) => handleChange(e, "tools", i)}
                placeholder="Purpose"
                disabled={!isTeamLead}
                className="form-input"
              />
              <button
                type="button"
                onClick={() => removeItem("tools", i)}
                disabled={!isTeamLead}
                className="btn-remove"
              >
                Remove
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() => addItem("tools")}
            disabled={!isTeamLead}
            className="btn-add"
          >
            + Add Tool
          </button>
        </div>

        {/* Proposed Modules */}
        <div>
          <h2 className="section-heading">Proposed Modules</h2>
          {formData.proposedModules.map((mod, i) => (
            <div key={i} className="flex gap-2 mb-2 items-center">
              <input
                name="name"
                value={mod.name}
                onChange={(e) => handleChange(e, "modules", i)}
                placeholder="Module Name"
                disabled={!isTeamLead}
                className="form-input"
              />
              <input
                name="functionality"
                value={mod.functionality}
                onChange={(e) => handleChange(e, "modules", i)}
                placeholder="Functionality"
                disabled={!isTeamLead}
                className="form-input"
              />
              <button
                type="button"
                onClick={() => removeItem("modules", i)}
                disabled={!isTeamLead}
                className="btn-remove"
              >
                Remove
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() => addItem("modules")}
            className="btn-add"
          >
            + Add Module
          </button>
        </div>

        {/* Team Members */}
        <div>
          <h2 className="section-heading">Team Members</h2>
          {formData.teamMembers.map((member, i) => (
            <div key={i} className="flex gap-2 mb-2 items-center">
              <input
                name="name"
                value={member.name}
                onChange={(e) => handleChange(e, "team", i)}
                placeholder="Name"
                disabled={!isTeamLead}
                className="form-input"
              />
              <input
                name="mobile"
                value={member.mobile}
                onChange={(e) => handleChange(e, "team", i)}
                placeholder="Mobile"
                disabled={!isTeamLead}
                className="form-input"
              />
              <input
                name="expertise"
                value={member.expertise}
                onChange={(e) => handleChange(e, "team", i)}
                placeholder="Expertise"
                disabled={!isTeamLead}
                className="form-input"
              />
              <input
                name="role"
                value={member.role}
                onChange={(e) => handleChange(e, "team", i)}
                placeholder="Role"
                disabled={!isTeamLead}
                className="form-input"
              />
              <button
                type="button"
                onClick={() => removeItem("team", i)}
                disabled={!isTeamLead}
                className="btn-remove"
              >
                Remove
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() => addItem("team")}
            className="btn-add"
          >
            {" "}
            + Add Member{" "}
          </button>
        </div>

        {/* Mentor / Lab Coordinator */}
        <input
          name="mentorName"
          value={formData.mentorName}
          onChange={handleChange}
          placeholder="Mentor Name"
          disabled={!isTeamLead}
          className="form-input"
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
          <h2 className="section-heading">Project Track</h2>
          {["AI/ML", "Web", "Mobile", "Embedded"].map((track) => (
            <label key={track} className="mr-4">
              <input
                type="checkbox"
                value={track}
                checked={formData.projectTrack.includes(track)}
                onChange={(e) => handleChange(e, "projectTrack")}
                disabled={!isTeamLead}
                className="mr-1"
              />

              {track}
            </label>
          ))}
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
