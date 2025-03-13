// src/App.jsx
import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import axios from "axios";
import Home from "./pages/Home";
import Register from "./pages/Register"; // renamed to Register
import Login from "./pages/Login";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import Products from "./pages/Products";
import ProductDetails from "./pages/ProductDetails";
import Cart from "./pages/Cart";
import Header from "./components/Header";
import Footer from "./components/Footer";
import AboutUs from "./pages/AboutUs";
import ContactUs from "./pages/ContactUs";

const AppContent = ({ fetchCartCount, cartCount }) => {
  // useLocation to determine the current path
  const location = useLocation();
  // Check if the current path is an admin route.
  const isAdminRoute = location.pathname.startsWith("/admin");

  return (
    <>
      {/* Render Header and Footer only if not on an admin route */}
      { <Header cartCount={cartCount} fetchCartCount={fetchCartCount} />}
      <div className="main-content">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home fetchCartCount={fetchCartCount}/>} />
          <Route path="/contact-us" element={<ContactUs/>} />
          <Route path="/about-us" element={<AboutUs />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/products" element={<Products fetchCartCount={fetchCartCount}/>} />
          <Route path="/products/:id" element={<ProductDetails />} />
          <Route path="/cart" element={<Cart fetchCartCount={fetchCartCount} />} />
          {/* <Route path="/checkout" element={<Checkout />} />
          <Route path="/success" element={<Success />} />
          <Route path="/cancel" element={<Cancel />} /> */}

          {/* Admin Routes
          <Route path="/admin" element={<AdminDashboard />}>
            <Route index element={<AdminHome />} />
            <Route path="products" element={<AdminProducts />} />
            <Route path="orders" element={<AdminOrders />} />
            <Route path="users" element={<AdminUsers />} />
            <Route path="analytics" element={<AdminAnalytics />} />
            <Route path="notifications" element={<AdminNotifications />} />
            <Route path="settings" element={<AdminSettings />} />
          </Route>

          {/* User Dashboard Routes */}{/*
          <Route path="/user" element={<UserDashboard />}>
            <Route path="profile" element={<UserProfile />} />
            <Route path="orders" element={<UserOrders />} />
            <Route path="wishlist" element={<UserWishlist fetchCartCount={fetchCartCount} />} />
          </Route>*/}
        </Routes> 
      </div>
      { <Footer />}
    </>
  );
};

const App = () => {
  const [cartCount, setCartCount] = useState(0);

  // This function fetches the cart from backend, calculates total items, and sets cartCount
  const fetchCartCount = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setCartCount(0);
        return;
      }
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const res = await axios.get("http://localhost:4000/api/cart", config);
      const totalItems = res.data.items.reduce((acc, item) => acc + item.quantity, 0);
      setCartCount(totalItems);
    } catch (err) {
      console.log("Failed to fetch cart count", err);
      setCartCount(0);
    }
  };

  useEffect(() => {
    fetchCartCount();
  }, []);

  return (
    <Router>
      <AppContent cartCount={cartCount} fetchCartCount={fetchCartCount} />
    </Router>
  );
};

export default App;
