import express from 'express';
import cors from 'cors';
import config from './config/config.js';
import cookieParser from 'cookie-parser';
import errorMiddleware from './middleware/error.middleware.js';
import authRoutes from './routes/auth.routes.js';
import conversationRoutes from './routes/conversation.routes.js';


const app = express();

app.use(cors({
    origin: config.CLIENT_URL,
    credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/conversations", conversationRoutes)
app.get("/api/v1/health", (req, res) => {
    return res.status(200).json({
        success: true,
        message: "Server's health is fine."
    })
})
app.use(errorMiddleware)

export default app