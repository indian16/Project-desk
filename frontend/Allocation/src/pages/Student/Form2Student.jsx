import React, { useState, useEffect } from "react";
import { saveForm2, getForm2ByProject } from "../../services/studentService";

const Form2Student = () => {
  const [formData, setFormData] = useState({
    member: "Member ",
    moduleName: "",
    functionalityName: "",
    softDeadline: "",
    hardDeadline: "",
    details: "",
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchForm = async () => {
      try {
        const res = await getForm2ByProject();
        if (res?.form) setFormData(res.form);
      } catch (err) {
        console.error(err);
      }
    };
    fetchForm();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await saveForm2(formData);
      alert("Form 2 submitted successfully!");
    } catch (err) {
      console.error(err);
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto mt-10 p-8 bg-white shadow-lg rounded-2xl border border-gray-200">
      <h2 className="text-2xl font-semibold text-center mb-6 text-gray-800">
        Form 2 — Member Details
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-gray-700 font-medium mb-1">Member</label>
          <input
            type="text"
            name="member"
            value={formData.member}
            onchange={handleChange}
            required
            className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-gray-100 cursor-not-allowed"
          />
        </div>

        <div>
          <label className="block text-gray-700 font-medium mb-1">
            Name of Module
          </label>
          <input
            type="text"
            name="moduleName"
            value={formData.moduleName}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        <div>
          <label className="block text-gray-700 font-medium mb-1">
            Name of Functionality
          </label>
          <input
            type="text"
            name="functionalityName"
            value={formData.functionalityName}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        <div>
          <label className="block text-gray-700 font-medium mb-1">
            Soft Deadline
          </label>
          <input
            type="date"
            name="softDeadline"
            value={formData.softDeadline}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        <div>
          <label className="block text-gray-700 font-medium mb-1">
            Hard Deadline
          </label>
          <input
            type="date"
            name="hardDeadline"
            value={formData.hardDeadline}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        <div>
          <label className="block text-gray-700 font-medium mb-1">
            Details of Functionality (Story)
          </label>
          <textarea
            name="details"
            value={formData.details}
            onChange={handleChange}
            rows="5"
            required
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        <div className="text-center">
          <button
            type="submit"
            disabled={loading}
            className={`px-6 py-2 rounded-lg font-medium text-white transition ${
              loading
                ? "bg-blue-300 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {loading ? "Submitting..." : "Submit"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Form2Student;
