// src/services/authService.js
import api from "../utils/axios";

//const API = "https://project-desk-backend.onrender.com/api"; // adjust if backend base changes

// ✅ Login
// export const login = async (formData) => {
//   try {
//     const response = await axios.post(`${API}/auth/login`, formData);
//     // backend should return { token, user }
//     return response.data;
//   } catch (err) {
//     throw err.response?.data || { message: "Login failed. Try again." };
//   }
// };

export const login = async (formData) => {
  try {
    const response = await api.post("/auth/login", formData);
    return response.data;
  } catch (err) {
    throw err.response?.data || { message: "Login failed. Try again." };
  }
};


