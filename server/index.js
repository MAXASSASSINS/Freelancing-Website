import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import errorMiddleware from "./middleware/error.js";
import cookieParser from "cookie-parser";
import passport from "passport";
import session from "express-session";
import cloudinary from "cloudinary";
import { Socket, Server } from "socket.io";
import http from "http";
import { runSocket } from "./utils/socket.js";
import path from "path";
import { fileURLToPath } from 'url';

const app = express();
dotenv.config();

app.use(bodyParser.json({ limit: "5gb" }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());


const __filename = fileURLToPath(import.meta.url); // get the resolved path to the file
const __dirname = path.dirname(__filename); // get the name of the directory
app.use(express.static(path.join(__dirname, 'public')));

app.set("view engine", "ejs");

const allowedOrigins = [
  /frontend.*\.vercel\.app$/, // Matches URLs of the specified pattern
  /localhost:\d+$/, // Matches localhost with any port number
];

app.use(
  cors({
    origin: function (origin, callback) {
      // Check if the origin matches any of the allowed origins
      if (!origin || allowedOrigins.some(pattern => pattern.test(origin))) {
        callback(null, true); // Allow the request
      } else {
        callback(new Error('Not allowed by CORS')); // Deny the request
      }
    },
    // allowedHeaders:
    //   "Origin, X-Api-Key, X-Requested-With, Content-Type, Accept, Authorization",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
  })
);

// app.use(function (req, res, next){
//   console.log('origin', req.headers.origin)
//   res.set('Access-Control-Allow-Origin', req.headers.origin);
//   res.set("Access-Control-Allow-Credentials", true);
//   res.set("Access-Control-Allow-Methods", 'GET, POST, PUT, DELETE');
//   // res.header("Access-Control-Allow-Headers: Content-Type, *");
//   next();
// })

app.use(cookieParser());
app.use(passport.initialize());

app.use(
  session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
      // secure: true
    },
  })
);

// Handling Uncaught Exception Error
process.on("uncaughtException", (err) => {
  console.log(`Error: ${err.message}`);
  console.log("Shutting down the server due to Uncaught Exception Error");
  process.exit(1);
});

// Route Imports
import userRoutes from "./routes/user.js";
import gigRoutes from "./routes/gig.js";
import orderRoutes from "./routes/order.js";
import messageRoutes from "./routes/message.js";

app.use("/", userRoutes);
app.use("/", gigRoutes);
app.use("/", orderRoutes);
app.use("/", messageRoutes);

// Middleware for Errors
app.use(errorMiddleware);

// Cloudinary Config
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECERET,
});

// Database Connection
export let server = http.createServer(app);
mongoose
  .connect(process.env.CONNECTION_URL, { useUnifiedTopology: true })
  .then(
    server.listen(process.env.PORT || 4000, () => {
      console.log("server is running on port " + (process.env.PORT || 4000));
      return server;
    })
  )
  .catch((err) => {
    console.log(err);
  });

// Calling socket to run
runSocket(server);

// Handling Unhandled Rejection Error
process.on("unhandledRejection", (err) => {
  console.log(`Error: ${err.message}`);
  console.log("Shutting down the server due to Unhandled Promise Rejection");

  server.close(() => {
    process.exit(1);
  });
});
