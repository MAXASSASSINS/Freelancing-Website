import axios from "axios";

export const axiosInstance = axios.create({
    baseURL: "http://localhost:4000",
    // baseURL: 'https://freelance-me-backend.vercel.app',
    // baseURL: 'https://freelanceme-backend.onrender.com',
    withCredentials: true,
});
