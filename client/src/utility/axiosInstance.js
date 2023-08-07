import axios from "axios";

export const axiosInstance = axios.create({
    baseURL: "http://localhost:4000",
    // baseURL: 'https://feelance-me-backend.vercel.app',
    withCredentials: true,
});
