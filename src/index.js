import { GoogleGenerativeAI } from "@google/generative-ai";
import { app } from './app.js'
import dotenv from 'dotenv'
import connectDB from './databse/db.js'
import { OAuth2Client } from 'google-auth-library';
import serverless from 'serverless-http';

dotenv.config({
  path: "./.env"
})


export const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const geminiapiKey = process.env.GEMINIAPIKEY;
const genAI = new GoogleGenerativeAI(geminiapiKey);

export const model = genAI.getGenerativeModel({
  model: "gemini-2.0-flash",
  generationConfig: {
    maxOutputTokens: 1000,
    temperature: 0.3,
  }
});


app.get("/", async (req, res) => {
  try {
    await connectDB();
    res.send("Hello from serverless!");
  } catch (error) {
    console.error("Error on root route:", error);
    res.status(500).send("Server error");
  }
});

export default serverless(app);