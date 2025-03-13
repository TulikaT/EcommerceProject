import React, { useState } from 'react';
import './Auth.css';
import { toast } from 'react-toastify';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope } from "@fortawesome/free-solid-svg-icons";
import axios from 'axios';
import { Link } from 'react-router-dom';

const ForgotPassword = () => {
  const [email, setEmail] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:4000/api/auth/forgot-password", { email });
      toast.success(res.data.message);
    } catch (error) {
      toast.error(error.response?.data?.message || "Error sending reset link");
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-image">
        <img src="./Images/forgot-password.png" alt="Forgot Password" />
      </div>
      <div className="auth-form">
        
        <form onSubmit={handleSubmit}>
        <h2>Forgot Password</h2>
          <div className="input-group">
            <FontAwesomeIcon icon={faEnvelope} className="input-icon" />
            <input 
              type="email" 
              placeholder="Enter your email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required 
            />
          </div>
          <button type="submit">Reset Password</button>
          <p className="login-link cen"> Remembered Password?&nbsp; <Link to="/login">Login</Link> </p>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;