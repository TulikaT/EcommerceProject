import React, { useContext } from "react";
import { ThemeContext } from "../context/ThemeContext";
import { AuthContext } from "../context/AuthProvider";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMoon, faSun } from "@fortawesome/free-solid-svg-icons";
import "./Header.css";


const Header = ({ cartCount }) => {
  const { theme, toggleTheme } = useContext(ThemeContext);
  const { user } = useContext(AuthContext);
  const isLight = theme === "light";

  return (
    <header className="header">
      <div className="logo">
        <h1 className="logo">
          <span className="style">Fashion</span>Ecommerce
        </h1>
      </div>
      <nav>
        <Link to="/" className="nav-link">
          Home
        </Link>

        {user ? (
          <>
            <Link
              to={user.role === "admin" ? "/admin" : "/user/profile"}
              className="nav-link"
            >
              Profile
            </Link>
            <Link to="/cart" className="cart-link">
              <i className="fa-solid fa-shopping-cart"></i>
              {/* Display the numeric cartCount */}
              <span className="cart-count">{cartCount}</span>
            </Link>
          </>
        ) : (
          <>
            <Link to="/login" className="nav-link">
              Login
            </Link>
            <Link to="/register" className="nav-link">
              Register
            </Link>
          </>
        )}

        <Link to='/about-us' className="nav-link">AboutUs </Link>
        <Link to='/contact-us' className="nav-link">ContactUs</Link>
      </nav>

      <button className="theme-toggle" id="tog" onClick={toggleTheme}>
        {isLight ? (
          <>
            <FontAwesomeIcon icon={faMoon} className="icon" /> &nbsp;
          </>
        ) : (
          <>
            <FontAwesomeIcon icon={faSun} className="icon" /> &nbsp;
          </>
        )}
      </button>
    </header>
  );
};

export default Header;

