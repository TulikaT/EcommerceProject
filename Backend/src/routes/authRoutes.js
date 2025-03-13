import express from "express";
import { check } from "express-validator";
import { register, login, forgotPassword, resetPassword } from "../controllers/authController.js";
import { updateProfile } from "../controllers/authController.js";
import { protect } from "../middleware/authMiddleware.js";
import { upload } from "../controllers/authController.js";
import { getProfile } from "../controllers/authController.js";

const router = express.Router();


router.post(
  "/register",
  [
    check("name", "Name is required").notEmpty(),
    check("email", "Please include a valid email").isEmail(),
    check("password", "Password must be at least 6 characters").isLength({ min: 6 }),
  ],
  register
);


router.post(
  "/login",
  [
    check("email", "Please include a valid email").isEmail(),
    check("password", "Password is required").exists(),
  ],
  login
);


router.post(
  "/forgot-password",
  [check("email", "Please include a valid email").isEmail()],
  forgotPassword
);


router.post(
  "/reset-password",
  [
    check("token", "Token is required").notEmpty(),
    check("email", "Please include a valid email").isEmail(),
    check("newPassword", "New password must be at least 6 characters").isLength({ min: 6 }),
  ],
  resetPassword
);


router.put(
  "/profile",
  protect,
  upload.fields([
    { name: "profileImage", maxCount: 1 },
    { name: "coverImage", maxCount: 1 },
  ]),
  updateProfile
);

router.get("/profile", protect, getProfile);


export default router;