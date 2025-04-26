// src/routes/dashboardRoutes.js
import express from "express";
import { getDashboardData } from "../controllers/dashboardController.js";
import { getAnalyticsData } from "../controllers/adminAnalyticsController.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

// Assign different routes:
router.get("/data", protect, adminOnly, getDashboardData);
router.get("/analytics", protect, adminOnly, getAnalyticsData);

export default router;
