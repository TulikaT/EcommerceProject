import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import nodemailer from "nodemailer";
import { validationResult } from "express-validator";
import path from "path";
import multer from "multer";


export const register = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { name, email, password, role, address, state, phone } = req.body;

  try {
   
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

 
    const hashedPassword = await bcrypt.hash(password, 10);

   
    const user = new User({ 
      name, 
      email, 
      password: hashedPassword, 
      role, 
      address, 
      state, 
      phone 
    });


    await user.save();

  
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

   
    return res.status(201).json({ token, user });
  } catch (error) {
    return res.status(500).json({ message: "Registration failed", error: error.message });
  }
};

export const login = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email, password } = req.body;

  try {
   
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

  
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    return res.status(200).json({ token, user });
  } catch (error) {
    return res.status(500).json({ message: "Login failed", error: error.message });
  }
};


export const forgotPassword = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email } = req.body;

  try {

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }


    const token = crypto.randomBytes(20).toString("hex");
    user.resetPasswordToken = token;
    user.resetPasswordExpires = Date.now() + 3600000;
    await user.save();


    const transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });


    const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${token}&email=${email}`;

    const mailOptions = {
      to: user.email,
      from: process.env.EMAIL_USER,
      subject: "Password Reset Request",
      text: `Click on the following link to reset your password:\n\n${resetUrl}\n\nThis link will expire in 1 hour.`,
    };

 
    transporter.sendMail(mailOptions, (err) => {
      if (err) {
        console.error("Email sending error:", err);
        return res.status(500).json({ message: "Error sending reset email" });
      }
      return res.json({ message: "An email has been sent with further instructions" });
    });
  } catch (error) {
    return res.status(500).json({ message: "Error in forgot password", error: error.message });
  }
};


export const resetPassword = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()){
    return res.status(400).json({ errors: errors.array() });
  }

  const { token, email, newPassword } = req.body;

  try {
   
    const user = await User.findOne({
      email,
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ message: "Invalid or expired reset token" });
    }

   
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    return res.json({ message: "Password has been updated successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Error resetting password", error: error.message });
  }
};


const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/"); 
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + "-" + Date.now() + ext);
  },
});

export const upload = multer({ storage: storage });


export const updateProfile = async (req, res) => {
  const SERVER_URL = "http://localhost:4000";
  
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

 
    if (req.body.name) user.name = req.body.name;
    if (req.body.email) user.email = req.body.email;
    if (req.body.phone) user.phone = req.body.phone;
    if (req.body.address) user.address = req.body.address;
    if (req.body.state) user.state = req.body.state;

   
    if (req.files) {
      if (req.files.profileImage) {
        const relativePath = req.files.profileImage[0].path.replace(/\\/g, "/");
        user.profileImage = `${SERVER_URL}/${relativePath}`;
      }
      if (req.files.coverImage) {
        const relativePath = req.files.coverImage[0].path.replace(/\\/g, "/");
        user.coverImage = `${SERVER_URL}/${relativePath}`;
      }
    }

    await user.save();
    res.json(user);
  } catch (error) {
    console.error("Error updating profile", error);
    res.status(500).json({ message: "Error updating profile", error: error.message });
  }
};


export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    return res.json(user);
  } catch (error) {
    console.error("Error fetching profile:", error);
    return res.status(500).json({ message: "Error fetching profile", error: error.message });
  }
};
