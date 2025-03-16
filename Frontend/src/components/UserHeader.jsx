import React, { useContext } from "react";
import { AuthContext } from "../context/AuthProvider";
import "./UserHeader.css";

function titleCase(s) {
  return s.toLowerCase()
          .split(' ')
          .map(word => word.charAt(0).toUpperCase() + word.slice(1))
          .join(' ');
}

const UserHeader = () => {
  const { user } = useContext(AuthContext);
  const userName = user ? "Welcome, "+user.name : "Loading...";

  return (
    <header className="user-header">
      <h1> {titleCase(userName)}</h1>
    </header>
  );
};

export default UserHeader;
