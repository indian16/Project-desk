// import React, { useEffect, useState } from "react";
// import { getAssignedForms, updateMentorMarks } from "../../services/mentorService";

// const Form3Mentor = () => {
//   const [forms, setForms] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchForms = async () => {
//       try {
//         const data = await getAssignedForms();
//         setForms(data);
//       } catch (err) {
//         console.error("Error fetching assigned forms:", err);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchForms();
//   }, []);

//   const handleMarksChange = (formId, weekNumber, value) => {
//     setForms(forms.map(f => ({
//       ...f,
//       weeks: f.weeks.map(w => w.weekNumber === weekNumber ? { ...w, mentorMarks: value } : w)
//     })));
//   };

//   const handleSubmitMarks = async (formId, weekNumber, marks) => {
//     try {
//       await updateMentorMarks(formId, weekNumber, marks);
//       alert("Marks updated successfully");
//     } catch (err) {
//       console.error("Error updating marks:", err);
//     }
//   };

//   if (loading) return <p className="text-gray-500">Loading Form3 submissions...</p>;
//   if (!forms.length) return <p className="text-gray-500">No Form3 submissions found.</p>;

//   return (
//     <div className="p-6 space-y-6">
//       {forms.map(form => (
//         <div key={form._id} className="bg-white shadow-md rounded-lg p-6">
//           <h3 className="text-lg font-semibold text-gray-700">Student: {form.studentId.name}</h3>
//           <h4 className="text-md font-medium text-gray-600 mb-4">Project: {form.projectId.title}</h4>

//           <div className="space-y-4">
//             {form.weeks.map(week => (
//               <div key={week.weekNumber} className="border-l-4 border-indigo-500 pl-4 bg-indigo-50 p-4 rounded-md">
//                 <h5 className="text-md font-semibold mb-2">Week {week.weekNumber}</h5>
//                 <p><span className="font-medium">Functionality:</span> {week.functionality}</p>
//                 <p><span className="font-medium">Progress:</span> {week.progress}%</p>
//                 <p><span className="font-medium">Task:</span> {week.taskDetails}</p>

//                 <div className="mt-2 flex items-center space-x-2">
//                   <input
//                     type="number"
//                     min={0}
//                     max={10}
//                     value={week.mentorMarks ?? ""}
//                     onChange={e => handleMarksChange(form._id, week.weekNumber, e.target.value)}
//                     className="border border-gray-300 rounded-md p-1 w-20 focus:ring-2 focus:ring-indigo-400"
//                   />
//                   <button
//                     onClick={() => handleSubmitMarks(form._id, week.weekNumber, week.mentorMarks)}
//                     className="bg-indigo-600 text-white px-3 py-1 rounded-md hover:bg-indigo-700 transition"
//                   >
//                     Submit Marks
//                   </button>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>
//       ))}
//     </div>
//   );
// };

// export default Form3Mentor;