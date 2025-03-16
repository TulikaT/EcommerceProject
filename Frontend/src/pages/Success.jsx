import React, {useContext} from "react";
import { Link } from "react-router-dom";
import { CheckCircle } from "lucide-react";
import { ThemeContext } from "../context/ThemeContext";
import "./Success.css"; // Import the CSS file


const Success = () => {
  const { theme } = useContext(ThemeContext);

  return (
    <div className={`success-container ${theme}`}>
      <div className="success-box">
        <CheckCircle className="success-icon" />
        <h2 className="success-title">Payment Successful!</h2>
        <p className="success-message">Thank you for your purchase.</p>

        <Link to="/" className="success-button">
          Go to Homepage
        </Link>
      </div>
    </div>
  );
};

export default Success;
