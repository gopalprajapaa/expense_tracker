import express from "express";
import morgan from "morgan";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import cors from "cors";

dotenv.config();

const app = express();


//Database Connection
import mongoose from "mongoose"
console.log("DB URL:", process.env.DB_URL);
mongoose.connect(process.env.DB_URL).then(()=>{console.log("database connected !")})
.catch(()=>{console.log("database not connected")});

import cookieParser from 'cookie-parser'
app.use(cookieParser())
import cors from "cors"

// middlewares
app.use(cookieParser());
app.use(cors({
    origin: process.env.DOMAIN,
    credentials: true,
}));
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// DB connection
console.log("DB URL:", process.env.DB_URL);

mongoose.connect(process.env.DB_URL)
  .then(() => console.log("database connected !"))
  .catch((err) => console.log("database not connected", err));

// routes
import TransactionRouter from "./transaction/transaction.route.js";
import userRouter from "./user/user.routes.js";
import DashboardRouter from "./dashboard/dashboard.route.js"
app.use("/api/user",userRouter);
app.use("/api/transaction",TransactionRouter);
app.use("/api/dashboard",DashboardRouter);
import DashboardRouter from "./dashboard/dashboard.route.js";

app.use("/api/user", userRouter);
app.use("/api/transaction", TransactionRouter);
app.use("/api/dashboard", DashboardRouter);

// Step 4 implemented HERE (at bottom)
const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

