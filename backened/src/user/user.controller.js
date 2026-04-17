import userModel from "./user.model.js";
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import sendMail from "../utils/mail.js";
import { otpTemplate } from "../utils/otp.template.js";
import { generateOTP } from "../utils/generateotp.js";
import { forgotPasswordTemplate } from "../utils/forgot.template.js";

export const createUser = async (req, res) => {
    try {
        const data = req.body;
        const user = new userModel(data);
        await user.save();
        res.json(user);

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}

export const sendEmail = async (req, res) => {
    try {
        const { email } = req.body;
        const OTP = generateOTP();
        const isEmail = await userModel.findOne({ email });
        if (isEmail)
            return res.status(400).json({ message: "Already Registered" });
        await sendMail(email, "OTP For Signup", otpTemplate(OTP))
        res.json({
            message: "Email sent Successfully",
            otp: OTP,
            Success: true
        });

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}



const createToken = async (user) => {
    const payload = {
        id: user._id,
        fullname: user.fullname,
        email: user.email,
        role: user.role
    }

    const token = await jwt.sign(payload, process.env.AUTH_SECRET, { expiresIn: "1d" })
    return token;
}

export const Login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await userModel.findOne({ email: email })
        if (!user) {
            return res.status(404).json({ message: "User Not Found!!!" })
        }

        if (!user.status) {
            return res.status(404).json({ message: "You are not active member" })
        }
        const isloged = await bcrypt.compare(password, user.password)
        if (!isloged)
            return res.status(401).json({ message: "Incorrect Password" })
        const token = await createToken(user);
        res.cookie("authToken", token, {
            httpOnly: true,
            secure: process.env.ENVIRONMENT !== "DEV",
            sameSite: process.env.ENVIRONMENT === "DEV" ? "lax" : "none",
            path: "/",
            domain: undefined,
            maxAge: 86400000,
        });
        res.json({ message: "Login Success", role: user.role });

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}


export const logout = async (req, res) => {
    try {

        res.cookie('authToken', null, {
            httpOnly: true,
            secure: process.env.ENVIRONMENT !== "DEV",
            sameSite: process.env.ENVIRONMENT === "DEV" ? "lax" : "none",
            path: "/",
            domain: undefined,
            maxAge: 0,
        });

        res.status(200).json({ message: "Logout Success" });

    } catch (err) {
        res.status(401).json({ message: err.message || "Logout Failed" });
    }
}




export const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await userModel.findOne({ email });
        if (!user)
            return res.status(404).json({ message: "User doesn't exists" });

        const token = await jwt.sign({ id: user._id }, process.env.FORGOT_TOKEN_SECRET, { expiresIn: "15m" })
        const link = `${process.env.DOMAIN}/forgot-password?token=${token}`;
        const sent = await sendMail(email,
            "Expense-Forgot Password ?",
            forgotPasswordTemplate(user.fullname, link));
        if (!sent)
            return res.status(424).json({ message: "Email sending failed!!!" });
        res.json({ message: "Please check your email to forgot password" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}

export const verifyToken = async (req, res) => {
    try {
        res.json("Verification Success");
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}



export const changePassword = async (req, res) => {
    try {
        const { password } = req.body;
        const encrypted = await bcrypt.hash(password.toString(), 12);
        await userModel.findByIdAndUpdate(req.user.id, { password: encrypted });
        res.json("Password Updated Sucessfully");
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}



export const getAllUsers = async (req, res) => {
    try {
        const { page, limit } = req.query;
        // const skip = (page - 1) * limit;
        const pageNum = Number(page) || 1;
        const limitNum = Number(limit) || 5;
        const skip = (pageNum - 1) * limitNum;
        const users = await userModel
            .find().sort({ createdAt: -1 })
            .skip(skip)
            .limit(limitNum);
        const total = await userModel.countDocuments();
        res.json({
            data: users,
            total
        })

    } catch (error) {
        res.status(500).json({ message: error.message || "Internal Server Error" });
    }

}







export const updateStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const { id } = req.params;
        const user = await userModel.findByIdAndUpdate(id, { status }, { new: true });
        if (!user) {
            return res.status(404).json({
                message: "User Not Found !",
                user
            })
        }
        res.json(user);

    } catch (error) {
        res.status(500).json({ message: error.message || "Internal Server Error" });
    }

}