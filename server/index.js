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
const app = express();
dotenv.config();

app.use(bodyParser.json({limit: "5gb"}));
app.use(bodyParser.urlencoded({extended: true}));
app.use(cors());
app.use(express.json());
app.use(cookieParser());
app.use(passport.initialize());
app.use(fileUpload());

app.use(session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie:{
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
app.use('/', userRoutes);
app.use('/', gigRoutes);
app.use('/', orderRoutes);
// Middleware for Errors
app.use(errorMiddleware);


cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret:  process.env.CLOUDINARY_API_SECERET
})

// Database Connection
let server;
mongoose.connect(process.env.CONNECTION_URL, {useUnifiedTopology: true})
    .then(server = () => app.listen(process.env.PORT, ()=>{
        console.log("server is running on port " + process.env.PORT);
    }))
    .catch(err => {
        console.log(err);
    });


// Handling Unhandled Rejection Error
process.on('unhandledRejection', (err) => {
    console.log(`Error: ${err.message}`);
    console.log("Shutting down the server due to Unhandled Promise Rejection");

    server.close(() => {
        process.exit(1);
    })
})


