import React, { useState, useEffect } from "react";
import { db } from "../firebase";
import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  orderBy,
  deleteDoc,
  doc,
} from "firebase/firestore";
import "./Dashboard.css";

const categories = [
  { id: 1, name: "კონსპექტები", slug: "konspektebi" },
  { id: 2, name: "კითხვა-პასუხი", slug: "pasuxi" },
  { id: 3, name: "ტესტები", slug: "testebi" },
  { id: 4, name: "რუკები", slug: "rukebi" },
  { id: 5, name: "ქრონოლოგია", slug: "kronologia" },
  { id: 6, name: "ზავები,ედიქტები...", slug: "zavebi" },
  { id: 7, name: "ბრძოლები, აჯანყებები", slug: "brdzolebi_ajankebebi" },
  { id: 8, name: "მსოფლიო ისტორიის მნიშვნელოვანი მოვლენები", slug: "movlenebi" },
  { id: 9, name: "ილუსტრაციები", slug: "ilustraciebi" },
];

const Dashboard = () => {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [notes, setNotes] = useState([]);

  const [timelineContainers, setTimelineContainers] = useState([]);
  const [isTimelineEvent, setIsTimelineEvent] = useState(false);
  const [selectedTimelineId, setSelectedTimelineId] = useState("");

  const [newNote, setNewNote] = useState({
    title: "",
    text: "",
  });

  /* ---------------- FETCH NOTES ---------------- */

  useEffect(() => {
    if (!selectedCategory) return;

    const fetchNotes = async () => {
      const q = query(
        collection(db, "notes"),
        where("category", "==", selectedCategory.slug),
        orderBy("order", "asc")
      );
      const snap = await getDocs(q);
      setNotes(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    };

    fetchNotes();
  }, [selectedCategory]);

  /* -------- FETCH TIMELINE CONTAINERS -------- */

  useEffect(() => {
    if (selectedCategory?.slug !== "kronologia") return;

    const fetchContainers = async () => {
      const q = query(
        collection(db, "notes"),
        where("category", "==", "kronologia")
      );
      const snap = await getDocs(q);
      setTimelineContainers(
        snap.docs
          .map((d) => ({ id: d.id, ...d.data() }))
          .filter((n) => !n.parentId)
      );
    };

    fetchContainers();
  }, [selectedCategory]);

  /* ---------------- ADD NOTE ---------------- */

  const handleAddNote = async (e) => {
    e.preventDefault();
    if (!selectedCategory) return;

    if (
      selectedCategory.slug === "kronologia" &&
      isTimelineEvent &&
      !selectedTimelineId
    ) {
      alert("აირჩიე ქრონოლოგია");
      return;
    }

    const siblings = notes.filter(
      (n) =>
        n.parentId ===
        (selectedCategory.slug === "kronologia" && isTimelineEvent
          ? selectedTimelineId
          : null)
    );

    await addDoc(collection(db, "notes"), {
      title: newNote.title,
      text: newNote.text,
      category: selectedCategory.slug,
      parentId:
        selectedCategory.slug === "kronologia" && isTimelineEvent
          ? selectedTimelineId
          : null,
      order: siblings.length,
      createdAt: new Date(),
    });

    setNewNote({ title: "", text: "" });
    setIsTimelineEvent(false);
    setSelectedTimelineId("");
  };

  /* ---------------- DELETE ---------------- */

  const handleDelete = async (id) => {
    if (!window.confirm("წაშლა გინდა?")) return;
    await deleteDoc(doc(db, "notes", id));
    setNotes((prev) => prev.filter((n) => n.id !== id));
  };

  const visibleNotes =
    selectedCategory?.slug === "kronologia"
      ? notes.filter((n) => !n.parentId)
      : notes;

  /* ---------------- RENDER ---------------- */

  return (
    <div className="dashboard-container">
      {!selectedCategory ? (
        <>
          <h1>აირჩიე კატეგორია</h1>
          <div className="category-list">
            {categories.map((c) => (
              <button
                key={c.id}
                className="category-button"
                onClick={() => setSelectedCategory(c)}
              >
                {c.name}
              </button>
            ))}
          </div>
        </>
      ) : (
        <>
          <button
            className="back-button"
            onClick={() => setSelectedCategory(null)}
          >
            ← დაბრუნება
          </button>

          <h2>{selectedCategory.name}</h2>

          <form onSubmit={handleAddNote} className="dashboard-form">
            {selectedCategory.slug === "kronologia" && (
              <div>
                <label>
                  <input
                    type="checkbox"
                    checked={isTimelineEvent}
                    onChange={(e) => {
                      setIsTimelineEvent(e.target.checked);
                      setSelectedTimelineId("");
                    }}
                  />{" "}
                  ქრონოლოგიის მოვლენა
                </label>

                {isTimelineEvent && (
                  <select
                    value={selectedTimelineId}
                    onChange={(e) => setSelectedTimelineId(e.target.value)}
                    required
                  >
                    <option value="">აირჩიე ქრონოლოგია</option>
                    {timelineContainers.map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.title}
                      </option>
                    ))}
                  </select>
                )}
              </div>
            )}

            <input
              type="text"
              placeholder="სათაური"
              value={newNote.title}
              onChange={(e) =>
                setNewNote({ ...newNote, title: e.target.value })
              }
              required
            />

            <textarea
              placeholder="ტექსტი"
              value={newNote.text}
              onChange={(e) =>
                setNewNote({ ...newNote, text: e.target.value })
              }
            />

            <button type="submit">დამატება</button>
          </form>

          <div className="notes-list">
            {visibleNotes.map((note) => (
              <div key={note.id} className="note-item">
                <h3>{note.title}</h3>
                <button onClick={() => handleDelete(note.id)}>წაშლა</button>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default Dashboard;
