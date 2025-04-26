// src/pages/admin/AdminAnalytics.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import "./AdminAnalytics.css"; // your CSS file for styling analytics page
import { Line, Doughnut, Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  BarElement,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const token = localStorage.getItem("token");

const AdminAnalytics = () => {
  const [analyticsData, setAnalyticsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // When the component mounts, fetch the analytics data from the backend
  useEffect(() => {
    
    const fetchAnalytics = async () => {
      try {
        const response = await axios.get("http://localhost:4000/api/admin/dashboard/analytics", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setAnalyticsData(response.data); // ✅ store the response data
        setLoading(false); // ✅ stop showing loading
      } catch (error) {
        console.error("Error fetching analytics data:", error);
        setError("Failed to load analytics data."); // ✅ show an error
        setLoading(false); // ✅ stop showing loading
      }
    };
    

    fetchAnalytics();
  }, []);


  if (!token) {
    setError("You are not authorized. Please sign in.");
    setLoading(false);
    return;
  }  

  
  if (loading) return <div className="admin-analytics">Loading analytics...</div>;
  if (error) return <div className="admin-analytics">{error}</div>;
  if (!analyticsData) return <div className="admin-analytics">No data found</div>;

  // Destructure the analytics data from the response
  const {
    monthlyRevenueLabels,
    monthlyRevenue,
    topProductsLabels,
    topProductsSales,
    totalUsers,
    totalOrders,
    conversionRate,
  } = analyticsData;

  // Prepare chart data for Monthly Revenue (Line Chart)
  const lineData = {
    labels: monthlyRevenueLabels, // e.g., ["Jan", "Feb", "Mar", ...]
    datasets: [
      {
        label: "Revenue ($)",
        data: monthlyRevenue,
        fill: false,
        borderColor: "#8e2de2",
        backgroundColor: "#8e2de2",
        tension: 0.2,
      },
    ],
  };

  const lineOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: true },
    },
  };

  // Prepare chart data for Top Product Sales (Bar Chart)
  const barData = {
    labels: topProductsLabels, // e.g., ["Product A", "Product B", ...]
    datasets: [
      {
        label: "Sales Volume",
        data: topProductsSales,
        backgroundColor: ["#4a00e0", "#8e2de2", "#56ccf2", "#2f80ed"],
      },
    ],
  };

  const barOptions = {
    responsive: true,
    plugins: {
      legend: { display: true },
    },
  };

  // Prepare chart data for Category Distribution (Doughnut Chart)
  // (If you have such analytics, you can follow a similar pattern.)
  // For now, we’ll assume the top products chart is our “bar” chart.

  return (
    <div className="admin-analytics">
      <h2>Analytics</h2>
      <div className="analytics-grid">
        <div className="analytics-card">
          <h3>Monthly Revenue</h3>
          <div className="chart-wrapper">
            <Line data={lineData} options={lineOptions} />
          </div>
        </div>
        <div className="analytics-card">
          <h3>Top Product Sales</h3>
          <div className="chart-wrapper">
            <Bar data={barData} options={barOptions} />
          </div>
        </div>
      </div>
      <div className="analytics-stats">
        <div className="stats-card">
          <h4>Total Users</h4>
          <p>{totalUsers}</p>
        </div>
        <div className="stats-card">
          <h4>Total Orders</h4>
          <p>{totalOrders}</p>
        </div>
        <div className="stats-card">
          <h4>Conversion Rate</h4>
          <p>{conversionRate}%</p>
        </div>
      </div>
    </div>
  );
};

export default AdminAnalytics;
