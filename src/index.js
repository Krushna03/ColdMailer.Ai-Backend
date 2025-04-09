import { GoogleGenerativeAI } from "@google/generative-ai";
import { app } from './app.js'
import dotenv from 'dotenv'
import connectDB from './databse/db.js'

dotenv.config({
  path: "./.env"
})


const geminiapiKey = process.env.GEMINIAPIKEY;
const genAI = new GoogleGenerativeAI(geminiapiKey);

export const model = genAI.getGenerativeModel({
  model: "gemini-2.0-flash",
  generationConfig: {
    maxOutputTokens: 1000,
    temperature: 0.3,
  }
});


app.get('/', (req, res) => {
  res.send('Hello');
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


  export default async function handler(req, res) {
    if (!isConnected) {
      res.status(500).send("MongoDB not connected")
      return
    }
  
    app(req, res)
  
    app.on("error", (error) => {
      console.log('App error at app.on', error)
      throw error
    })
  }