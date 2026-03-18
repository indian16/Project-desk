import React, { useEffect, useState } from "react";
import { getHeadProjectForm } from "../../services/headService";

const Form1Head = ({ projectId }) => {
  const [form, setForm] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchForm = async () => {
      try {
        const res = await getHeadProjectForm("form1", projectId);
        if (res.success) {
          setForm(res.data);
        }
      } catch (error) {
        console.error("Error loading Form1", error);
      } finally {
        setLoading(false);
      }
    };

    if (projectId) fetchForm();
  }, [projectId]);

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
    <div className="bg-white p-4 sm:p-6 rounded-2xl shadow-lg space-y-6">
      {/* HEADER */}
      <div className="space-y-1">
        <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-800">
          {form.title}
        </h2>

        <p className="text-xs sm:text-sm text-gray-500">
          {form.branch} | Section {form.section} | Group {form.group}
        </p>
      </div>

      {/* STATUS */}
      <div className="bg-gray-50 p-3 rounded-lg text-sm flex flex-wrap gap-2">
        <span className="font-semibold">Status:</span>
        <span className="text-blue-600">{form.status}</span>
      </div>

      {/* INTRODUCTION */}
      <div>
        <h3 className="font-semibold mb-2 text-sm sm:text-base">
          Introduction
        </h3>
        <p className="text-sm text-gray-700 leading-relaxed">
          {form.introduction}
        </p>
      </div>

      {/* PROJECT TRACK */}
      <div>
        <h3 className="font-semibold mb-2 text-sm sm:text-base">
          Project Track
        </h3>

        <div className="flex flex-wrap gap-2">
          {form.projectTrack?.map((track, i) => (
            <span
              key={i}
              className="bg-blue-100 text-blue-700 text-xs px-3 py-1 rounded-full"
            >
              {track}
            </span>
          ))}
        </div>
      </div>

      {/* TOOLS */}
      <div>
        <h3 className="font-semibold mb-3 text-sm sm:text-base">
          Tools & Technologies
        </h3>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {form.toolsTechnologies?.map((tool, i) => (
            <div
              key={i}
              className="border rounded-xl p-3 bg-gray-50 text-sm hover:shadow-md transition"
            >
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
      </div>

      {/* MODULES */}
      <div>
        <h3 className="font-semibold mb-3 text-sm sm:text-base">
          Proposed Modules
        </h3>

        <div className="grid sm:grid-cols-2 gap-4">
          {form.proposedModules?.map((module, i) => (
            <div
              key={i}
              className="border rounded-xl p-3 bg-gray-50 text-sm hover:shadow-md transition"
            >
              <p>
                <b>Module:</b> {module.name}
              </p>
              <p>
                <b>Function:</b> {module.functionality}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* TEAM MEMBERS */}
      <div>
        <h3 className="font-semibold mb-3 text-sm sm:text-base">
          Team Members
        </h3>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {form.teamMembers?.map((member, i) => (
            <div
              key={i}
              className="border rounded-xl p-3 bg-gray-50 text-sm hover:shadow-md transition"
            >
              <p>
                <b>Name:</b> {member.name}
              </p>
              <p className="break-all">
                <b>Email:</b> {member.email}
              </p>
              <p>
                <b>Roll No:</b> {member.rollNo}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* STUDENT + MENTOR */}
      <div className="grid sm:grid-cols-2 gap-4">
        {/* STUDENT */}
        <div className="border rounded-xl p-4 bg-gray-50 text-sm">
          <h3 className="font-semibold mb-2">Submitted By</h3>
          <p>
            <b>Name:</b> {form.studentId?.name}
          </p>
          <p className="break-all">
            <b>Email:</b> {form.studentId?.email}
          </p>
        </div>

        {/* MENTOR */}
        <div className="border rounded-xl p-4 bg-gray-50 text-sm">
          <h3 className="font-semibold mb-2">Mentor Info</h3>
          <p>
            <b>Mentor:</b> {form.mentorName}
          </p>
          <p>
            <b>Lab Coordinator:</b> {form.labCoordinatorName}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Form1Head;
