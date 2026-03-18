import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login as loginService } from "../../services/authService";
import { useAuth } from "../../hooks/useAuth";

const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const data = await loginService(formData);

      if (!data?.token || !data?.user?.role) {
        throw new Error("Invalid server response");
      }

      login(data.user, data.token);

      const role = data.user.role.toLowerCase();
      if (role === "student") {
        navigate("/student/StudentDashboard", { replace: true });
      } else if (role === "mentor") {
        navigate("/mentor/MentorDashboard", { replace: true });
      } else if (role === "head") {
        navigate("/head/HeadDashboard", { replace: true });
      } else {
        setError("Unknown role.");
      }
    } catch (err) {
      console.error("Login error:", err.response?.data || err.message);
      setError(
        err.response?.data?.message ||
          "Invalid credentials or server error."
      );
    }
  };

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-gradient-to-br from-cyan-400 to-blue-600">
      
      {/* 🔥 MOBILE TITLE (only visible on small screens) */}
      <div className="block lg:hidden text-center mt-10 px-4">
        <h1 className="text-white text-4xl sm:text-5xl font-extrabold drop-shadow-lg animate-fadeInRight">
          PROJECT DESK
        </h1>
      </div>

      {/* LEFT - FORM */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-4 py-10">
        <div className="w-full max-w-md p-6 sm:p-8 md:p-10 bg-white rounded-3xl shadow-2xl">
          
          <h2 className="text-2xl sm:text-3xl font-bold text-center text-gray-800 mb-6">
            Login
          </h2>

          {error && (
            <p className="text-red-600 text-center mb-4 font-medium animate-shake text-sm sm:text-base">
              {error}
            </p>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-4 focus:ring-cyan-400 transition shadow-sm text-sm sm:text-base"
            />

            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-4 focus:ring-cyan-400 transition shadow-sm text-sm sm:text-base"
            />

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 text-white py-3 rounded-xl hover:scale-105 hover:shadow-xl transition duration-300 font-semibold text-sm sm:text-base"
            >
              Login
            </button>
          </form>
        </div>
      </div>

      {/* RIGHT SIDE (only desktop) */}
      <div className="hidden lg:flex w-1/2 items-center justify-center px-4 py-10">
        <h1 className="text-white text-7xl xl:text-8xl font-extrabold drop-shadow-lg animate-fadeInRight text-center">
          PROJECT DESK
        </h1>
      </div>

      {/* ANIMATIONS */}
      <style>{`
        @keyframes fadeInRight {
          0% { transform: translateX(100px); opacity: 0; }
          100% { transform: translateX(0); opacity: 1; }
        }
        .animate-fadeInRight { animation: fadeInRight 1s ease-out forwards; }

        @keyframes shake {
          0%,100% { transform: translateX(0); }
          20%,60% { transform: translateX(-8px); }
          40%,80% { transform: translateX(8px); }
        }
        .animate-shake { animation: shake 0.5s ease; }
      `}</style>
    </div>
  );
};

export default Login;