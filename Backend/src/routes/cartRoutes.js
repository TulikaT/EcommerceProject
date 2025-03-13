import express from "express";
import {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  checkoutCart,
} from "../controllers/cartController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(protect);

router.get("/", getCart);
router.post("/", addToCart);
router.put("/", updateCartItem);
router.delete("/:productId", removeFromCart);
router.post("/checkout", checkoutCart);

export default router;
