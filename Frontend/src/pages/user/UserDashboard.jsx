import React from "react";
import { Outlet } from "react-router-dom";
import UserSidebar from "../../components/UserSidebar";
import UserHeader from "../../components/UserHeader";
import "./UserDashboard.css";

const UserDashboard = () => {
  return (
    <div className="user-dashboard">
      <UserSidebar />
      <div className="user-main">
        <UserHeader/>
        <div className="user-content">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;