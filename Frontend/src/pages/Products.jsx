import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import "./Products.css";

const Products = ({fetchCartCount}) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOption, setSortOption] = useState("priceAsc");
  
  const limitWords = (text="", wordLimit) => {
    const words = text.split(" ");
    return words.length > wordLimit ? words.slice(0, wordLimit).join(" ") + "..." : text;
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get("http://localhost:4000/api/products");
        setProducts(res.data);
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch products");
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortOption === "priceAsc") return a.price - b.price;
    if (sortOption === "priceDesc") return b.price - a.price;
    if (sortOption === "nameAsc") return a.name.localeCompare(b.name);
    return 0;
  });

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

  const handleAddToWishlist = async (productId) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("Please log in first.");
        return;
      }
      const config = { headers: { Authorization: `Bearer ${token}` } };
      await axios.post("http://localhost:4000/api/wishlist", { productId }, config);
      toast.success("Added to wishlist!");
    } catch (err) {
      console.error("Add to wishlist error:", err.response?.data);
      toast.error(err.response?.data?.message || "Some error occurred.");
    }
  };

  if (loading) return <p className="loading-msg">Loading products...</p>;
  if (error) return <p className="error-msg">{error}</p>;

  return (
    <div className="products-page">
      <h2 className="products-title">Products</h2>

      <div className="product-controls">
        <input
          type="text"
          placeholder="Search products..."
          className="search-input"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <select
          value={sortOption}
          className="sort-select"
          onChange={(e) => setSortOption(e.target.value)}
        >
          <option value="priceAsc">Price: Low to High</option>
          <option value="priceDesc">Price: High to Low</option>
          <option value="nameAsc">Name: A to Z</option>
        </select>
      </div>

      <div className="product-grid">
        {sortedProducts.map((product) => (
          <div key={product._id} className="product-card">
            <button
              className="wishlist-btn"
              onClick={() => handleAddToWishlist(product._id)}
            >
              <i className="fa-solid fa-heart"></i>
            </button>
            <Link to={`/products/${product._id}`} className="product-link">
              <img
                src={
                  product.images && product.images[0]
                    ? product.images[0]
                    : "https://via.placeholder.com/200"
                }
                alt={product.name}
                className="product-image"
              />
              <h3 className="product-name">{limitWords(String(product.name), 2)}</h3>
              {console.log(limitWords(String(product.name),2))}
            </Link>
            <p className="product-price">${product.price.toFixed(2)}</p>
            <button
              className="product-btn"
              onClick={() => handleAddToCart(product._id)}
            >
              Add to Cart
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Products;