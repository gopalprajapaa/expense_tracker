import { Router } from "express";
import { createTransaction, deleteTransaction, getTransaction, updateTransaction } from "./transaction.controller.js";
import { AdminUserGuard } from "../middleware/guide.middleware.js";

const TransactionRouter=Router();

TransactionRouter.get("/get",AdminUserGuard,getTransaction);
TransactionRouter.post("/create", AdminUserGuard,createTransaction);
TransactionRouter.put("/update/:id",AdminUserGuard,updateTransaction);
TransactionRouter.delete("/delete/:id",AdminUserGuard,deleteTransaction);

export default TransactionRouter;
