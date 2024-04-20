import axios from "axios";

const baseURL =
  process.env.MODE === "PROD"
    ? "https://freelanceme-backend.onrender.com" // Production URL
    : "http://localhost:4000"; // Development URL

export const axiosInstance = axios.create({
  baseURL: "http://localhost:4000",
  // baseURL: 'https://freelanceme-backend.onrender.com',
  // baseURL,
  withCredentials: true,
});
