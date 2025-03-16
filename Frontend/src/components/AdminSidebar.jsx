import React, { useContext } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthProvider";
import "./AdminSidebar.css";

const AdminSidebar = () => {
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <aside className="admin-sidebar">
      <h2>Admin Panel</h2>
      <nav>
        <ul>
          <li><NavLink to="/admin" end>Dashboard</NavLink></li>
          <li><NavLink to="/admin/products">Products</NavLink></li>
          <li><NavLink to="/admin/orders">Orders</NavLink></li>
          <li><NavLink to="/admin/users">Users</NavLink></li>
          <li><NavLink to="/admin/analytics">Analytics</NavLink></li>
          <li><NavLink to="/admin/notifications">Notifications</NavLink></li>
          <li><NavLink to="/admin/settings">Settings</NavLink></li>
        </ul>
      </nav>
      <div className="sidebar-logout">
        <button onClick={handleLogout}>Logout</button>
      </div>
    </aside>
  );
};

export default AdminSidebar;
