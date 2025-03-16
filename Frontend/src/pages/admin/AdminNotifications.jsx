import React, { useState } from "react";
import "./AdminNotifications.css";

const AdminNotifications = () => {
  const [notifications, setNotifications] = useState([
    { id: 1, title: "New Order", message: "Order #1234 has been placed.", read: false },
    { id: 2, title: "Stock Alert", message: "Product ABC is running low on stock.", read: false },
    { id: 3, title: "New User", message: "User jdoe@example.com signed up.", read: true },
  ]);

  const handleMarkRead = (id) => {
    setNotifications((prev) =>
      prev.map((notif) =>
        notif.id === id ? { ...notif, read: true } : notif
      )
    );
  };

  return (
    <div className="admin-notifications">
      <h2>Notifications</h2>
      <table>
        <thead>
          <tr>
            <th>Title</th>
            <th>Message</th>
            <th>Status</th>
            <th style={{ textAlign: "center" }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {notifications.map((notif) => (
            <tr key={notif.id}>
              <td>{notif.title}</td>
              <td>{notif.message}</td>
              <td>{notif.read ? "Read" : "Unread"}</td>
              <td style={{ textAlign: "center" }}>
                {!notif.read && (
                  <button onClick={() => handleMarkRead(notif.id)}>
                    Mark as Read
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminNotifications;