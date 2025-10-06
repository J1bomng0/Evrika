import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { db } from "../firebase";
import { collection, getDocs, query, where } from "firebase/firestore";
import "./Notes.css";

const Notes = () => {
  const { slug } = useParams();
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true); // new state

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const q = query( collection(db, "notes"), where("category", "==", slug) );
        const querySnapshot = await getDocs(q);
        const notesData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          name: doc.data().title, // use note title as name
        }));
        setNotes(notesData);
      } catch (err) {
        console.error("Error fetching notes: ", err);
      } finally {
        setLoading(false); // stop loading once fetch is done
      }
    };

    fetchNotes();
  }, [slug]);

  return (
    <div className="container_">
      <h1>საკითხები</h1>
      <div className="card_container_">
        {loading ? (
          // 👇 Skeleton placeholder
          <div className="card_">
            <h2 className="card_title_ skeleton"></h2>
          </div>
        ) : notes.length === 0 ? (
          <p>ჯერ არ დამატებულა</p>
        ) : (
          notes.map((note) => (
            <Link
              to={`/category/${slug}/${note.id}`}
              key={note.id}
              className="card_"
            >
              <h2 className="card_title_">{note.name}</h2>
            </Link>
          ))
        )}
      </div>
    </div>
  );
};

export default Notes;
