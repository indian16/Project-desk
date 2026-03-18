import React, { useEffect, useState } from "react";
import { getHeadProjectForm } from "../../services/headService";

const Form2Head = ({ projectId }) => {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(null);

  const fetchForm2 = async () => {
    setLoading(true);

    try {
      const res = await getHeadProjectForm("form2", projectId);

      if (res.success && res.data) {
        setMembers(res.data.members || []);
      }
    } catch (err) {
      console.error("Error loading Form2", err);
    } finally {
      setLoading(false);
    }
  };

  const toggleStudent = (index) => {
    setExpanded(expanded === index ? null : index);
  };

  useEffect(() => {
    if (projectId) fetchForm2();
  }, [projectId]);

  if (loading)
    return (
      <p className="text-gray-500 text-center py-6">
        Loading Form2 submissions...
      </p>
    );

  if (!members.length)
    return (
      <p className="text-gray-500 text-center py-6">
        No Form2 submissions yet.
      </p>
    );

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <h2 className="text-2xl font-bold text-indigo-700">Form 2 Submissions</h2>

      {members.map((member, index) => (
        <div
          key={member.studentId?._id}
          className="border rounded-xl shadow-sm bg-white"
        >
          {/* STUDENT HEADER */}
          <div
            onClick={() => toggleStudent(index)}
            className="cursor-pointer flex justify-between items-center p-4 bg-indigo-50 rounded-t-xl"
          >
            <div>
              <p className="font-semibold text-indigo-700">
                👤 {member.studentId?.name || "Unknown Student"}
              </p>

              <p className="text-sm text-gray-500">{member.studentId?.email}</p>
            </div>

            <div className="flex items-center gap-3">
              {/* STATUS */}
              {member.approvedByMentor ? (
                <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm">
                  Approved ✔
                </span>
              ) : (
                <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-sm">
                  Pending
                </span>
              )}

              <span>{expanded === index ? "▲" : "▼"}</span>
            </div>
          </div>

          {/* EXPANDED MODULES */}
          {expanded === index && (
            <div className="p-5 space-y-4">
              {member.modules?.map((module, mIndex) => (
                <div key={mIndex} className="border rounded-lg p-4 bg-gray-50">
                  <div className="grid md:grid-cols-2 gap-4 text-sm">
                    <p>
                      <span className="font-semibold text-gray-700">
                        Module:
                      </span>{" "}
                      {module.moduleName}
                    </p>

                    <p>
                      <span className="font-semibold text-gray-700">
                        Functionality:
                      </span>{" "}
                      {module.functionalityName}
                    </p>

                    <p>
                      <span className="font-semibold text-gray-700">
                        Soft Deadline:
                      </span>{" "}
                      {module.softDeadline
                        ? new Date(module.softDeadline).toLocaleDateString()
                        : "-"}
                    </p>

                    <p>
                      <span className="font-semibold text-gray-700">
                        Hard Deadline:
                      </span>{" "}
                      {module.hardDeadline
                        ? new Date(module.hardDeadline).toLocaleDateString()
                        : "-"}
                    </p>
                  </div>

                  <p className="mt-3">
                    <span className="font-semibold text-gray-700">
                      Details:
                    </span>{" "}
                    {module.details}
                  </p>
                </div>
              ))}

              {/* APPROVAL INFO */}
              {member.approvedByMentor && (
                <div className="pt-3 border-t text-green-700 font-semibold">
                  Approved by {member.mentorName}
                  <div className="text-sm text-gray-500">
                    {new Date(member.approvedAt).toLocaleDateString()}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default Form2Head;
