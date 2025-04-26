import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./AdminNotifications.css";

const AdminNotifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const res = await axios.get("http://localhost:4000/api/notifications");
        // Filter only low or out-of-stock products
        const relevant = res.data.filter(
          (notif) =>
            notif.status === "Low Stock" || notif.status === "Out of Stock"
        );
        setNotifications(relevant);
      } catch (err) {
        console.error("Error fetching notifications:", err.response?.data || err.message);
        setError("Error fetching notifications");
        toast.error("Failed to load notifications");
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, []);

  const handleMarkRead = async (id) => {
    try {
      await axios.put(
        `http://localhost:4000/api/notifications/${id}`,
        { read: true },
        { headers: { "Content-Type": "application/json" } }
      );

      setNotifications((prevNotifs) =>
        prevNotifs.map((notif) =>
          notif._id === id ? { ...notif, read: true } : notif
        )
      );
      toast.success("Notification marked as read");
    } catch (err) {
      console.error("Error marking notification as read:", err.response?.data || err.message);
      setError("Error marking notification as read");
      toast.error("Failed to mark as read");
    }
  };

  return (
    <div className="admin-notifications">
      <h2>Admin Notifications</h2>

      {loading && <p>Loading notifications...</p>}
      {error && <p className="error">{error}</p>}
      {!loading && notifications.length === 0 && <p>No new notification</p>}

      {!loading && notifications.length > 0 && (
        <table>
          <thead>
            <tr>
              <th>Title</th>
              <th>Product</th>
              <th>Message</th>
              <th>Status</th>
              <th>Read</th>
              <th style={{ textAlign: "center" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {notifications.map((notif) => (
              <tr key={notif._id}>
                <td>{notif.title || "No Title"}</td>
                <td>{notif.productName || "Unnamed Product"}</td>
                <td>{notif.message || "No Message"}</td>
                <td>{notif.status}</td>
                <td>{notif.read ? "Read" : "Unread"}</td>
                <td style={{ textAlign: "center" }}>
                  {!notif.read && (
                    <button
                      className="mark-read-btn"
                      onClick={() => handleMarkRead(notif._id)}
                    >
                      Mark as Read
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default AdminNotifications;
