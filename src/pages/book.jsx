import React from 'react'
import bannerImage from "../assets/book_cover.png";
import "./Book.css";

const Book = () => {
  return (
    <div style={{backgroundColor: '#D9CFCB'}}>
        <div className="banner1" >
            <img src={bannerImage} alt="bookCover"/>
        </div>
    </div>
  )
}

export default Book