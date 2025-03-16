// src/pages/user/UserWishlist.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import "./UserWishlist.css";

const UserWishlist = ({ fetchCartCount }) => {
  const [wishlist, setWishlist] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchWishlist = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setError("No token found. Please log in first.");
          setLoading(false);
          return;
        }
        const config = { headers: { Authorization: `Bearer ${token}` } };
        const res = await axios.get("http://localhost:4000/api/wishlist", config);
        setWishlist(res.data);
      } catch (err) {
        console.error("Failed to fetch wishlist:", err);
        setError("Failed to fetch wishlist");
      } finally {
        setLoading(false);
      }
    };
    fetchWishlist();
  }, []);

  const handleRemoveFromWishlist = async (productId) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("Not logged in");
        return;
      }
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const res = await axios.delete(`http://localhost:4000/api/wishlist/${productId}`, config);
      setWishlist(res.data);
      fetchCartCount();
      toast.success("Item removed from wishlist");
    } catch (err) {
      toast.error("Failed to remove item");
      console.error(err);
    }
  };

  const handleAddToCart = async (productId) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("Not logged in");
        return;
      }
      const config = { headers: { Authorization: `Bearer ${token}` } };
      await axios.post("http://localhost:4000/api/cart", { productId, quantity: 1 }, config);
      fetchCartCount();
      toast.success("Added to cart!");
    } catch (err) {
      toast.error("Failed to add to cart.");
      console.error(err);
    }
  };

  if (loading) return <p>Loading wishlist...</p>;
  if (error) return <p>{error}</p>;

  if (!wishlist || !wishlist.items || wishlist.items.length === 0) {
    return (
      <div className="user-wishlist">
        <h2>My Wishlist</h2>
        <p>Your wishlist is empty.</p>
      </div>
    );
  }

  return (
    <div className="user-wishlist">
      <h2>My Wishlist</h2>
      <div className="wishlist-cards">
        {wishlist.items.map((item, index) => {
          const product = item.product;
          if (!product) return null;
          const priceValue = product.price ? product.price.toFixed(2) : "0.00";
          return (
            <div key={item._id} className="wishlist-card">
              <div className="wishlist-serial">#{index + 1}</div>
              <div className="wishlist-card-image">
                <Link to={`/products/${product._id}`}>
                  <img
                    src={product.images && product.images[0] ? product.images[0] : "https://via.placeholder.com/150"}
                    alt={product.name}
                  />
                </Link>
              </div>
              <div className="wishlist-card-body">
                <Link to={`/products/${product._id}`} className="wishlist-product-name-link">
                  <h3 className="wishlist-product-name">{product.name}</h3>
                </Link>
                <p className="wishlist-price">${priceValue}</p>
              </div>
              <div className="wishlist-card-footer">
                <button
                  className="wishlist-cart-btn"
                  onClick={() => handleAddToCart(product._id)}
                >
                  Add to Cart
                </button>
                <button
                  className="wishlist-remove-btn"
                  onClick={() => handleRemoveFromWishlist(product._id)}
                >
                  Remove
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default UserWishlist;