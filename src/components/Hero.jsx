import React from "react";
import heroImage from "../assets/egy.jpg";
import './Hero.css'

function Hero() {
  return (
    <div className="banner" >
        <img src={heroImage} alt="Cleopatra"/>
        <h1 >სწავლა გინდა? <br /> ისწავლე! </h1>
    </div>
  );
}

export default Hero;
