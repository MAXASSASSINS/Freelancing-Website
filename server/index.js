import express from 'express'
import bodyParser from 'body-parser'
import mongoose from 'mongoose'
import cors from 'cors'
import dotenv from 'dotenv'
import errorMiddleware from './middleware/error.js'
import cookieParser from 'cookie-parser'
import passport from 'passport'
import session from 'express-session'
import cloudinary from 'cloudinary'
import fileUpload from 'express-fileupload'
import { Socket, Server } from 'socket.io'
import http from 'http'
import { runSocket } from './utils/socket.js'

const app = express();
dotenv.config();

app.use(bodyParser.json({ limit: "5gb" }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
app.use(express.json());
app.use(cookieParser());
app.use(passport.initialize());
app.use(fileUpload());

app.use(session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        // secure: true
    }
}));

// Handling Uncaught Exception Error
process.on('uncaughtException', (err) => {
    console.log(`Error: ${err.message}`);
    console.log("Shutting down the server due to Uncaught Exception Error");
    process.exit(1);
})



// Route Imports
import userRoutes from './routes/user.js';
import gigRoutes from './routes/gig.js'
import orderRoutes from './routes/order.js'
import messageRoutes from './routes/message.js'

app.use('/', userRoutes);
app.use('/', gigRoutes);
app.use('/', orderRoutes);
app.use('/', messageRoutes);


// Middleware for Errors
app.use(errorMiddleware);


cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECERET
})

// Database Connection
export let server = http.createServer(app);
mongoose.connect(process.env.CONNECTION_URL, { useUnifiedTopology: true })
    .then(server.listen(process.env.PORT, () => {
        console.log("server is running on port " + process.env.PORT);
        return server;
    }))
    .catch(err => {
        console.log(err);
    });

// Calling socket to run
runSocket(server);


// const io = new Server(server, {
//     cors: {
//         origin: "http://localhost:3000",
//         methods: ["GET", "POST"],
//     }
// })


// // io.on means we are listening for an event name connection
// io.on('connection', (socket) => {
//     console.log(socket.id);
//     console.log(io.engine.clientsCount);

//     socket.on("join_room", (data) => {
//         socket.join(data);
//         // console.log(`user with id ${socket.id} joined room ${data}`);
//     })

//     socket.on("send_message", (data) => {

//         socket.to(data.room).emit("receive_message", (data));
//         // socket.to(data.room).emit("receive-message", data);
//         // console.log(data);
//     })

//     socket.on('disconnect', () => {
//         console.log("user disconnected", socket.id);
//     })


// })


// Handling Unhandled Rejection Error
process.on('unhandledRejection', (err) => {
    console.log(`Error: ${err.message}`);
    console.log("Shutting down the server due to Unhandled Promise Rejection");

    server.close(() => {
        process.exit(1);
    })
})


