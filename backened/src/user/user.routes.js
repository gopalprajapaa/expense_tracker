import {Router} from "express"
import { createUser,Login,sendEmail,forgotPassword, verifyToken,changePassword,logout,getAllUsers,updateStatus} from "./user.controller.js";
import { AdminUserGuard, verifyTokenGuard,AdminGuard} from "../middleware/guide.middleware.js";

const userRouter=Router();

//@post /api/user/signup
userRouter.post("/signup",createUser);

//@post /api/user/login
userRouter.post("/login",Login);

//@GET /api/user/logout
userRouter.get("/logout",logout);

//@GET /api/user/getAllUsers
userRouter.get("/get",AdminGuard,getAllUsers);

//@PUT /api/user/status
userRouter.put("/status/:id",AdminGuard,updateStatus); 

//@post /api/user/send-mail
userRouter.post("/send-mail",sendEmail);

//@post /api/user/forgot-password
userRouter.post("/forgot-password",forgotPassword);


//@Get /api/user/session
userRouter.get("/session",AdminUserGuard,(req,res)=>{
   return res.json(req.user);
});


//@post /api/user/forgot-password
userRouter.post("/verify-token",verifyTokenGuard,verifyToken);

//@post /api/user/forgot-password
userRouter.put("/change-password",verifyTokenGuard,changePassword);

export default userRouter;