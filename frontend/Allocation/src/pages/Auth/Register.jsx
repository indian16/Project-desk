// import React, { useState } from "react";
// import { registerHead } from "../../services/headService";

// const Register = () => {
//   const [formData, setFormData] = useState({
//     name: "",
//     email: "",
//     password: "",
//   });

//   const [loading, setLoading] = useState(false);

//   const handleChange = (e) => {
//     setFormData({
//       ...formData,
//       [e.target.name]: e.target.value,
//     });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);

//     try {
//       const data = await registerHead(formData);
//       alert(data.message);

//       // Clear form after success
//       setFormData({
//         name: "",
//         email: "",
//         password: "",
//       });

//     } catch (error) {
//       alert(error.response?.data?.message || "Error");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="p-8">
//       <div className="max-w-md mx-auto bg-white shadow-lg rounded-2xl p-8 border border-slate-200">

//         <h2 className="text-2xl font-bold text-slate-900 mb-6">
//           Register New Head
//         </h2>

//         <form onSubmit={handleSubmit} className="space-y-5">

//           <div>
//             <label className="block text-sm font-semibold text-slate-700 mb-1">
//               Name
//             </label>
//             <input
//               type="text"
//               name="name"
//               value={formData.name}
//               onChange={handleChange}
//               placeholder="Enter Name"
//               required
//               className="w-full px-4 py-2 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
//             />
//           </div>

//           <div>
//             <label className="block text-sm font-semibold text-slate-700 mb-1">
//               Email
//             </label>
//             <input
//               type="email"
//               name="email"
//               value={formData.email}
//               onChange={handleChange}
//               placeholder="Enter Email"
//               required
//               className="w-full px-4 py-2 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
//             />
//           </div>

//           <div>
//             <label className="block text-sm font-semibold text-slate-700 mb-1">
//               Password
//             </label>
//             <input
//               type="password"
//               name="password"
//               value={formData.password}
//               onChange={handleChange}
//               placeholder="Enter Password"
//               required
//               className="w-full px-4 py-2 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
//             />
//           </div>

//           <button
//             type="submit"
//             disabled={loading}
//             className="w-full bg-indigo-600 text-white py-2 rounded-xl font-semibold hover:bg-indigo-700 transition-all disabled:opacity-50"
//           >
//             {loading ? "Registering..." : "Register Head"}
//           </button>

//         </form>
//       </div>
//     </div>
//   );
// };

// export default Register;

import React, { useState } from "react";
import { registerHead } from "../../services/headService";
import { User, Mail, Lock, Loader2 } from "lucide-react";

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const getPasswordStrength = () => {
    const pwd = formData.password;
    if (pwd.length > 10) return { label: "Strong", color: "text-green-500" };
    if (pwd.length > 6) return { label: "Medium", color: "text-yellow-500" };
    if (pwd.length > 0) return { label: "Weak", color: "text-red-400" };
    return null;
  };

  const strength = getPasswordStrength();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccess("");

    try {
      const data = await registerHead(formData);

      setSuccess("Head registered successfully ✔");

      setFormData({
        name: "",
        email: "",
        password: "",
      });
    } catch (error) {
      alert(error.response?.data?.message || "Error registering head");
    } finally {
      setLoading(false);
    }
  };

  const inputStyle =
    "w-full pl-11 pr-4 py-2.5 text-sm bg-white border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition";

  return (
    <div className="flex justify-center items-start pt-12 px-6">
      {" "}
      <div className="w-full max-w-lg bg-white border border-slate-200 rounded-2xl shadow-sm p-8">
        {/* HEADER */}
        <div className="mb-6">
          <h3 className="text-lg font-black text-slate-900 tracking-tight">
            Register Department Head
          </h3>
          <p className="text-xs text-slate-400 mt-1 font-semibold">
            Create a new Head for Project Desk
          </p>
        </div>
        {success && (
          <div className="mb-5 text-xs font-bold text-green-600 bg-green-50 border border-green-200 px-3 py-2 rounded-lg">
            {success}
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* NAME */}
          <div>
            <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-2">
              Name
            </label>

            <div className="relative">
              <User
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter Head Name"
                required
                className={inputStyle}
              />
            </div>
          </div>

          {/* EMAIL */}
          <div>
            <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-2">
              Email
            </label>

            <div className="relative">
              <Mail
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter Email Address"
                required
                className={inputStyle}
              />
            </div>
          </div>

          {/* PASSWORD */}
          <div>
            <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-2">
              Password
            </label>

            <div className="relative">
              <Lock
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Create Password"
                required
                className={inputStyle}
              />
            </div>

            {strength && (
              <p className={`text-[10px] font-bold mt-1 ${strength.color}`}>
                Strength: {strength.label}
              </p>
            )}
          </div>

          {/* BUTTON */}
          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 flex items-center justify-center gap-2 bg-slate-900 text-white py-2.5 rounded-xl text-sm font-bold shadow-md hover:bg-black active:scale-[0.98] transition-all disabled:opacity-50"
          >
            {loading ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                Registering...
              </>
            ) : (
              "Register Head"
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Register;
