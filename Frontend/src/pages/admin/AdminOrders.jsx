// src/pages/admin/AdminOrders.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import "./AdminOrders.css";
import { toast } from "react-toastify";

const AdminOrders = () => {
  // State for storing orders, loading status, and any errors
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Helper function to get the authentication configuration using a stored token
  const getAuthConfig = () => {
    const token = localStorage.getItem("token");
    return { headers: { Authorization: `Bearer ${token}` } };
  };

  // Function to fetch orders from the backend
  const fetchOrders = async () => {
    try {
      const config = getAuthConfig();
      // Make an HTTP GET request to your backend endpoint for orders
      const res = await axios.get("http://localhost:4000/api/admin/orders", config);
      setOrders(res.data); // Set the orders state with the response data
      setLoading(false);
    } catch (err) {
      console.error("Failed to fetch orders", err.response?.data || err);
      setError("Failed to fetch orders");
      setLoading(false);
      toast.error("Failed to fetch orders");
    }
  };

  // Effect hook to fetch orders once when the component mounts
  useEffect(() => {
    fetchOrders();
  }, []);

  // Function to update order status; for example, to "Processing", "Shipped", or "Delivered"
  const handleStatusUpdate = async (orderId, newStatus) => {
    try {
      const config = getAuthConfig();
      // PUT request to update the order's status
      await axios.put(`http://localhost:4000/api/admin/orders/${orderId}`, { status: newStatus }, config);
      toast.success("Order status updated");
      fetchOrders(); // Re-fetch orders to refresh the view
    } catch (err) {
      console.error("Failed to update order status", err.response?.data || err);
      toast.error("Failed to update order status");
    }
  };

  // Render loading or error messages as needed
  if (loading) return <p>Loading orders...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="admin-orders">
      <h2>Manage Orders</h2>
      {orders.length === 0 ? (
        <p>No orders found.</p>
      ) : (
        <table className="orders-table">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>User</th>
              <th>Date</th>
              <th>Total ($)</th>
              <th>Status</th>
              <th style={{ textAlign: "center" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order._id}>
                <td>{order._id}</td>
                <td>{order.user ? order.user.email : "N/A"}</td>
                <td>{new Date(order.createdAt).toLocaleString()}</td>
                <td>{order.totalPrice.toFixed(2)}</td>
                <td>{order.status}</td>
                <td style={{ textAlign: "center" }}>
                  {/* Example buttons to update order status. Customize as needed. */}
                  <button onClick={() => handleStatusUpdate(order._id, "Processing")}>Processing</button>
                  <button onClick={() => handleStatusUpdate(order._id, "Shipped")}>Shipped</button>
                  <button onClick={() => handleStatusUpdate(order._id, "Delivered")}>Delivered</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default AdminOrders;
