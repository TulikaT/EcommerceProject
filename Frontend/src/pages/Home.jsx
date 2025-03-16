import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "./Home.css"; 
import Slideshow from "../components/Slideshow"; 
import { toast } from "react-toastify";

const Home = ({fetchCartCount}) => {
  const [allProducts, setAllProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [slideshowProducts, setSlideshowProducts] = useState([]);
  const [latestProducts, setLatestProducts] = useState([]);
  const [mostBoughtProducts, setMostBoughtProducts] = useState([]);
  const [featuredProducts, setFeaturedProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get("http://localhost:4000/api/products");
        const products = res.data || [];

        setAllProducts(products);
        setLoading(false);


        const random3 = [...products].sort(() => 0.5 - Math.random()).slice(0, 3);
        setSlideshowProducts(random3);


        const last2 = [...products].slice(-2);
        setLatestProducts(last2);

        const mostBought = [...products]
          .sort((a, b) => (b.salesCount || 0) - (a.salesCount || 0))
          .slice(0, 2);
        setMostBoughtProducts(mostBought);


        const featured = products.slice(0, 6);
        setFeaturedProducts(featured);

      } catch (err) {
        setError("Failed to fetch products from backend.");
        setLoading(false);
        console.error(err);
      }
    };

    fetchProducts();
  }, []);

  const addToCart = async (productId) =>{
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
  }

  const addToWishlist = async (productId) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("Please log in first.");
        return;
      }
      const config = { headers: { Authorization: `Bearer ${token}` } };
      await axios.post("http://localhost:5000/api/wishlist", { productId }, config);
      toast.success("Added to Wishlist!");
    } catch (err) {
      console.error("Add to wishlist error:", err.response?.data);
      toast.error(err.response?.data?.message || "Some error occurred.");
    }
  };
  


  if (loading) return <p style={{ textAlign: "center", marginTop: "80px" }}>Loading...</p>;
  if (error) return <p style={{ textAlign: "center", marginTop: "80px" }}>{error}</p>;

  return (
    <div className="home-container">
      <h1> Fashion E-commerce </h1>
      <Slideshow products={slideshowProducts} />

      <div className="mainFeatureDiv">
      <div className="dual-section wbg">
        <div className="dual-left lo">
          {latestProducts.map((prod) => (
            
            <div key={prod._id} className="dual-product-card ">
              <div className="wishlist-btn">
    <button onClick={() => addToWishlist(prod._id)}>
      <i className="fa fa-heart"></i>
    </button>
  </div>
              <Link to={`/products/${prod._id}`}>
                <img
                  src={
                    prod.images && prod.images[0]
                      ? prod.images[0]
                      : "https://via.placeholder.com/200"
                  }
                  alt={prod.name}
                />
              </Link>
              <h4>{prod.name}</h4>
              <p>${prod.price?.toFixed(2)}</p>
              <button className="btn btn-success" onClick={() => addToCart(prod._id)}>
                  Add to Cart
              </button>
              </div>
          ))}
        </div>
        <div className="dual-right dt bit">
          <h2>Latest Arrivals</h2>
          <p>
            Check out the newest additions to our store! We update our
            inventory regularly with the latest trends and must-have items.
          </p>
        </div>
      </div>

      <div className="dual-section reversed">
        <div className="dual-left dt wit">
          <h2>Most Popular</h2>
          <p>
            Our top-selling products chosen by our happy customers.
            Don’t miss out on these favorites!
          </p>
        </div>
        <div className="dual-right">
          {mostBoughtProducts.map((prod) => (
            <div key={prod._id} className="dual-product-card white">
              <div className="wishlist-btn">
    <button onClick={() => addToWishlist(prod._id)}>
      <i className="fa fa-heart"></i>
    </button>
  </div>
              <Link to={`/products/${prod._id}`}>
                <img
                  src={
                    prod.images && prod.images[0]
                      ? prod.images[0]
                      : "https://via.placeholder.com/200"
                  }
                  alt={prod.name}
                />
              </Link>
              <h4>{prod.name}</h4>
              <p >${prod.price?.toFixed(2)}</p>
              <button className="btn btn-success" onClick={() => addToCart(prod._id)}>
                  Add to Cart
                </button>
            </div>
          ))}
        </div>
      </div>
      </div>

      <div className="featured-section">
        <h2>Featured Items</h2>
        <div className="featured-grid">
          {featuredProducts.map((prod) => (
            <div key={prod._id} className="featured-product-card">
              <div className="wishlist-btn">
    <button onClick={() => addToWishlist(prod._id)}>
      <i className="fa fa-heart"></i>
    </button>
  </div>
              <Link to={`/products/${prod._id}`}>
                <img
                  src={
                    prod.images && prod.images[0]
                      ? prod.images[0]
                      : "https://via.placeholder.com/200"
                  }
                  alt={prod.name}
                />
              </Link>
              <h4>{prod.name}</h4>
              <p >${prod.price?.toFixed(2)}</p>
              <button className="btn btn-success" onClick={() => addToCart(prod._id)}>
                  Add to Cart
                </button>
            </div>
          ))}
        </div>
        <Link to="/products" className="more-link">
          View More Products &raquo;
        </Link>
      </div>
    </div>
  );
};

export default Home;