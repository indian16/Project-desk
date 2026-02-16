// // frontend/Allocation/src/utils/axios.js
// import axios from "axios";

// const instance = axios.create({
//   baseURL: "https://project-desk-backend.onrender.com/api", // make sure this exactly matches Postman URL
// });

// instance.interceptors.request.use((config) => {
//   const token = localStorage.getItem("token");
//   if (token) config.headers.Authorization = `Bearer ${token}`;
//   return config;
// });

// export default instance;\

// frontend/Allocation/src/utils/axios.js
import axios from "axios";

const instance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

instance.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default instance;

