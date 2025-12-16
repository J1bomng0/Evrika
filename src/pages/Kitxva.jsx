import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase"; // adjust path if needed
import "./Kitxva.css";

const Kitxva = () => {
  const { noteId } = useParams();
  const [note, setNote] = useState(null);
  const [openIndex, setOpenIndex] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNote = async () => {
      try {
        const ref = doc(db, "notes", noteId); // ⚠️ collection name
        const snap = await getDoc(ref);

        if (snap.exists()) {
          setNote(snap.data());
        }
      } catch (err) {
        console.error("Failed to load Q&A note:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchNote();
  }, [noteId]);

  if (loading) return <p style={{ textAlign: "center" }}>Loading...</p>;
  if (!note) return <p style={{ textAlign: "center" }}>Not found</p>;

  return (
    <div className="qa-page">
      <h1 className="qa-title">{note.title}</h1>

      <div className="qa-container">
        {note.items?.map((item, index) => (
          <div key={index} className="qa-item">
            <button
              className="qa-question"
              onClick={() =>
                setOpenIndex(openIndex === index ? null : index)
              }
            >
              {item.q}
              <span className={openIndex === index ? "arrow open" : "arrow"}>
                ▾
              </span>
            </button>

            {openIndex === index && (
              <div className="qa-answer">{item.a}</div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Kitxva;
