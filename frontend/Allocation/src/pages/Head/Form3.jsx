import React, { useState, useEffect } from "react";
import {
  createForm3ForAllProjects,
  getForm3,
  deleteForm3,
} from "../../services/headService";

/* ---------------- ALERT MODAL ---------------- */
const AlertModal = ({ message, type, onClose }) => {
  if (!message) return null;
  const bgColor = type === "success" ? "bg-green-100" : "bg-red-100";
  const borderColor = type === "success" ? "border-green-500" : "border-red-500";
  const textColor = type === "success" ? "text-green-800" : "text-red-800";
  const icon = type === "success" ? "✅" : "❌";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900 bg-opacity-50 backdrop-blur-sm">
      <div
        className={`p-6 rounded-xl shadow-2xl w-full max-w-sm border-l-4 ${bgColor} ${borderColor}`}
      >
        <div className="flex justify-between items-start">
          <div className="flex items-center">
            <span className="text-2xl mr-3">{icon}</span>
            <p className={`font-semibold ${textColor}`}>{message}</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-800 transition p-1 rounded-full"
          >
            ✕
          </button>
        </div>
      </div>
    </div>
  );
};

/* ---------------- FORM 3 ---------------- */
const Form3 = () => {
  const [weeks, setWeeks] = useState([{ weekNumber: 1, fromDate: "", toDate: "" }]);
  const [loading, setLoading] = useState(false);
  const [modal, setModal] = useState({ show: false, message: "", type: "error" });

  const academicYear = "2025-2026"; // example, can be dynamic

  /* ----------- FETCH EXISTING DATA ----------- */
  useEffect(() => {
    const fetchForm3 = async () => {
      try {
        const res = await getForm3(academicYear);
        if (res && res.weeks?.length > 0) {
          const formattedWeeks = res.weeks.map((w) => ({
            weekNumber: w.weekNumber,
            fromDate: new Date(w.fromDate).toISOString().split("T")[0],
            toDate: new Date(w.toDate).toISOString().split("T")[0],
          }));
          setWeeks(formattedWeeks);
        }
      } catch (err) {
        console.error("Error fetching Form3 data:", err);
      }
    };
    fetchForm3();
  }, [academicYear]);

  /* ----------- HANDLERS ----------- */
  const handleChange = (index, field, value) => {
    const updated = [...weeks];
    updated[index][field] = value;
    setWeeks(updated);
  };

  const addWeek = () => {
    setWeeks((prev) => [...prev, { weekNumber: prev.length + 1, fromDate: "", toDate: "" }]);
  };

  const removeWeek = async (index) => {
    const weekNumber = weeks[index].weekNumber;
    const updatedWeeks = weeks.filter((_, i) => i !== index).map((w, i) => ({ ...w, weekNumber: i + 1 }));
    setWeeks(updatedWeeks);

    try {
      await deleteForm3(academicYear, weekNumber);
      setModal({ show: true, message: `Week ${weekNumber} deleted successfully`, type: "success" });
    } catch (err) {
      console.error("Error deleting week:", err);
      setModal({ show: true, message: `Failed to delete Week ${weekNumber}`, type: "error" });
      setWeeks(weeks); // rollback UI
    }
  };

  const closeModal = () => setModal({ show: false, message: "", type: "error" });

  const handleSubmit = async () => {
    for (let w of weeks) {
      if (!w.fromDate || !w.toDate) {
        setModal({ show: true, message: `Please fill both dates for Week ${w.weekNumber}`, type: "error" });
        return;
      }
    }

    setLoading(true);
    try {
      const payload = weeks.map((w) => ({
        weekNumber: w.weekNumber,
        fromDate: new Date(w.fromDate),
        toDate: new Date(w.toDate),
      }));
      const res = await createForm3ForAllProjects(academicYear, payload);
      setModal({ show: true, message: res.message, type: "success" });
    } catch (err) {
      console.error(err);
      setModal({ show: true, message: "Error submitting dates", type: "error" });
    }
    setLoading(false);
  };

  /* ---------------- UI ---------------- */
  return (
    <>
      <div className="p-8 bg-gray-50 min-h-full rounded-xl shadow-2xl border-t-4 border-indigo-600">
        <h2 className="text-4xl font-extrabold text-indigo-700 mb-2">Project Timeline Setup</h2>
        <p className="text-gray-500 mb-8">Add or remove weeks and define timelines for all projects.</p>

        {/* Weeks Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {weeks.map((week, index) => (
            <div key={index} className="p-5 bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all transform hover:scale-[1.02]">
              <div className="flex justify-between items-center border-b pb-2 mb-4">
                <h3 className="text-lg font-bold text-gray-800">Week {week.weekNumber}</h3>
                {weeks.length > 1 && (
                  <button
                    onClick={() => removeWeek(index)}
                    className="text-red-500 hover:text-red-700 font-bold"
                    title="Remove Week"
                  >
                    ✖
                  </button>
                )}
              </div>

              <div className="flex flex-col gap-4">
                <label className="flex flex-col">
                  <span className="text-sm font-medium text-gray-600">From Date</span>
                  <input
                    type="date"
                    value={week.fromDate}
                    onChange={(e) => handleChange(index, "fromDate", e.target.value)}
                    className="border border-gray-300 px-3 py-2 rounded-lg focus:ring-4 focus:ring-indigo-300 focus:border-indigo-500 outline-none"
                  />
                </label>
                <label className="flex flex-col">
                  <span className="text-sm font-medium text-gray-600">To Date</span>
                  <input
                    type="date"
                    value={week.toDate}
                    onChange={(e) => handleChange(index, "toDate", e.target.value)}
                    className="border border-gray-300 px-3 py-2 rounded-lg focus:ring-4 focus:ring-indigo-300 focus:border-indigo-500 outline-none"
                  />
                </label>
              </div>
            </div>
          ))}
        </div>

        {/* Add Week */}
        <div className="flex justify-center mt-8">
          <button
            onClick={addWeek}
            className="px-6 py-3 rounded-full font-bold text-indigo-600 border-2 border-indigo-600 hover:bg-indigo-600 hover:text-white transition shadow-md"
          >
            ➕ Add Week
          </button>
        </div>

        {/* Submit */}
        <div className="flex justify-center mt-10">
          <button
            onClick={handleSubmit}
            disabled={loading}
            className={`px-10 py-4 rounded-full font-extrabold text-white shadow-xl transition-all ${
              loading ? "bg-gray-500" : "bg-gradient-to-r from-indigo-600 to-blue-500 hover:scale-105"
            }`}
          >
            {loading ? "Processing..." : "Commit Week Dates"}
          </button>
        </div>
      </div>

      {/* Alert Modal */}
      {modal.show && <AlertModal message={modal.message} type={modal.type} onClose={closeModal} />}
    </>
  );
};

export default Form3;
