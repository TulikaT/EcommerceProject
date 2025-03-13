import express from "express";
import { check } from "express-validator";
import { getUsers, addUser, updateUser, deleteUser } from "../controllers/adminUserController.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(protect);
router.use(adminOnly);

router.get("/", getUsers);
router.post(
  "/",
  [
    check("name", "Name is required").notEmpty(),
    check("email", "Valid email is required").isEmail(),
    check("password", "Password must be at least 6 characters").isLength({ min: 6 }),
  ],
  addUser
);
router.put("/:id", updateUser);
router.delete("/:id", deleteUser);

export default router;
