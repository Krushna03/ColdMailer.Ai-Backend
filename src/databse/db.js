import mongoose from "mongoose";

let cachedConnection = null;

const connectDB = async () => {
  if (mongoose.connection.readyState === 1) {
    console.log("Using existing MongoDB connection");
    return;
  }
  
  if (mongoose.connection.readyState === 2) {
    console.log("MongoDB connection in progress");
    return new Promise(resolve => {
      mongoose.connection.once('connected', () => {
        console.log("Connected to MongoDB");
        resolve();
      });
    });
  }

  try {
    if (cachedConnection) {
      return cachedConnection;
    }
    const dbUri = `${process.env.MONGODB_URI}/coldmailer`;
    const connectionInstance = await mongoose.connect(dbUri, {
      serverSelectionTimeoutMS: 4000, 
      maxPoolSize: 10, 
    });

    cachedConnection = connectionInstance;
    console.log(`MongoDB connected: ${connectionInstance.connection.host}`);
    return connectionInstance;
  } catch (error) {
    console.error("MongoDB connection error:", error);
    throw error; 
  }
};

export default connectDB;