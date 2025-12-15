import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { db } from "../firebase";
import {
  doc,
  getDoc,
  collection,
  getDocs,
  query,
  where,
  orderBy,
} from "firebase/firestore";
import "./Timeline.css";

const Timeline = () => {
  const { noteId } = useParams();

  const [title, setTitle] = useState("");
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTimeline = async () => {
      try {
        // 1️⃣ Fetch timeline container
        const ref = doc(db, "notes", noteId);
        const snap = await getDoc(ref);

        if (snap.exists()) {
          setTitle(snap.data().title);
        }

        // 2️⃣ Fetch timeline events
        const q = query(
          collection(db, "notes"),
          where("parentId", "==", noteId),
          orderBy("order", "asc")
        );

        const snapshot = await getDocs(q);
        const eventsData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setEvents(eventsData);
      } catch (err) {
        console.error("Timeline fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchTimeline();
  }, [noteId]);

  if (loading) return <p>Loading timeline...</p>;

  return (
    <div className="timeline-wrapper">
      <h1 className="timeline-title">{title}</h1>

      <div className="timeline">
        {events.length === 0 ? (
          <p style={{ textAlign: "center", opacity: 0.6 }}>
            ჯერ არ დამატებულა
          </p>
        ) : (
          events.map((event, index) => (
            <div className="timeline-item" key={event.id}>
              <div
                className={`timeline-content ${
                  index % 2 === 0 ? "left" : "right"
                }`}
              >
                <span className="year">{event.title}</span>
                <p>{event.text}</p>
              </div>
              <div className="timeline-dot"></div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Timeline;
