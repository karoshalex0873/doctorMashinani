import express from 'express'
import dotenv from 'dotenv'
import { AppDataSource } from './Config/data-source'
import { error } from 'console'

dotenv.config()
const PORT=process.env.PORT
console.log(PORT)
const app=express()

app.use(express.json())


app.get('/',(req,res)=>{
  res.status(200).json({ message: 'server running' })
})

AppDataSource.initialize()
  .then(async () => {
    console.log("🚀 Database connected successfully")
  })
  .catch((error) => console.log("Database connection error:", error));

app.listen(PORT,()=>{
  console.log(`🚀 server running on port ${PORT}`)
})