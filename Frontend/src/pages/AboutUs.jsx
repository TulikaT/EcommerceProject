import React from "react";
import "./AboutUs.css";  

function AboutUs() {
  return (
    <div className="aboutus-container">
      <div className="left-side">
        <img src="./Images/AboutUs.png" alt="About Us Illustration" />
      </div>

      <div className="right-side">
        <h2>ABOUT US</h2>
        <p className="highlight">
          Shop with comfort and style, anytime, anywhere!
        </p>
        <p>
          Register yourself, log in, and explore a wide range of fashionable collections.
        </p>
        <p>
          Our brand focuses on creativity, quality, and trendy designs for every occasion.
        </p>
        <p>
          We are committed to sustainability while keeping you in style.
        </p>
        <p>Join us and discover the latest trends in fashion!</p>
        <p className="tagline">Happy Shopping!</p>
      </div>
    </div>
  );
}

export default AboutUs;