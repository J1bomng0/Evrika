import React from "react";
import heroImage from "../assets/egy.jpg";
import './Hero.css'

function Hero() {
  return (
    <div className="banner" >
        <img src={heroImage} alt="Cleopatra"/>
        <div className="hero-content">
          <h1>ევრიკა - მე ის ვიპოვე! </h1>
          <p>ისტორიის სასწავლო მასალები და კონსპექტები აბიტურიენტებისთვის</p>
        </div>
    </div>
  );
}

export default Hero;
