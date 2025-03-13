import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import "./Cart.css";

const Cart = ({ fetchCartCount }) => {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchCart = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("Please log in to view your cart.");
        setLoading(false);
        return;
      }
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const res = await axios.get("http://localhost:4000/api/cart", config);
      setCart(res.data);
      setLoading(false);
    } catch (err) {
      setError("Failed to fetch cart");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const handleCheckout = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("Please log in first.");
        return;
      }
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const res = await axios.post("http://localhost:4000/api/cart/checkout", {}, config);
      toast.success("Checkout successful!");
      setCart(res.data.cart);
      fetchCartCount();
    } catch (error) {
      toast.error("Checkout failed!");
    }
  };

  const handleIncrement = async (productId, currentQty) => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Please log in first.");
      return;
    }
    const config = { headers: { Authorization: `Bearer ${token}` } };
    try {
      const newQty = currentQty + 1;
      const res = await axios.put("http://localhost:4000/api/cart", { productId, quantity: newQty }, config);
      setCart(res.data);
      fetchCartCount();
    } catch (err) {
      toast.error("Failed to increment quantity.");
      console.error(err);
    }
  };

  const handleDecrement = async (productId, currentQty) => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Please log in first.");
      return;
    }
    if (currentQty <= 1) {
      try {
        const config = { headers: { Authorization: `Bearer ${token}` } };
        const res = await axios.delete(`http://localhost:4000/api/cart/${productId}`, config);
        setCart(res.data);
        fetchCartCount();
        toast.success("Item removed from cart");
      } catch (err) {
        toast.error("Failed to remove item.");
        console.error(err);
      }
      return;
    }
    const config = { headers: { Authorization: `Bearer ${token}` } };
    const newQty = currentQty - 1;
    try {
      const res = await axios.put("http://localhost:4000/api/cart", { productId, quantity: newQty }, config);
      setCart(res.data);
      fetchCartCount();
    } catch (err) {
      toast.error("Failed to decrement quantity.");
      console.error(err);
    }
  };

  if (loading) return <p>Loading cart...</p>;
  if (error) return <p>{error}</p>;
  if (!cart || !cart.items || cart.items.length === 0) return <p>Your cart is empty.</p>;
  const subtotal = cart.items.reduce((acc, item) => {
    const price = item.product?.price || 0;
    return acc + price * item.quantity;
  }, 0);
  const shipping = 0;
  const tax = subtotal * 0.07;
  const total = subtotal + shipping + tax;

  return (
    <div className="cart-container">
      <div className="cart-items-section">
        <h2 className="cart-title">MY SHOPPING BAG</h2>
        {cart.items.map((item) => {
          const product = item.product;
          if (!product) return null;
          const lineTotal = (product.price * item.quantity).toFixed(2);
          return (
            <div key={item._id} className="cart-item">
              <div className="item-image">
                <Link to={`/products/${product._id}`}>
                  <img
                    src={
                      product.images && product.images[0]
                        ? product.images[0]
                        : "https://via.placeholder.com/150"
                    }
                    alt={product.name}
                  />
                </Link>
              </div>
              <div className="item-details">
                <Link to={`/products/${product._id}`} className="item-name-link">
                  <h3>{product.name}</h3>
                </Link>
                <p>Price: ${product.price.toFixed(2)}</p>
                <div className="quantity-controls">
                  <button className="qty-btn" onClick={() => handleDecrement(product._id, item.quantity)}>–</button>
                  <span className="qty-value">{item.quantity}</span>
                  <button className="qty-btn" onClick={() => handleIncrement(product._id, item.quantity)}>+</button>
                </div>
              </div>
              <div className="item-total">${lineTotal}</div>
            </div>
          );
        })}
      </div>

      <div className="cart-summary-section">
        <h2>SUMMARY</h2>
        <div className="promo-code">
          <input type="text" placeholder="Do you have a promo code?" />
          <button>APPLY</button>
        </div>
        <div className="summary-line">
          <span>Subtotal</span>
          <span>${subtotal.toFixed(2)}</span>
        </div>
        <div className="summary-line">
          <span>Shipping</span>
          <span>${shipping.toFixed(2)}</span>
        </div>
        <div className="summary-line">
          <span>Sales Tax</span>
          <span>${tax.toFixed(2)}</span>
        </div>
        <div className="summary-total">
          <span>Estimated Total</span>
          <span>${total.toFixed(2)}</span>
        </div>
        <button className="checkout-btn" onClick={handleCheckout}>CHECKOUT</button>
        <p className="help-text">
          Need help? Call us at <strong>1-877-789-4622</strong>
        </p>
      </div>
    </div>
  );
};

export default Cart;
