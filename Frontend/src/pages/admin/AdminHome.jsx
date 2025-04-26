// src/pages/admin/AdminHome.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import "./AdminHome.css";
import { Line, Doughnut, Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
} from "chart.js";

// Register Chart.js components
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
  // State for dashboard data
  const [dashboardData, setDashboardData] = useState(null);
  const [loadingDashboard, setLoadingDashboard] = useState(true);
  const [dashboardError, setDashboardError] = useState("");
  const [visitorCount, setVisitorCount] = useState(null);

  // Fetch dashboard data on mount
  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        // Get the admin token from localStorage if needed
        const token = localStorage.getItem("token");
        const config = token
          ? { headers: { Authorization: `Bearer ${token}` } }
          : {};
        const res = await axios.get("http://localhost:4000/api/admin/dashboard/data", config);
        setDashboardData(res.data);
        setLoadingDashboard(false);
      } catch (error) {
        console.error("Error fetching dashboard data:", error.response?.data || error.message);
        setDashboardError("Failed to fetch dashboard data");
        setLoadingDashboard(false);
      }
    };

    fetchDashboard();
  }, []);

  useEffect(() => {
    const alreadyTracked = sessionStorage.getItem("visitTracked");
    if (!alreadyTracked) {
      const trackVisitAndUpdateCount = async () => {
        try {
          await axios.post("http://localhost:4000/api/visitor/track");
          sessionStorage.setItem("visitTracked", "true");
          const response = await axios.get("http://localhost:4000/api/visitor/count");
          setVisitorCount(response.data.visitorCount);
        } catch (err) {
          console.error("Visitor tracking/count error:", err.message);
        }
      };
      trackVisitAndUpdateCount();
    } else {
      axios.get("http://localhost:4000/api/visitor/count")
        .then(res => setVisitorCount(res.data.visitorCount))
        .catch(err => console.error("Error fetching visitor count:", err.message));
    }
  }, []);
  
  

  // Until data is loaded, we can render a loading state
  if (loadingDashboard) {
    return <p style={{ textAlign: "center", marginTop: "100px" }}>Loading dashboard...</p>;
  }

  if (dashboardError) {
    return <p style={{ textAlign: "center", marginTop: "100px" }}>{dashboardError}</p>;
  }

  // Prepare the live data for charts using the fetched dashboardData:
  const lineData = {
    labels: dashboardData.salesAnalysisLabels || ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"],
    datasets: [
      {
        label: "Sales Over Time ($)",
        data: dashboardData.salesAnalysis || [1200, 2300, 1800, 3500, 2800, 4000, 3200],
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
    labels: (dashboardData.categoryDistribution && dashboardData.categoryDistribution.labels) || ["Category A", "Category B", "Category C", "Category D"],
    datasets: [
      {
        label: "Category Distribution",
        data: (dashboardData.categoryDistribution && dashboardData.categoryDistribution.data) || [30, 25, 20, 25],
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
    labels: dashboardData.revenueLabels || ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"],
    datasets: [
      {
        label: "Revenue Over Time ($)",
        data: dashboardData.revenue || [1500, 3000, 2500, 4500, 3800, 5200, 4200],
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
          <p>{visitorCount !== null ? visitorCount : "Loading..."}</p>
        </div>
        <div className="stat-card sales">
          <h3>Sales</h3>
          <p>${dashboardData.sales}</p>
        </div>
        <div className="stat-card orders">
          <h3>Orders</h3>
          <p>{dashboardData.orders}</p>
        </div>
        <div className="stat-card customers">
          <h3>Customers</h3>
          <p>{dashboardData.customers}</p>
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
              {/* Replace with dynamic data if available */}
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
