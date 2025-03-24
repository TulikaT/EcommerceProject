import React, { useState, useEffect } from "react";
import "./Auth.css";
import { toast } from "react-toastify";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLock, faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

const ResetPassword = () => {
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmNewPassword, setShowConfirmNewPassword] = useState(false);
  
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const email = searchParams.get("email");
  
  const navigate = useNavigate();

  useEffect(() => {
    if (!token || !email) {
      toast.error("Invalid or missing reset token. Redirecting to forgot password...");
      setTimeout(() => navigate("/forgot-password"), 3000);
    }
  }, [token, email, navigate]);

  const toggleNewPassword = () => setShowNewPassword((prev) => !prev);
  const toggleConfirmNewPassword = () => setShowConfirmNewPassword((prev) => !prev);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!token || !email) {
      toast.error("Invalid or missing reset token. Please check your email link.");
      return;
    }

    if (newPassword !== confirmNewPassword) {
      toast.error("Passwords do not match");
      return;
    }

    try {
      const res = await axios.post("http://localhost:4000/api/auth/reset-password", {
        token,
        email,
        newPassword,
      });

      toast.success(res.data.message);
      navigate("/login");
    } catch (error) {
      console.error("Error resetting password:", error.response?.data || error.message);
      toast.error(error.response?.data?.message || "Error resetting password");
    }
  };

  if (!token || !email) {
    return null; // Prevents rendering the form if token or email is missing
  }

  return (
    <div className="auth-container">
      <div className="auth-image">
        <img src="./Images/reset_password.png" alt="Reset Password" />
      </div>
      <div className="auth-form">
        <form onSubmit={handleSubmit}>
          <h2>Reset Password</h2>
          <div className="input-group">
            <FontAwesomeIcon icon={faLock} className="input-icon" />
            <input 
              type={showNewPassword ? "text" : "password"}
              placeholder="New Password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
            <FontAwesomeIcon 
              icon={showNewPassword ? faEye : faEyeSlash}
              className="password-toggle"
              onClick={toggleNewPassword}
            />
          </div>
          <div className="input-group">
            <FontAwesomeIcon icon={faLock} className="input-icon" />
            <input 
              type={showConfirmNewPassword ? "text" : "password"}
              placeholder="Confirm New Password"
              value={confirmNewPassword}
              onChange={(e) => setConfirmNewPassword(e.target.value)}
              required
            />
            <FontAwesomeIcon 
              icon={showConfirmNewPassword ? faEye : faEyeSlash}
              className="password-toggle"
              onClick={toggleConfirmNewPassword}
            />
          </div>
          <button type="submit">Update Password</button>
          <p className="login-link cen">
            Remembered Password?&nbsp; <Link to="/login">Login</Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
