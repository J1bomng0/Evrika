import React from "react";
import "./StudyPath.css";

const StudyPath = () => {
  return (
    <div className="study-container">
      {/* Left Arrow & Text */}
      <div className="arrow-container left">
        <div className="arrow"><a href="./">←</a></div>
        <div className="arrow-text">
          <p>სწავლას დაუბრუნდი</p>
        </div>
      </div>

      {/* Image */}
      <div className="image-container">
        <img src="/images/path.jpg" alt="Path Choice" />
      </div>

      {/* Right Arrow & Text */}
      <div className="arrow-container right">
        <div className="arrow"><a href="https://www.youtube.com/watch?v=65pky2hQ5wc">→</a></div>
        <div className="arrow-text">
          <p>წყურვილი დაიკმაყოფილე</p>
        </div>
      </div>
    </div>
  );
};

export default StudyPath;
