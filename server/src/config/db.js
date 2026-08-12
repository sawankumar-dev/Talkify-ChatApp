import mongoose from 'mongoose';
import config from './config.js';

export const connectDB = async function () {
    try {
        const connection =  await mongoose.connect(config.MONGODB_URI)
        console.log("DB connected successfully!")
    } catch (error) {
        console.log("MongoDB connection Error: ", error.message)
        process.exit(1)
    }
}