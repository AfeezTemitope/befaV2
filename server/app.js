import dotenv from "dotenv"
import cors from 'cors'
import express from "express";
import apiRoutes from './route/api.js'
import connectDB from './config/database.js'
dotenv.config()

const app = express.json()
connectDB();

app.use(cors())
app.use(express.json())

app.use('/api', apiRoutes)

const port = process.env.PORT || 5000
app.listen(port, () => {
    console.log(`server started dope @ localhost:${port}`)
})