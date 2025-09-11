import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { db } from "../firebase";
import { doc, getDoc } from "firebase/firestore";
import Navbar from "../components/Navbar";
import "./Infos.css";
import Footer from "../components/Footer";  

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
      </div>
      <Footer />
    </div>
  );
};

export default Infos;
