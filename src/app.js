import express from 'express'
import cookieParser from 'cookie-parser'
import cors from "cors"

const app = express()

app.use(cors({
    origin: [process.env.CLIENT_URL, 'http://localhost:5173', 'http://localhost:5174', 'https://your-frontend-domain.com'],
    credentials: true,
    optionsSuccessStatus: 200,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS', 'HEAD'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin']
  }));

app.use(express.json({ limit: '20kb' }))

app.use(express.urlencoded({ extended: true, limit: '20kb'}))

app.use(express.static('public'))

app.use(cookieParser())


import UserRoute from './routes/user.routes.js'
import EmailRoute from './routes/email.routes.js'
import ContactRoute from './routes/contact.routes.js' 

app.use('/api/v1/user', UserRoute)
app.use('/api/v1/email', EmailRoute)
app.use('/api/v1/contact', ContactRoute)

export { app }


// http://localhost:5000/api/v1/users/register