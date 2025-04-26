import express from "express";
import { getAllOrders, updateOrderStatus, deleteOrder } from "../controllers/adminOrdersController.js";
import { protect } from "../middleware/authMiddleware.js";
import { adminOnly } from "../middleware/authMiddleware.js"; 

const router = express.Router();


router.use(protect);
router.use(adminOnly);

router.get("/", getAllOrders);

router.put("/:id", updateOrderStatus);

router.delete("/:id", deleteOrder);

export default router;
