import React, { useState, useEffect, useMemo } from "react";
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
  writeBatch, 
  updateDoc,
} from "firebase/firestore";
import "./Dashboard.css";

import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
  arrayMove,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

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

// ✅ small inline sortable item using your existing note-item styling
function SortableNoteItem({ note, onDelete, onEdit }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: note.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.6 : 1,
    cursor: "grab",
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="note-item"
      {...attributes}
      {...listeners}
    >
      <h3>{note.title}</h3>

      <button
        onClick={(e) => {
          e.stopPropagation();
          onEdit(note);
        }}
      >
        რედაქტირება
      </button>

      <button
        onClick={(e) => {
          e.stopPropagation(); // ✅ so clicking delete doesn't start dragging
          onDelete(note.id);
        }}
      >
        წაშლა
      </button>
    </div>
  );
}

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

  const [editingId, setEditingId] = useState(null);

  // ✅ dnd sensors
  const sensors = useSensors(useSensor(PointerSensor));

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

      // keep your structure, but ensure order is numeric (helps stability)
      setNotes(
        snap.docs.map((d) => ({
          id: d.id,
          ...d.data(),
          order: Number(d.data()?.order ?? 0),
        }))
      );
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

  const parentId =
    selectedCategory.slug === "kronologia" && isTimelineEvent
      ? selectedTimelineId
      : null;

  if (editingId) {
    await updateDoc(doc(db, "notes", editingId), {
      title: newNote.title,
      text: newNote.text,
      category: selectedCategory.slug,
      parentId,
    });

    setNotes((prev) =>
      prev.map((n) =>
        n.id === editingId
          ? {
              ...n,
              title: newNote.title,
              text: newNote.text,
              category: selectedCategory.slug,
              parentId,
            }
          : n
      )
    );
  } else {
    const siblings = notes.filter((n) => n.parentId === parentId);

    await addDoc(collection(db, "notes"), {
      title: newNote.title,
      text: newNote.text,
      category: selectedCategory.slug,
      parentId,
      order: siblings.length,
      createdAt: new Date(),
    });
  }

  setNewNote({ title: "", text: "" });
  setEditingId(null);
  setIsTimelineEvent(false);
  setSelectedTimelineId("");
};

  const handleEdit = (note) => {
  setEditingId(note.id);
  setNewNote({
    title: note.title || "",
    text: note.text || "",
  });

  if (selectedCategory?.slug === "kronologia") {
    if (note.parentId) {
      setIsTimelineEvent(true);
      setSelectedTimelineId(note.parentId);
    } else {
      setIsTimelineEvent(false);
      setSelectedTimelineId("");
    }
  }
};

  /* ---------------- DELETE ---------------- */

  const handleDelete = async (id) => {
    if (!window.confirm("წაშლა გინდა?")) return;
    await deleteDoc(doc(db, "notes", id));
    setNotes((prev) => prev.filter((n) => n.id !== id));
  };

  const visibleNotes =
    selectedCategory?.slug === "kronologia"
      ? notes.filter((n) => !n.parentId) // containers only
      : notes;

  // ✅ ids for SortableContext
  const visibleIds = useMemo(
    () => visibleNotes.map((n) => n.id),
    [visibleNotes]
  );

  /* ---------------- DRAG END (SAVE ORDER) ---------------- */

  const handleDragEnd = async (event) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = visibleNotes.findIndex((n) => n.id === active.id);
    const newIndex = visibleNotes.findIndex((n) => n.id === over.id);
    if (oldIndex < 0 || newIndex < 0) return;

    // Reorder ONLY what is visible
    const movedVisible = arrayMove(visibleNotes, oldIndex, newIndex);

    // Normalize orders to 1..N (fixes duplicates)
    const normalizedVisible = movedVisible.map((n, i) => ({
      ...n,
      order: i + 1,
    }));

    // Update local notes state without breaking the rest:
    // - if kronologia: reorder containers only, keep timeline events as-is
    // - else: reorder whole list (same as visible)
    setNotes((prev) => {
      if (selectedCategory?.slug === "kronologia") {
        const children = prev.filter((n) => n.parentId); // events
        return [...normalizedVisible, ...children];
      }
      return normalizedVisible;
    });

    // Persist only visible items (containers for kronologia, all for others)
    try {
      const batch = writeBatch(db);
      normalizedVisible.forEach((n) => {
        batch.update(doc(db, "notes", n.id), { order: n.order });
      });
      await batch.commit();
    } catch (err) {
      console.error("Failed to save order:", err);
      alert("ვერ შევინახე დალაგება (order). სცადე თავიდან.");
    }
  };

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

          {/* ✅ Wrapped your list with DnD without changing your structure */}
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={visibleIds}
              strategy={verticalListSortingStrategy}
            >
              <div className="notes-list">
                {visibleNotes.map((note) => (
                  <SortableNoteItem
                    key={note.id}
                    note={note}
                    onDelete={handleDelete}
                    onEdit={handleEdit}
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>
        </>
      )}
    </div>
  );
};

export default Dashboard;
