import React, { useState, useEffect } from "react";
import { saveForm2, getForm2ByProject } from "../../services/studentService";

const Form2Student = () => {
  const [formData, setFormData] = useState({
    member: "",
    moduleName: "",
    functionalityName: "",
    softDeadline: "",
    hardDeadline: "",
    details: "",
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // 🔥 Get logged-in user name from localStorage
    const storedUser = JSON.parse(localStorage.getItem("user"));
    const userName = storedUser?.name || "Student";

    setFormData((prev) => ({
      ...prev,
      member: userName,
    }));

    const fetchForm = async () => {
      try {
        const res = await getForm2ByProject();
        if (res?.form) {
          setFormData(res.form);
        }
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
    <div className="bg-white border rounded-xl p-8 shadow-sm max-w-4xl mx-auto">
      <div className="mb-8 text-center">
        <h2 className="text-2xl font-semibold text-slate-800">
          Form 2 — Member Module Details
        </h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Member Name */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Member Name
          </label>
          <input
            type="text"
            name="member"
            value={formData.member}
            readOnly
            className="w-full border border-slate-300 rounded-lg px-4 py-2 bg-slate-100 text-slate-600"
          />
        </div>

        {/* Module Name */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Module Name
          </label>
          <input
            type="text"
            name="moduleName"
            value={formData.moduleName}
            onChange={handleChange}
            required
            className="w-full border border-slate-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>

        {/* Functionality Name */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Functionality Name
          </label>
          <input
            type="text"
            name="functionalityName"
            value={formData.functionalityName}
            onChange={handleChange}
            required
            className="w-full border border-slate-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>

        {/* Deadlines */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Soft Deadline
            </label>
            <input
              type="date"
              name="softDeadline"
              value={formData.softDeadline}
              onChange={handleChange}
              required
              className="w-full border border-slate-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Hard Deadline
            </label>
            <input
              type="date"
              name="hardDeadline"
              value={formData.hardDeadline}
              onChange={handleChange}
              required
              className="w-full border border-slate-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
        </div>

        {/* Details */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Functionality Details
          </label>
          <textarea
            name="details"
            value={formData.details}
            onChange={handleChange}
            rows="5"
            required
            className="w-full border border-slate-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none resize-none"
          />
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className={`w-full py-3 rounded-lg font-medium transition ${
            loading
              ? "bg-blue-300 text-white cursor-not-allowed"
              : "bg-blue-600 text-white hover:bg-blue-700"
          }`}
        >
          {loading ? "Submitting..." : "Submit Form 2"}
        </button>
      </form>
    </div>
  );
};

export default Form2Student;