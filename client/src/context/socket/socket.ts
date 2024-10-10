import { createContext } from "react";
import { io, Socket } from "socket.io-client";
import Cookies from "js-cookie";
import { baseURL } from "../../utility/axiosInstance";

// export const socket = io("");
export const socket = io(baseURL, {
  auth: {
    token: Cookies.get("token"),
  }
});
// export const socket = io("https://freelanceme-backend.onrender.com/");
export const SocketContext = createContext<Socket>(socket);
