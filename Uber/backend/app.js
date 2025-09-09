import "dotenv/config"
import cors from 'cors'
import express from 'express'
import connectDB from "./config/db.js";
import { connectRedis } from "./config/redis.js";  // ✅ add this
import userRouter from "./routes/user.routes.js";
import cookieParser from "cookie-parser";

const app=express();


// middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cookieParser());


// database connection 
connectDB();


// redis connection
connectRedis(); // ✅ connect redis


app.get("/",(req,res)=>{
  res.send("Server is Working.")
})
app.use("/api/user",userRouter);


export default app;