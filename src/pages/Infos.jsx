import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { db } from "../firebase";
import { doc, getDoc } from "firebase/firestore";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";  
import "./Infos.css";

// ImagesSlider component
const ImagesSlider = ({ images }) => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
  };

  return (
    <Slider {...settings}>
      {images.map((url, index) => (
        <div key={index}>
          <img src={url} alt={`Slide ${index}`} className="slider-image" />
        </div>
      ))}
    </Slider>
  );
};

const Infos = () => {
  const { noteId } = useParams(); 
  const [note, setNote] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNote = async () => {
      try {
        const docRef = doc(db, "notes", noteId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setNote(docSnap.data());
        } else {
          console.log("No such note!");
        }
      } catch (error) {
        console.error("Error fetching note:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchNote();
  }, [noteId]);

  if (loading) return <p>Loading...</p>;
  if (!note) return <p>Note not found</p>;

  const linksArray = note.sources ? note.sources.split(",").map(s => s.trim()) : [];

  return (
    <div>
      <div className="info-container">
        <h1 className="info-title">{note.title}</h1>
        <p className="info-text">{note.text || "ჯერ არ დამატებულა"}</p>

        {/* Images Slider */}
        {note.images && note.images.length > 0 && (
          <div className="info-images">
            <ImagesSlider images={note.images} />
          </div>
        )}

        {/* Other Resources */}
        {linksArray.length > 0 && (
          <div className="info-links">
            <h3>სხვა რესურსები:</h3>
            <ul>
              {linksArray.map((link, index) => (
                <li key={index}>
                  <a href={link} target="_blank" rel="noopener noreferrer">
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Files */}
        {note.files && note.files.length > 0 && (
          <div className="info-files">
            <h3>ფაილები:</h3>
            <ul>
              {note.files.map((file, index) => (
                <li key={index}>
                  <a href={file} target="_blank" rel="noopener noreferrer">
                    {file.split("/").pop()} {/* Shows file name */}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default Infos;
