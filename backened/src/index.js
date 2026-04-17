import express from "express";
import morgan from "morgan";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import mongoose from "mongoose";

// load env
dotenv.config();

const app = express();

// Middlewares
app.use(cookieParser());
app.use(cors({
  origin: process.env.DOMAIN,
  credentials: true,
}));
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

//  Database Connection 
console.log("DB URL:", process.env.DB_URL);

mongoose.connect(process.env.DB_URL)
  .then(() => console.log("Database connected ✅"))
  .catch((err) => console.log("Database not connected ❌", err));

//Routes 
import TransactionRouter from "./transaction/transaction.route.js";
import userRouter from "./user/user.routes.js";
import DashboardRouter from "./dashboard/dashboard.route.js";

app.use("/api/user", userRouter);
app.use("/api/transaction", TransactionRouter);
app.use("/api/dashboard", DashboardRouter);

// Server start
const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});