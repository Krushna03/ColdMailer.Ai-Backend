import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from 'dotenv'
import connectDB from "../databse/db.js";
import { OAuth2Client } from 'google-auth-library';
import serverless from 'serverless-http';
import express from 'express'
import cookieParser from 'cookie-parser'
import cors from "cors"

// import UserRoute from '../routes/user.routes.js'
// import EmailRoute from '../routes/email.routes.js'
// import ContactRoute from '../routes/contact.routes.js' 
  

dotenv.config({
  path: "./.env"
})

const app = express()

app.use(cors({
  origin: '*', 
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS', 'HEAD'],
}));

app.use(express.json({ limit: '20kb' }))

app.use(express.urlencoded({ extended: true, limit: '20kb'}))

app.use(express.static('public'))

app.use(cookieParser())


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


// app.use('/api/v1/user', UserRoute)
// app.use('/api/v1/email', EmailRoute)
// app.use('/api/v1/contact', ContactRoute)


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