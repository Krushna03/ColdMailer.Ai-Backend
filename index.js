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

let isConnected = false

connectDB()
  .then(() => {
    isConnected = true
    console.log(`Server is running at Port : ${process.env.PORT}`);
  })
  .catch((error) => {
    console.log('MongoDBconnection failed !!!', error)
  })


export default serverless(app);