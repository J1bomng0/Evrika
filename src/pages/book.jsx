import React from "react";
import bannerImage from "../assets/book_cover.png";
import file1 from "../assets/part1.pdf";
import file2 from "../assets/part2.pdf";
import "./Book.css";

const Book = () => {
  return (
    <div className="book-page">
      {/* Banner */}
      <div className="banner1">
        <img src={bannerImage} alt="book cover" />
      </div>

      {/* Downloads */}
      <div className="downloads">
        <h2 className="downloads-title">დააკლიკეთ გადმოსაწერად:</h2>

        <div className="files">
          <a href={file1} download className="file-item">
            <img src="/images/file-icon.png" alt="file 1" />
            <span>ნაწილი 1</span>
          </a>

          <a href={file2} download className="file-item">
            <img src="/images/file-icon.png" alt="file 2" />
            <span>ნაწილი 2</span>
          </a>
        </div>
      </div>
    </div>
  );
};

export default Book;
