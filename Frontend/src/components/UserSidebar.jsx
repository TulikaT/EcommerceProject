import React, { useContext } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faShoppingCart, faHeart, faSignOutAlt } from "@fortawesome/free-solid-svg-icons";
import { AuthContext } from "../context/AuthProvider"; // Adjust the import path if necessary
import "./UserSidebar.css";

const UserSidebar = () => {
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <aside className="user-sidebar">
      <h2>User Dashboard</h2>
      <nav>
        <ul>
          <li>
            <NavLink to="/user/profile">
              <FontAwesomeIcon icon={faUser} /> &nbsp; Profile
            </NavLink>
          </li>
          <li>
            <NavLink to="/user/orders">Orders
            </NavLink>
          </li>
          <li>
            <NavLink to="/user/wishlist">Wishlist
            </NavLink>
          </li>
        </ul>
      </nav>
      <div className="sidebar-logout">
        <button onClick={handleLogout}>Logout
        </button>
      </div>
    </aside>
  );
};

export default UserSidebar;
