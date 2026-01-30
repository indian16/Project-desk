// src/pages/student/MentorList.jsx
import React, { useEffect, useState } from "react";
import { getMentorList } from "../../services/studentService";

const MentorList = () => {
  const [mentors, setMentors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchMentors = async () => {
      try {
        const data = await getMentorList();
        setMentors(data || []);
      } catch (err) {
        console.error(err);
        setError("Failed to fetch mentor list.");
      } finally {
        setLoading(false);
      }
    };

    fetchMentors();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <p className="text-slate-500 font-medium">Loading mentor list...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center py-20">
        <p className="text-red-500 font-semibold">{error}</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200">
      {/* Header */}
      <div className="px-6 py-4 border-b border-slate-200">
        <h2 className="text-xl font-semibold text-slate-800">
          Mentor List
        </h2>
        <p className="text-sm text-slate-500 mt-1">
          Available mentors for project guidance
        </p>
      </div>

      {/* Content */}
      <div className="p-6">
        {mentors.length === 0 ? (
          <div className="text-center py-10 text-slate-500">
            No mentors available at the moment.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-slate-100 text-slate-700">
                  <th className="px-4 py-3 text-left font-medium">Name</th>
                  <th className="px-4 py-3 text-left font-medium">Email</th>
                  <th className="px-4 py-3 text-left font-medium">
                    Designation
                  </th>
                  <th className="px-4 py-3 text-left font-medium">Expertise</th>
                  <th className="px-4 py-3 text-left font-medium">Mobile</th>
                </tr>
              </thead>

              <tbody>
                {mentors.map((mentor, index) => (
                  <tr
                    key={mentor._id || index}
                    className="border-b last:border-b-0 hover:bg-slate-50 transition"
                  >
                    <td className="px-4 py-3 font-medium text-slate-800">
                      {mentor.name}
                    </td>
                    <td className="px-4 py-3 text-slate-600">
                      {mentor.email}
                    </td>
                    <td className="px-4 py-3 text-slate-600">
                      {mentor.designation || "-"}
                    </td>
                    <td className="px-4 py-3 text-slate-600">
                      {mentor.expertise || "-"}
                    </td>
                    <td className="px-4 py-3 text-slate-600">
                      {mentor.mobile || "-"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default MentorList;
