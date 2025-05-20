import express from 'express'
import cors from "cors"

const app = express()

app.use(cors({
  origin: [ process.env.CLIENT_URL, 'http://localhost:5173', 'http://localhost:5174'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS', 'HEAD'],
}));

app.use(express.json({ limit: '20kb' }))

import ContactRoute from './routes/contact.routes.js' 

app.use('/api/v1/contact', ContactRoute)

export { app }


// http://localhost:5000/api/v1/users/register