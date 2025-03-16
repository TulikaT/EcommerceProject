import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: [true, "Name is required"], trim: true },
    email: { type: String, required: [true, "Email is required"], unique: true, lowercase: true, trim: true },
    password: { type: String, required: [true, "Password is required"] },
    role: { type: String, enum: ["user", "admin"], default: "user" },
     profileImage: { type: String }, 
     coverImage: { type: String },   
     phone: { type: String },
     address: { type: String },
     state: { type: String },
    resetPasswordToken: String,
    resetPasswordExpires: Date,
    
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);