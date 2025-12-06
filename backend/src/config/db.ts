import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    const uri = process.env.MONGO_URI;
    
    if (!uri) {
      throw new Error("Missing MONGO_URI in .env");
    }

    const conn = await mongoose.connect(uri);

    console.log(` MongoDB connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(" MongoDB connection error:", error);
    process.exit(1);
  }
};
