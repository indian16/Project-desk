import React, { useState, useEffect } from "react";
import { saveForm2, getForm2ByProject } from "../../services/studentService";

const Form2Student = () => {
  const [students, setStudents] = useState([]);
  const [expandedStudent, setExpandedStudent] = useState(null);
  const [expandedModule, setExpandedModule] = useState({});
  const [loadingIndex, setLoadingIndex] = useState(null);
  const [toast, setToast] = useState({
    show: false,
    message: "",
    type: "success",
  });

  useEffect(() => {
    fetchForms();
  }, []);

  const fetchForms = async () => {
    try {
      const res = await getForm2ByProject();
      if (!res?.students) return;

      const membersMap = {};
      if (res.form2?.members) {
        res.form2.members.forEach((m) => {
          membersMap[m.studentId.toString()] = m;
        });
      }

      const formatted = res.students.map((student) => {
        const member = membersMap[student.studentId?.toString()];
        return {
          studentId: student.studentId,
          studentName: student.studentName,
          approvedByMentor: member?.approvedByMentor || false,
          mentorName: member?.mentorName || "",
          approvedAt: member?.approvedAt || null,
          modules:
            member?.modules?.length > 0
              ? member.modules.map((m) => ({
                  ...m,
                  softDeadline: m.softDeadline
                    ? new Date(m.softDeadline).toISOString().split("T")[0]
                    : "",
                  hardDeadline: m.hardDeadline
                    ? new Date(m.hardDeadline).toISOString().split("T")[0]
                    : "",
                }))
              : [
                  {
                    moduleName: "",
                    functionalityName: "",
                    softDeadline: "",
                    hardDeadline: "",
                    details: "",
                  },
                ],
        };
      });

      setStudents(formatted);
    } catch (err) {
      console.error(err);
    }
  };

  const toggleStudent = (index) => {
    setExpandedStudent((prev) => (prev === index ? null : index));
  };

  const toggleModule = (studentIndex, moduleIndex) => {
    const key = `${studentIndex}-${moduleIndex}`;
    setExpandedModule((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handleChange = (e, sIndex, mIndex) => {
    const { name, value } = e.target;
    setStudents((prev) => {
      const updated = [...prev];
      updated[sIndex].modules[mIndex][name] = value;
      return updated;
    });
  };

  const addModule = (sIndex) => {
    setStudents((prev) =>
      prev.map((student, index) =>
        index === sIndex
          ? {
              ...student,
              modules: [
                ...student.modules,
                {
                  moduleName: "",
                  functionalityName: "",
                  softDeadline: "",
                  hardDeadline: "",
                  details: "",
                },
              ],
            }
          : student,
      ),
    );
  };

  const deleteModule = (sIndex, mIndex) => {
    setStudents((prev) => {
      const updated = [...prev];
      if (updated[sIndex].modules.length === 1) {
        showToast("At least one module required", "error");
        return prev;
      }
      updated[sIndex].modules.splice(mIndex, 1);
      return updated;
    });
  };

  const showToast = (message, type = "success") => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: "", type }), 3000);
  };

  const handleSubmit = async (sIndex) => {
    const student = students[sIndex];
    setLoadingIndex(sIndex);

    try {
      await saveForm2({
        studentId: student.studentId,
        member: student.studentName,
        modules: student.modules,
      });
      showToast(`Modules saved for ${student.studentName}`, "success");
      fetchForms();
    } catch (err) {
      console.error(err);
      showToast(err.response?.data?.message || err.message, "error");
    } finally {
      setLoadingIndex(null);
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 md:p-10 bg-indigo-50 rounded-3xl shadow-lg space-y-6 relative">
      {/* Toast Notification */}
      {toast.show && (
        <div
          className={`fixed top-5 left-1/2 transform -translate-x-1/2 z-50 px-6 py-3 rounded-xl shadow-lg text-white font-semibold text-center max-w-sm w-full transition duration-300 ${
            toast.type === "success" ? "bg-green-500" : "bg-red-500"
          }`}
        >
          {toast.message}
        </div>
      )}

      <h2 className="text-2xl sm:text-3xl font-bold text-center text-indigo-800">
        Form 2 — Member Module Planning
      </h2>

      {students.map((student, sIndex) => (
        <div
          key={student.studentId}
          className="border rounded-lg bg-white shadow-md"
        >
          {/* Student Header */}
          <div
            onClick={() => toggleStudent(sIndex)}
            className="cursor-pointer p-4 bg-indigo-50 flex justify-between items-center rounded-t-lg"
          >
            <h3 className="font-semibold text-indigo-700 text-sm sm:text-base">
              👤 {student.studentName}{" "}
              <span className="ml-2 text-gray-500 text-xs sm:text-sm">
                ({student.modules.length} modules)
              </span>
            </h3>
            <span>{expandedStudent === sIndex ? "▲" : "▼"}</span>
          </div>

          {/* Student Content */}
          {expandedStudent === sIndex && (
            <div className="p-5 space-y-4">
              {/* Mentor Approval */}
              {student.approvedByMentor && (
                <div className="bg-green-100 text-green-700 p-3 rounded text-sm sm:text-base">
                  ✔ Approved by <b>{student.mentorName}</b> on{" "}
                  {new Date(student.approvedAt).toLocaleDateString()}
                </div>
              )}

              {student.modules.map((module, mIndex) => {
                const moduleKey = `${student.studentId}-${mIndex}`;
                return (
                  <div key={moduleKey} className="border rounded-lg bg-gray-50">
                    {/* Module Header */}
                    <div
                      onClick={() => toggleModule(sIndex, mIndex)}
                      className="cursor-pointer p-3 flex justify-between bg-gray-200 rounded-t-lg"
                    >
                      <span className="font-medium text-sm sm:text-base">
                        {module.moduleName || `Module ${mIndex + 1}`}
                      </span>
                      <span>
                        {expandedModule[`${sIndex}-${mIndex}`] ? "▲" : "▼"}
                      </span>
                    </div>

                    {/* Module Content */}
                    {expandedModule[`${sIndex}-${mIndex}`] && (
                      <div className="p-4 space-y-3">
                        <input
                          type="text"
                          name="moduleName"
                          placeholder="Module Name"
                          value={module.moduleName}
                          disabled={student.approvedByMentor}
                          onChange={(e) => handleChange(e, sIndex, mIndex)}
                          className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-indigo-300"
                        />
                        <input
                          type="text"
                          name="functionalityName"
                          placeholder="Functionality Name"
                          value={module.functionalityName}
                          disabled={student.approvedByMentor}
                          onChange={(e) => handleChange(e, sIndex, mIndex)}
                          className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-indigo-300"
                        />
                        <div className="grid grid-cols-2 gap-3">
                          <input
                            type="date"
                            name="softDeadline"
                            value={module.softDeadline}
                            disabled={student.approvedByMentor}
                            onChange={(e) => handleChange(e, sIndex, mIndex)}
                            className="border px-3 py-2 rounded"
                          />
                          <input
                            type="date"
                            name="hardDeadline"
                            value={module.hardDeadline}
                            disabled={student.approvedByMentor}
                            onChange={(e) => handleChange(e, sIndex, mIndex)}
                            className="border px-3 py-2 rounded"
                          />
                        </div>
                        <textarea
                          name="details"
                          rows="3"
                          placeholder="Module Details"
                          value={module.details}
                          disabled={student.approvedByMentor}
                          onChange={(e) => handleChange(e, sIndex, mIndex)}
                          className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-indigo-300 resize-none"
                        />

                        {!student.approvedByMentor && (
                          <button
                            onClick={() => deleteModule(sIndex, mIndex)}
                            className="bg-red-500 text-white px-3 py-1 rounded text-sm sm:text-base"
                          >
                            Delete Module
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}

              {/* Buttons */}
              {!student.approvedByMentor && (
                <div className="flex flex-col sm:flex-row gap-3 pt-2">
                  <button
                    onClick={() => addModule(sIndex)}
                    className="bg-green-600 text-white px-4 py-2 rounded w-full sm:w-auto"
                  >
                    + Add Module
                  </button>

                  <button
                    onClick={() => handleSubmit(sIndex)}
                    disabled={loadingIndex === sIndex}
                    className="bg-indigo-600 text-white px-4 py-2 rounded w-full sm:w-auto"
                  >
                    {loadingIndex === sIndex ? "Saving..." : "Submit Modules"}
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default Form2Student;
