import axios from "axios";

const baseURL =
  process.env.REACT_APP_MODE === "PRO"
    ? "https://freelanceme-backend.onrender.com" // Production URL
    : "http://localhost:4000"; // Development URL

console.log('mode', process.env.REACT_APP_MODE);
console.log('baseURL', baseURL);

export const axiosInstance = axios.create({
  // baseURL: "http://localhost:4000",
  // baseURL: 'https://freelanceme-backend.onrender.com',
  baseURL,
  withCredentials: true,
});
