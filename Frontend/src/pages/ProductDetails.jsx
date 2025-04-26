import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import "./ProductDetails.css"; 
import { toast } from "react-toastify";

const ProductDetails = ({fetchCartCount}) => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await axios.get(`http://localhost:4000/api/products/${id}`);
        setProduct(res.data);
      } catch (err) {
        setError("Failed to fetch product details");
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const handleAddToCart = async (productId) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("Please log in first.");
        return;
      }
      const config = { headers: { Authorization: `Bearer ${token}` } };
      await axios.post("http://localhost:4000/api/cart", { productId, quantity: 1 }, config);
      fetchCartCount()
      toast.success("Added to cart!");
    } catch (err) {
      console.error("Add to cart error:", err.response?.data);
      toast.error(err.response?.data?.message || "Some error occurred.");
    }
  };

  if (loading) return <p>Loading product details...</p>;
  if (error) return <p>{error}</p>;
  if (!product) return <p>Product not found</p>;

  return (
    <div className="product-details-container">
      <div className="product-details-wrapper">
        <div className="product-image-section">
          <img
            src={
              product.images && product.images[0]
                ? product.images[0]
                : "https://via.placeholder.com/400"
            }
            alt={product.name}
          />
        </div>

        <div className="product-info-section">
          <h2>{product.name}</h2>
          <span className="price">${product.price.toFixed(2)}</span>
          <span className="category">Category: {product.category}</span>
          <span className="stock">Stock: {product.stockCount}</span>
          <p className="description">{product.description}</p>
          
          <button className="add-to-cart-btn" onClick={() => handleAddToCart(product._id)}>
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;