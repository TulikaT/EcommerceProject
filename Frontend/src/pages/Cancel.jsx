import React , { useContext } from "react";
import { Link } from "react-router-dom";
import { XCircle } from "lucide-react";
import { ThemeContext } from "../context/ThemeContext";
import "./Cancel.css"; // Import the CSS file


const Cancel = () => {
  const { theme } = useContext(ThemeContext); // Get current theme

  return (
    <div className={`cancel-container ${theme}`}>
      <div className="cancel-box">
        <XCircle className="cancel-icon" />
        <h2 className="cancel-title">Payment Canceled</h2>
        <p className="cancel-message">
          Your payment was canceled. Please try again.
        </p>

        <Link to="/" className="cancel-button">
          Go to Homepage
        </Link>
      </div>
    </div>
  );
};

export default Cancel;