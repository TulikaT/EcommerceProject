import React, { useState, useContext } from "react";
import axios from "axios";
import "./Auth.css";
import { AuthContext } from "../context/AuthProvider";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUser,
  faEnvelope,
  faLock,
  faEye,
  faEyeSlash,
  faPhone,
  faMapMarkerAlt,
  faFlag,
} from "@fortawesome/free-solid-svg-icons";

const Register = () => {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [stateField, setStateField] = useState(""); 
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const togglePassword = () => setShowPassword((prev) => !prev);
  const toggleConfirmPassword = () => setShowConfirmPassword((prev) => !prev);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
  
    try {
      const response = await axios.post("http://localhost:4000/api/auth/register", {
        name,
        email,
        phone,
        address,
        state: stateField, 
        password,
      });
      toast.success("Registration successful!");
      navigate("/login");
    } catch (err) {
      console.error("Registration error:", err.response?.data?.message || err.message);
      toast.error(err.response?.data?.message || "Registration failed. Please try again.");
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-image">
        <img src="./Images/register.png" alt="Register" />
      </div>
      <div className="auth-form">
        <form onSubmit={handleSubmit} className="register">
          <h2>Register</h2>

          <div className="input-group">
            <FontAwesomeIcon icon={faUser} className="input-icon" />
            <input 
              type="text"
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="input-group">
            <FontAwesomeIcon icon={faEnvelope} className="input-icon" />
            <input 
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="input-group">
            <FontAwesomeIcon icon={faPhone} className="input-icon" />
            <input 
              type="text"
              placeholder="Phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>

          <div className="input-group">
            <FontAwesomeIcon icon={faMapMarkerAlt} className="input-icon" />
            <input 
              type="text"
              placeholder="Address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
          </div>

          <div className="input-group">
            <FontAwesomeIcon icon={faFlag} className="input-icon" />
            <input 
              type="text"
              placeholder="State"
              value={stateField}
              onChange={(e) => setStateField(e.target.value)}
            />
          </div>

          <div className="input-group">
            <FontAwesomeIcon icon={faLock} className="input-icon" />
            <input 
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <FontAwesomeIcon 
              icon={showPassword ? faEye : faEyeSlash} 
              className="password-toggle"
              onClick={togglePassword}
            />
          </div>

          <div className="input-group">
            <FontAwesomeIcon icon={faLock} className="input-icon" />
            <input 
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
            <FontAwesomeIcon 
              icon={showConfirmPassword ? faEye : faEyeSlash} 
              className="password-toggle"
              onClick={toggleConfirmPassword}
            />
          </div>
          
          <button type="submit">Register</button>

          <div className="login-link" style={{ textAlign: "center", marginTop: "10px" }}>
            Already have an account? <Link to="/login">Login</Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;
