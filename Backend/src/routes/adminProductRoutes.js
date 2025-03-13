
import express from "express";
import { check } from "express-validator";
import {
  getAllProducts,
  addProduct,
  updateProductAdmin,
  deleteProductAdmin,
} from "../controllers/adminProductController.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();


router.use(protect);
router.use(adminOnly);

router.get("/", getAllProducts);

router.post(
  "/",
  [
    check("name", "Name is required").notEmpty(),
    check("description", "Description is required").notEmpty(),
    check("price", "Price must be a number").isNumeric(),
    check("category", "Category is required").notEmpty(),
    check("stockCount", "Stock count must be a number").isNumeric(),
  ],
  addProduct
);

router.put("/:id", updateProductAdmin);

router.delete("/:id", deleteProductAdmin);

export default router;