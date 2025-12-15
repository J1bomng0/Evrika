import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { db } from "../firebase";
import { collection, getDocs, query, where, orderBy } from "firebase/firestore"; // Add orderBy import
import "./Notes.css";

// Define categories
const categories = [
  { id: 1, name: "კონსპექტები", slug: "konspektebi" },
  { id: 2, name: "კითხვა-პასუხი", slug: "pasuxi" },
  { id: 3, name: "ტესტები", slug: "testebi" },
  { id: 4, name: "რუკები", slug: "rukebi" },
  { id: 5, name: "ქრონოლოგია", slug: "kronologia" },
  { id: 6, name: "ზავები,ედიქტები...", slug: "zavebi" },
  { id: 7, name: "ბრძოლები, აჯანყებები", slug: "brdzolebi_ajankebebi" },
  { id: 8, name: "მსოფლიო ისტორიის მნიშვნელოვანი მოვლენები", slug: "movlenebi"},
  { id: 9, name: "ილუსტრაციები", slug: "ilustraciebi" },
];

const Notes = () => {
  const { slug } = useParams();
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);

  // Find category name
  const category = categories.find((cat) => cat.slug === slug);
  const categoryName = category ? category.name : "საკითხები";

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        // Updated query to include orderBy
        const q = query(
          collection(db, "notes"),
          where("category", "==", slug),
          orderBy("order", "asc") // Ensure notes are sorted by the 'order' field
        );
        const querySnapshot = await getDocs(q);
        const notesData = querySnapshot.docs
  .map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }))
  .filter((note) => !note.parentId) // ⬅️ ONLY containers
  .map((note) => ({
    id: note.id,
    name: note.title,
  }));

        setNotes(notesData);
      } catch (err) {
        console.error("Error fetching notes: ", err);
      } finally {
        setLoading(false);
      }
    };

    fetchNotes();
  }, [slug]);

  return (
    <div className="container_">
      <h1>{categoryName}</h1> {/* Dynamic category name */}
      <div className="card_container_">
        {loading ? (
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