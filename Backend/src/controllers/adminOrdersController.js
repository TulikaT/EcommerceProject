import Order from "../models/Order.js";
import { validationResult } from "express-validator";


export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find({}).populate("user", "email name");
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: "Error fetching orders", error: error.message });
  }
};

export const updateOrderStatus = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: "Order not found" });

    const { status } = req.body;
    order.status = status || order.status;
    
    await order.save();
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: "Error updating order", error: error.message });
  }
};

export const deleteOrder = async (req, res) => {
  try {
    const order = await Order.findByIdAndDelete(req.params.id);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }
    res.json({ message: "Order removed", order });
  } catch (error) {
    res.status(500).json({ message: "Error deleting order", error: error.message });
  }
};
