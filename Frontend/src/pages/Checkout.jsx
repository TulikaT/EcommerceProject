import React, { useState } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";
import { loadStripe } from "@stripe/stripe-js";
import { toast } from "react-toastify";
import "./Checkout.css";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

const Checkout = () => {
  const [loading, setLoading] = useState(false);
  const location = useLocation();
  const totalAmount = location.state?.total || 0; 

  const handleCheckout = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      
      if (!token) {
        toast.error("Please log in to proceed with payment.");
        return;
      }

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const res = await axios.post(
        "http://localhost:4000/api/payment/create-checkout-session",
        {totalAmount},
        config 
      );
  
      const sessionId = res.data.id;

      const stripe = await stripePromise;
      const { error } = await stripe.redirectToCheckout({ sessionId });
  
      if (error) {
        toast.error(error.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.error || "Payment failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="checkout-container">
      <div className="checkout-card">
        <h2>Secure Checkout</h2>
        <p>Total Amount: ${totalAmount.toFixed(2)}</p>
        
        <button 
          className="checkout-btn"
          onClick={handleCheckout}
          disabled={loading}
        >
          {loading ? "Processing..." : "Pay Now"}
        </button>
        
        {loading && <p className="loading-text">Redirecting to Stripe...</p>}
      </div>
    </div>
  );
};

export default Checkout;