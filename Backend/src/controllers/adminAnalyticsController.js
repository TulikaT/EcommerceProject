// src/controllers/adminAnalyticsController.js
import Order from "../models/Order.js";
import Product from "../models/Product.js";
import User from "../models/User.js";

export const getAnalyticsData = async (req, res) => {
  try {
    // 1. Monthly Revenue: Aggregate orders by month.
    const monthlyRevenueAgg = await Order.aggregate([
      {
        $group: {
          _id: { $month: "$createdAt" },
          revenue: { $sum: "$total" }  // assumes each order has a "total" field
        },
      },
      { $sort: { "_id": 1 } },
    ]);
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const monthlyRevenueLabels = monthlyRevenueAgg.map(item => monthNames[item._id - 1]);
    const monthlyRevenue = monthlyRevenueAgg.map(item => item.revenue);

    // 2. Top Products by Sales: Find products sorted by salesCount.
    // (Assumes that your Product model has a "salesCount" field.)
    const topProducts = await Product.find({}).sort({ salesCount: -1 }).limit(4);
    const topProductsLabels = topProducts.map(prod => prod.name);
    const topProductsSales = topProducts.map(prod => prod.salesCount || 0);

    // 3. Total Users (customers only; assuming role "user")
    const totalUsers = await User.countDocuments({ role: "user" });

    // 4. Total Orders
    const totalOrders = await Order.countDocuments();

    // 5. Conversion Rate (for example, orders per user)
    const conversionRate = totalUsers > 0 ? ((totalOrders / totalUsers) * 100).toFixed(2) : 0;

    res.json({
      monthlyRevenueLabels,
      monthlyRevenue,
      topProductsLabels,
      topProductsSales,
      totalUsers,
      totalOrders,
      conversionRate,
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching analytics data", error: error.message });
  }
};
