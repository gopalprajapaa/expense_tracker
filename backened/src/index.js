import express from "express"
import morgan from "morgan"
import dotenv from "dotenv"

dotenv.config()
const app=express()

app.listen(8080,()=>console.log("Server is running on port 8080"));

//Database Connection
import mongoose from "mongoose"
mongoose.connect(process.env.DB_URL).then(()=>{console.log("database connected !")})
.catch(()=>{console.log("database not connected")});

import cookieParser from 'cookie-parser'
app.use(cookieParser())
import cors from "cors"
app.use(cors({
    origin:process.env.DOMAIN,
    credentials:true,
}))


//app level middleware
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({extended:false}))

//route level middleware
import TransactionRouter from "./transaction/transaction.route.js"
import userRouter from "./user/user.routes.js";
import DashboardRouter from "./dashboard/dashboard.route.js"
app.use("/api/user",userRouter);
app.use("/api/transaction",TransactionRouter);
app.use("/api/dashboard",DashboardRouter);