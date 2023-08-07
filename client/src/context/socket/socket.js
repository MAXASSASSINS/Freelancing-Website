import React, { createContext } from "react";
import { io } from "socket.io-client";

// export const socket = io.connect("http://localhost:4000");
export const socket = io.connect("https://freelanceme-backend.onrender.com/");
export const SocketContext = createContext();
