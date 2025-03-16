import React from "react";
import "./AdminHome.css";
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
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const AdminHome = () => {
  const lineData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"],
    datasets: [
      {
        label: "Sales Over Time ($)",
        data: [1200, 2300, 1800, 3500, 2800, 4000, 3200],
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
      title: { display: false },
    },
  };

  const doughnutData = {
    labels: ["Category A", "Category B", "Category C", "Category D"],
    datasets: [
      {
        label: "Category Distribution",
        data: [30, 25, 20, 25],
        backgroundColor: ["#4a00e0", "#8e2de2", "#56ccf2", "#2f80ed"],
        hoverOffset: 6,
      },
    ],
  };

  const doughnutOptions = {
    responsive: true,
    plugins: {
      legend: { display: true },
      title: { display: false },
    },
  };

  const revenueData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"],
    datasets: [
      {
        label: "Revenue Over Time ($)",
        data: [1500, 3000, 2500, 4500, 3800, 5200, 4200],
        backgroundColor: "#2f80ed",
      },
    ],
  };

  const revenueOptions = {
    responsive: true,
    plugins: {
      legend: { display: true },
      title: { display: false },
    },
  };

  return (
    <div className="admin-home">
      <div className="stats-grid">
        <div className="stat-card visitors">
          <h3>Visitors</h3>
          <p>1,234</p>
        </div>
        <div className="stat-card sales">
          <h3>Sales</h3>
          <p>$10,000</p>
        </div>
        <div className="stat-card orders">
          <h3>Orders</h3>
          <p>120</p>
        </div>
        <div className="stat-card customers">
          <h3>Customers</h3>
          <p>300</p>
        </div>
      </div>

      <div className="dashboard-main">
        <div className="sales-analysis">
          <h3>Sales Analysis</h3>
          <div className="chart-wrapper">
            <Line data={lineData} options={lineOptions} />
          </div>
        </div>

        <div className="dashboard-side-cards">
          <div className="side-card">
            <h3>Top Selling Products</h3>
            <ul>
              <li>Product A</li>
              <li>Product B</li>
              <li>Product C</li>
            </ul>
          </div>
          <div className="side-card rating">
            <h3>Rating</h3>
            <p>4.5 / 5.0</p>
          </div>
        </div>
      </div>

      <div className="charts-row">
        <div className="chart-card cd">
          <h3>Category Distribution</h3>
          <Doughnut data={doughnutData} options={doughnutOptions} />
        </div>

        <div className="chart-card rc">
          <h3>Revenue Chart</h3>
          <Bar data={revenueData} options={revenueOptions} />
        </div>
      </div>
    </div>
  );
};

export default AdminHome;