import express from "express";
import { check } from "express-validator";
import {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../controllers/productController.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", getProducts);


router.get("/:id", getProductById);

router.post(
  "/",
  protect,
  adminOnly,
  [
    check("name", "Product name is required").not().isEmpty(),
    check("description", "Product description is required").not().isEmpty(),
    check("price", "Product price must be a number").isNumeric(),
    check("category", "Product category is required").not().isEmpty(),
  ],
  createProduct
);

router.put("/:id", protect, adminOnly, updateProduct);

router.delete("/:id", protect, adminOnly, deleteProduct);

export default router;
