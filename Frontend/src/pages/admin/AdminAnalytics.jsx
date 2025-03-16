import React from "react";
import "./AdminAnalytics.css";

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
import { Line, Bar } from "react-chartjs-2";

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

const AdminAnalytics = () => {
  const lineData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"],
    datasets: [
      {
        label: "Revenue ($)",
        data: [2000, 4000, 3000, 5000, 4200, 6000, 5500],
        fill: false,
        borderColor: "#8e2de2",
        tension: 0.2,
      },
    ],
  };

  const lineOptions = {
    responsive: true,
    plugins: {
      legend: { display: true },
    },
  };

  const barData = {
    labels: ["Product A", "Product B", "Product C", "Product D"],
    datasets: [
      {
        label: "Sales Volume",
        data: [120, 90, 75, 130],
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

  return (
    <div className="admin-analytics">
      <h2>Analytics</h2>
      <div className="analytics-grid">
        <div className="analytics-card">
          <h3>Monthly Revenue</h3>
          <Line data={lineData} options={lineOptions} />
        </div>
        <div className="analytics-card">
          <h3>Top Product Sales</h3>
          <Bar data={barData} options={barOptions} />
        </div>
      </div>
      <div className="analytics-stats">
        <div className="stats-card">
          <h4>Total Users</h4>
          <p>1,234</p>
        </div>
        <div className="stats-card">
          <h4>Total Orders</h4>
          <p>567</p>
        </div>
        <div className="stats-card">
          <h4>Conversion Rate</h4>
          <p>3.2%</p>
        </div>
      </div>
    </div>
  );
};

export default AdminAnalytics;
