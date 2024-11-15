// server.js
import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import mongoose from 'mongoose';
import userAccount from './routes/accountRoutes.js';
import videoRouter from './routes/videoRoutes.js';

// Load environment variables
dotenv.config();

// Database connection function
const connectDB = async () => {
    try {
        const connectionInstance = await mongoose.connect(`mongodb+srv://piyushsahare163:8UXscFWMYu2L97ws@cluster0.1h3zo.mongodb.net/final`);
        console.log(`MongoDB connected !! DB HOST : ${connectionInstance.connection.host}`);
    } catch (error) {
        console.error("Error connecting to database:", error);
        process.exit(1); // Exit the process with failure
    }
};

// Initialize Express app
const app = express();

// Middlewares
app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
}));
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());


// Route definitions
app.use("/api/v1/account", userAccount);
app.use("/api/v1/videos", videoRouter);

// Start the server after connecting to the database
connectDB()
    .then(() => {
        app.listen(process.env.PORT || 8000, () => {
            console.log(`Server is running at port : ${process.env.PORT || 8000}`);
        });
    })
    .catch((err) => {
        console.error("Error starting the server:", err);
    });
