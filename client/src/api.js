// client/src/api.js
import axios from "axios";


const isLocalhost =
  typeof window !== "undefined" && window.location.hostname === "localhost";

const api = axios.create({
  baseURL: isLocalhost
    ? "http://localhost:5000/api"                         
    : "https://project-lms-lhlq.onrender.com/api",        
  withCredentials: true, 
});


api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
