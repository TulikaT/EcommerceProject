import "dotenv/config.js";
import express from "express";
import cors from "cors";
import connectDB from "./src/config/db.js";
import authRoutes from "./src/routes/authRoutes.js";
import productRoutes from "./src/routes/productRoutes.js";
import cartRoutes from "./src/routes/cartRoutes.js";
import paymentRoutes from './src/routes/paymentRoutes.js';
import adminUserRoutes from "./src/routes/adminUserRoutes.js";
import adminProductRoutes from "./src/routes/adminProductRoutes.js";
import wishlistRoutes from "./src/routes/wishlistRoutes.js";
import adminOrdersRoutes from "./src/routes/adminOrdersRoutes.js";
import dashboardRoutes from "./src/routes/dashboardRoutes.js"; 
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from "url";
import visitorRoutes from "./src/routes/visitorRoutes.js"
import {
  sendStockAlertEmail,
  getNotifications,
  updateNotificationStatus,
} from "./src/controllers/notification.js"; 
import notificationRoutes from "./src/routes/notificationRoutes.js";
import settingsRoutes from "./src/routes/settingRoutes.js";

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.json());
app.use(cors({ 
  origin: process.env.FRONTEND_URL || "http://localhost:5173", 
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true, 
}));

connectDB();

const uploadsDir = path.join(process.cwd(), 'uploads');

if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}


app.get("/api/notifications", (req, res) => {
  res.json(getNotifications());
});

app.put("/api/notifications/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const { read } = req.body;
  const updatedNotif = updateNotificationStatus(id, read);
  if (updatedNotif) {
    res.json(updatedNotif);
  } else {
    res.status(404).json({ error: "Notification not found" });
  }
});


app.post("/api/products/:id/updateStock", async (req, res) => {
  const productId = req.params.id;
  const { newStock } = req.body;

  try {
    // Find the product by its ID using your Mongoose model.
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    // Update the product's stock count.
    product.stockCount = newStock;

    // Update product status based on new stock.
    if (newStock === 0) {
      product.status = "out of stock";
    } else if (newStock < 20) {
      product.status = "low";
    } else {
      product.status = "In stock";
    }

    await product.save();

    // Trigger email alert if product status is "low" or "out of stock".
    if (product.status === "low" || product.status === "out of stock") {
      sendStockAlertEmail(product);
    }

    res.json({ message: "Product stock updated", product });
  } catch (error) {
    console.error("Error updating product stock:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});




console.log("directory: ",__dirname, " filename: ",__filename);
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use("/api/auth", authRoutes);

app.use("/api/products", productRoutes);

app.use("/api/cart", cartRoutes);

app.use("/api/payment", paymentRoutes);

app.use("/api/admin/dashboard", dashboardRoutes); 

app.use("/api/admin/users", adminUserRoutes); 

app.use("/api/admin/products", adminProductRoutes);

app.use("/api/admin/orders", adminOrdersRoutes);

app.use("/api/wishlist", wishlistRoutes);

app.use("/api/visitor", visitorRoutes);

app.use("/api/notifications", notificationRoutes);

app.use("/api/settings", settingsRoutes);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));