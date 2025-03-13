import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./Slideshow.css";

const Slideshow = ({ products }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % products.length);
    }, 3000);


    return () => clearInterval(intervalId);
  }, [products]);


  if (!products || products.length === 0) return null;

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % products.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + products.length) % products.length);
  };


  const product = products[currentIndex];

  return (
    <div className="slideshow-container">
      <button className="slideshow-btn prev" onClick={handlePrev}>
        &lt;
      </button>

      <div className="slideshow-card">
        <Link to={`/products/${product._id}`}>
          <img
            src={
              product.images && product.images[0]
                ? product.images[0]
                : "https://via.placeholder.com/200"
            }
            alt={product.name}
            className="slideshow-image"
          />
        </Link>
        <h3>{product.name}</h3>
        <p>${product.price?.toFixed(2)}</p>
      </div>

      <button className="slideshow-btn next" onClick={handleNext}>
        &gt;
      </button>
    </div>
  );
};

export default Slideshow;
