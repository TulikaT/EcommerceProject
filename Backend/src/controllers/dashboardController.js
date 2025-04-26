// src/controllers/dashboardController.js
import Product from "../models/Product.js";
import Order from "../models/Order.js";
import User from "../models/User.js";

export const getDashboardData = async (req, res) => {
  try {
    // Visitors: If you have analytics data, replace with actual value; otherwise, a dummy value
    const visitors = 1234; 

    // Calculate total sales using the Order model (assumes each Order document has a 'total' field)
    const salesAgg = await Order.aggregate([
      { $group: { _id: null, totalSales: { $sum: "$total" } } }
    ]);
    const sales = salesAgg[0]?.totalSales || 0;

    // Count the number of orders
    const orders = await Order.countDocuments();

    // Count the number of customers (users with role "user")
    const customers = await User.countDocuments({ role: "user" });

    // Sales Analysis: Group orders by month based on their creation date
    const salesByMonth = await Order.aggregate([
      {
        $group: {
          _id: { $month: "$createdAt" },
          total: { $sum: "$total" }
        }
      }
    ]);
    // Sort by month (ascending order)
    salesByMonth.sort((a, b) => a._id - b._id);
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const salesAnalysisLabels = salesByMonth.map(item => monthNames[item._id - 1]);
    const salesAnalysis = salesByMonth.map(item => item.total);

    // Category Distribution: Group products by category and count them
    const categoryAgg = await Product.aggregate([
      { $group: { _id: "$category", count: { $sum: 1 } } }
    ]);
    const categoryDistribution = {
      labels: categoryAgg.map(item => item._id),
      data: categoryAgg.map(item => item.count)
    };

    // Revenue Chart: For simplicity, let’s use the same data as Sales Analysis
    const revenueLabels = salesAnalysisLabels;
    const revenue = salesAnalysis;

    // Return the aggregated dashboard data
    res.json({
      visitors,
      sales,
      orders,
      customers,
      salesAnalysisLabels,
      salesAnalysis,
      categoryDistribution,
      revenueLabels,
      revenue
    });
  } catch (error) {
    res.status(500).json({
      message: "Error fetching dashboard data",
      error: error.message
    });
  }
};
