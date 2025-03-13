import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: [true, "Name is required"], trim: true },
    email: { type: String, required: [true, "Email is required"], unique: true, lowercase: true, trim: true },
    password: { type: String, required: [true, "Password is required"] },
    role: { type: String, enum: ["user", "admin"], default: "user" },
     // New fields
     profileImage: { type: String }, // URL or file path
     coverImage: { type: String },   // URL or file path
     phone: { type: String },
     address: { type: String },
     state: { type: String },
    resetPasswordToken: String,
    resetPasswordExpires: Date,
    
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);