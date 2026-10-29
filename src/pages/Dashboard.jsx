import React, { useState, useEffect, useMemo } from "react";
import { db } from "../firebase";
import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
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
  { id: 6, name: "ზავები, ედიქტები...", slug: "zavebi" },
  { id: 7, name: "ბრძოლები, აჯანყებები", slug: "brdzolebi_ajankebebi" },
  { id: 8, name: "მსოფლიო ისტორიის მნიშვნელოვანი მოვლენები", slug: "movlenebi" },
  { id: 9, name: "ილუსტრაციები", slug: "ilustraciebi" },
];

function SortableNoteItem({ note, isQuizQuestion, onDelete, onEdit }) {
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
    opacity: isDragging ? 0.5 : 1,
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
      <div className="note-content-preview">
        <h3>{note.question || note.title}</h3>
        {note.options && (
          <span className="quiz-preview-tag">
            {note.options.length} სავარაუდო პასუხი
          </span>
        )}
      </div>

      <div className="note-actions">
        <button
          type="button"
          className="btn-edit"
          onPointerDown={(e) => e.stopPropagation()}
          onClick={() => onEdit(note)}
        >
          რედაქტირება
        </button>

        <button
          type="button"
          className="btn-delete"
          onPointerDown={(e) => e.stopPropagation()}
          onClick={() => onDelete(note.id)}
        >
          წაშლა
        </button>
      </div>
    </div>
  );
}

export default function Dashboard() {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(false);

  // Standard Note State / Test Container State
  const [newNote, setNewNote] = useState({ title: "", text: "" });

  // Quiz-Specific Question State
  const [isQuizQuestion, setIsQuizQuestion] = useState(false);
  const [selectedQuizParentId, setSelectedQuizParentId] = useState("");
  const [quizForm, setQuizForm] = useState({
    question: "",
    optA: "",
    optB: "",
    optC: "",
    optD: "",
    correctIndex: 0,
  });

  // Timeline State
  const [timelineContainers, setTimelineContainers] = useState([]);
  const [isTimelineEvent, setIsTimelineEvent] = useState(false);
  const [selectedTimelineId, setSelectedTimelineId] = useState("");

  const [editingId, setEditingId] = useState(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
  );

  const isTestebi = selectedCategory?.slug === "testebi";

  /* ---------------- FETCH DATA ---------------- */

  const fetchNotes = async () => {
    if (!selectedCategory) return;
    setLoading(true);

    try {
      const q = query(
        collection(db, "notes"),
        where("category", "==", selectedCategory.slug)
      );
      const snap = await getDocs(q);

      const items = snap.docs
        .map((d) => ({
          id: d.id,
          ...d.data(),
          order: Number(d.data()?.order ?? 0),
        }))
        .sort((a, b) => a.order - b.order);

      setNotes(items);

      if (selectedCategory.slug === "kronologia") {
        setTimelineContainers(items.filter((n) => !n.parentId));
      }
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotes();
    resetForms();
  }, [selectedCategory]);

  const resetForms = () => {
    setNewNote({ title: "", text: "" });
    setQuizForm({ question: "", optA: "", optB: "", optC: "", optD: "", correctIndex: 0 });
    setIsTimelineEvent(false);
    setSelectedTimelineId("");
    setIsQuizQuestion(false);
    setSelectedQuizParentId("");
    setEditingId(null);
  };

  /* ---------------- SUBMIT ---------------- */

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedCategory) return;

    let payload = {};
    let parentId = null;

    if (isTestebi) {
      if (isQuizQuestion) {
        if (!selectedQuizParentId) {
          alert("გთხოვთ აირჩიოთ რომელ ტესტს ეკუთვნის ეს კითხვა");
          return;
        }
        if (!quizForm.question || !quizForm.optA || !quizForm.optB) {
          alert("კითხვა და მინიმუმ 2 პასუხი სავალდებულოა");
          return;
        }

        const options = [
          `ა) ${quizForm.optA.trim()}`,
          `ბ) ${quizForm.optB.trim()}`,
          quizForm.optC ? `გ) ${quizForm.optC.trim()}` : null,
          quizForm.optD ? `დ) ${quizForm.optD.trim()}` : null,
        ].filter(Boolean);

        parentId = selectedQuizParentId;
        payload = {
          question: quizForm.question.trim(),
          options,
          correctIndex: Number(quizForm.correctIndex),
          category: "testebi",
          parentId,
        };
      } else {
        // Creating the Test Card Container itself (e.g., "N1", "N2")
        payload = {
          title: newNote.title.trim(),
          category: "testebi",
          parentId: null,
        };
      }
    } else {
      // --- ქრონოლოგია ---
      if (selectedCategory.slug === "kronologia") {
        const epochTitle = newNote.title.trim();
        if (!epochTitle) {
          alert("გთხოვთ მიუთითოთ ეპოქა (მაგ: ძვ.წ)");
          return;
        }

        const lines = newNote.text
          .split("\n")
          .map((l) => l.trim())
          .filter(Boolean);

        try {
          // 1. ვამოწმებთ, არსებობს თუ არა უკვე ეს ეპოქა (მშობელი ბარათი)
          let parentDoc = notes.find(
            (n) => !n.parentId && n.category === "kronologia" && n.title === epochTitle
          );
          let parentId = parentDoc ? parentDoc.id : null;
          const newAddedNotes = [];

          // თუ ეპოქა ჯერ არ არსებობს, ვქმნით მას
          if (!parentId) {
            const parentRef = await addDoc(collection(db, "notes"), {
              title: epochTitle,
              category: "kronologia",
              parentId: null,
              order: notes.filter((n) => !n.parentId).length,
              createdAt: new Date(),
            });
            parentId = parentRef.id;
            newAddedNotes.push({
              id: parentId,
              title: epochTitle,
              category: "kronologia",
              parentId: null,
            });
          }

          // 2. თუ ტექსტის ველში ჩაწერილია მოვლენები, ვამატებთ მათ batch-ით
          if (lines.length > 0) {
            const batch = writeBatch(db);
            const existingSiblings = notes.filter((n) => n.parentId === parentId);
            let orderIndex = existingSiblings.length;

            for (let i = 0; i < lines.length; i += 2) {
              const eventYear = lines[i];
              const eventDesc = lines[i + 1] || "";

              const newChildRef = doc(collection(db, "notes"));
              const childData = {
                title: eventYear,
                text: eventDesc,
                category: "kronologia",
                parentId: parentId,
                order: orderIndex,
                createdAt: new Date(),
              };

              batch.set(newChildRef, childData);
              newAddedNotes.push({ id: newChildRef.id, ...childData });
              orderIndex++;
            }

            await batch.commit();
          }

          setNotes((prev) => [...prev, ...newAddedNotes]);
          resetForms();
          return;
        } catch (err) {
          console.error("Chronology save error:", err);
          alert("ქრონოლოგიის შენახვისას მოხდა შეცდომა.");
          return;
        }
      }

      // --- დანარჩენი კატეგორიები (კითხვა-პასუხი, კონსპექტები) ---
      payload = {
        title: newNote.title.trim(),
        category: selectedCategory.slug,
        parentId: null,
      };

      if (selectedCategory.slug === "pasuxi") {
        const lines = newNote.text
          .split("\n")
          .map((line) => line.trim())
          .filter(Boolean);

        const items = [];
        for (let i = 0; i < lines.length; i += 2) {
          items.push({
            q: lines[i] || "",
            a: lines[i + 1] || "",
          });
        }
        payload.items = items;
      } else {
        payload.text = newNote.text.trim();
      }
    }

    try {
      if (editingId) {
        await updateDoc(doc(db, "notes", editingId), payload);
        setNotes((prev) =>
          prev.map((n) => (n.id === editingId ? { ...n, ...payload } : n))
        );
      } else {
        const siblings = notes.filter((n) => n.parentId === parentId);
        const newDocRef = await addDoc(collection(db, "notes"), {
          ...payload,
          order: siblings.length,
          createdAt: new Date(),
        });

        setNotes((prev) => [
          ...prev,
          { id: newDocRef.id, ...payload, order: siblings.length },
        ]);
      }
      resetForms();
    } catch (err) {
      console.error("Save error:", err);
      alert("შენახვისას მოხდა შეცდომა.");
    }
  };

  /* ---------------- EDIT HANDLER ---------------- */

  const handleEdit = (note) => {
    setEditingId(note.id);

    if (isTestebi) {
      if (note.parentId) {
        setIsQuizQuestion(true);
        setSelectedQuizParentId(note.parentId);
        const cleanOpt = (opt) => (opt ? opt.replace(/^[ა-ჰ]\)\s*/, "") : "");
        setQuizForm({
          question: note.question || "",
          optA: cleanOpt(note.options?.[0]),
          optB: cleanOpt(note.options?.[1]),
          optC: cleanOpt(note.options?.[2]),
          optD: cleanOpt(note.options?.[3]),
          correctIndex: note.correctIndex ?? 0,
        });
      } else {
        setIsQuizQuestion(false);
        setNewNote({ title: note.title || "", text: "" });
      }
    } else {
      // თუ კითხვა-პასუხია, items მასივი ისევ ხაზებად გადავაქციოთ textarea-სთვის
      let formattedText = note.text || "";
      if (selectedCategory?.slug === "pasuxi" && Array.isArray(note.items)) {
        formattedText = note.items
          .map((item) => `${item.q}\n${item.a}`)
          .join("\n\n");
      }

      setNewNote({
        title: note.title || "",
        text: formattedText,
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
    }
  };

  /* ---------------- DELETE HANDLER ---------------- */

  const handleDelete = async (id) => {
    if (!window.confirm("ნამდვილად გსურთ წაშლა?")) return;
    try {
      await deleteDoc(doc(db, "notes", id));
      setNotes((prev) => prev.filter((n) => n.id !== id));
    } catch (err) {
      console.error("Delete error:", err);
      alert("წაშლა ვერ მოხერხდა.");
    }
  };

  // Test cards (Containers) that can hold questions
  const quizContainers = useMemo(
    () => notes.filter((n) => isTestebi && !n.parentId),
    [notes, isTestebi]
  );

  const [timelineFilter, setTimelineFilter] = useState("all");

  const visibleNotes = useMemo(() => {
    if (isTestebi) {
      return notes.filter((n) => !n.parentId);
    }
    if (selectedCategory?.slug === "kronologia") {
      if (timelineFilter === "all") return notes;
      return notes.filter((n) => n.id === timelineFilter || n.parentId === timelineFilter);
    }
    return notes;
  }, [notes, selectedCategory, isTestebi, timelineFilter]);

  const visibleIds = useMemo(() => visibleNotes.map((n) => n.id), [visibleNotes]);

  const handleDragEnd = async (event) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = visibleNotes.findIndex((n) => n.id === active.id);
    const newIndex = visibleNotes.findIndex((n) => n.id === over.id);
    if (oldIndex < 0 || newIndex < 0) return;

    const movedVisible = arrayMove(visibleNotes, oldIndex, newIndex);
    const normalizedVisible = movedVisible.map((n, i) => ({
      ...n,
      order: i + 1,
    }));

    setNotes((prev) => {
      const children = prev.filter((n) => n.parentId);
      return [...normalizedVisible, ...children];
    });

    try {
      const batch = writeBatch(db);
      normalizedVisible.forEach((n) => {
        batch.update(doc(db, "notes", n.id), { order: n.order });
      });
      await batch.commit();
    } catch (err) {
      console.error("Order save error:", err);
      alert("თანმიმდევრობის შენახვა ვერ მოხერხდა.");
    }
  };

  return (
    <div className="dashboard-container">
      {!selectedCategory ? (
        <div className="category-selection-view">
          <h1>მართვის პანელი (Admin Dashboard)</h1>
          <p className="dashboard-subtitle">აირჩიეთ კატეგორია მასალის სამართავად</p>
          <div className="category-grid">
            {categories.map((c) => (
              <button
                key={c.id}
                className="category-btn-card"
                onClick={() => setSelectedCategory(c)}
              >
                {c.name}
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div className="category-manage-view">
          <div className="header-row">
            <button className="btn-back" onClick={() => setSelectedCategory(null)}>
              ← კატეგორიებში დაბრუნება
            </button>
            <h2>{selectedCategory.name}</h2>
          </div>

          <form onSubmit={handleSubmit} className="admin-form-card">
            <h3>{editingId ? "ჩანაწერის რედაქტირება" : "ახალი ჩანაწერის დამატება"}</h3>

            {/* Testebi Toggle */}
            {isTestebi && (
              <div className="form-group checkbox-group">
                <label>
                  <input
                    type="checkbox"
                    checked={isQuizQuestion}
                    onChange={(e) => {
                      setIsQuizQuestion(e.target.checked);
                      setSelectedQuizParentId("");
                    }}
                  />
                  ტესტის კითხვა (დაამატე კითხვა არსებულ ბარათში)
                </label>

                {isQuizQuestion && (
                  <select
                    className="form-input"
                    value={selectedQuizParentId}
                    onChange={(e) => setSelectedQuizParentId(e.target.value)}
                    required
                  >
                    <option value="">აირჩიეთ ტესტის ბარათი (მაგ: N1)</option>
                    {quizContainers.map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.title}
                      </option>
                    ))}
                  </select>
                )}
              </div>
            )}

            {/* If entering a Quiz Question */}
            {isTestebi && isQuizQuestion ? (
              <div className="quiz-fields">
                <div className="form-group">
                  <label>კითხვა:</label>
                  <textarea
                    className="form-input"
                    rows="2"
                    placeholder="მაგ: რომელი იყო შუამდინარეთის რელიგიური ცენტრი?"
                    value={quizForm.question}
                    onChange={(e) => setQuizForm({ ...quizForm, question: e.target.value })}
                    required
                  />
                </div>

                <div className="form-row-2">
                  <div className="form-group">
                    <label>პასუხი ა:</label>
                    <input
                      type="text"
                      className="form-input"
                      value={quizForm.optA}
                      onChange={(e) => setQuizForm({ ...quizForm, optA: e.target.value })}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>პასუხი ბ:</label>
                    <input
                      type="text"
                      className="form-input"
                      value={quizForm.optB}
                      onChange={(e) => setQuizForm({ ...quizForm, optB: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="form-row-2">
                  <div className="form-group">
                    <label>პასუხი გ:</label>
                    <input
                      type="text"
                      className="form-input"
                      value={quizForm.optC}
                      onChange={(e) => setQuizForm({ ...quizForm, optC: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label>პასუხი დ:</label>
                    <input
                      type="text"
                      className="form-input"
                      value={quizForm.optD}
                      onChange={(e) => setQuizForm({ ...quizForm, optD: e.target.value })}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>სწორი პასუხი:</label>
                  <select
                    className="form-input"
                    value={quizForm.correctIndex}
                    onChange={(e) => setQuizForm({ ...quizForm, correctIndex: Number(e.target.value) })}
                  >
                    <option value={0}>ა (ვარიანტი 1)</option>
                    <option value={1}>ბ (ვარიანტი 2)</option>
                    <option value={2}>გ (ვარიანტი 3)</option>
                    <option value={3}>დ (ვარიანტი 4)</option>
                  </select>
                </div>
              </div>
            ) : (
              /* If creating standard note or test container card */
              <>
             <div className="form-group">
  <label>
    {isTestebi
      ? "ტესტის ბარათის სახელი (მაგ: N1):"
      : selectedCategory?.slug === "kronologia"
      ? "ქრონოლოგიის ეპოქა (მაგ: ძვ.წ ან ახ.წ):"
      : "სათაური:"}
  </label>
  <input
    type="text"
    className="form-input"
    placeholder={
      selectedCategory?.slug === "kronologia"
        ? "მაგ: ძვ.წ"
        : "სათაური"
    }
    value={newNote.title}
    onChange={(e) => setNewNote({ ...newNote, title: e.target.value })}
    required
  />
</div>

{!isTestebi && (
  <div className="form-group">
    <label>
      {selectedCategory?.slug === "kronologia"
        ? "მოვლენების სია (თარიღი და მოვლენა ცალ-ცალკე ხაზზე):"
        : "ტექსტი / აღწერა:"}
    </label>
    <textarea
      className="form-input"
      rows={selectedCategory?.slug === "kronologia" ? 10 : 4}
      placeholder={
        selectedCategory?.slug === "kronologia"
          ? "ძვ.წ. 3000 წ\nჩრდილოეთ და სამხრეთ ეგვიპტის გაერთიანება ფარაონ მენესის მიერ\n\nძვ.წ. 2600–2150 წწ.\n„პირამიდების ეპოქა“"
          : "ჩანაწერის შინაარსი..."
      }
      value={newNote.text}
      onChange={(e) => setNewNote({ ...newNote, text: e.target.value })}
    />
  </div>
)}
              </>
            )}

            <div className="form-actions">
              <button type="submit" className="btn-primary">
                {editingId ? "შენახვა" : "დამატება"}
              </button>
              {editingId && (
                <button type="button" className="btn-secondary" onClick={resetForms}>
                  გაუქმება
                </button>
              )}
            </div>
          </form>

          {/* List Section */}
          <div className="notes-list-section">
            <h3>{isTestebi ? "ტესტის ბარათები" : "არსებული ჩანაწერები"} ({visibleNotes.length})</h3>
            {loading ? (
              <p>იტვირთება...</p>
            ) : visibleNotes.length === 0 ? (
              <p className="empty-text">ჩანაწერები არ მოიძებნა.</p>
            ) : (
              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
              >
                <SortableContext items={visibleIds} strategy={verticalListSortingStrategy}>
                  <div className="notes-list">
                    {visibleNotes.map((note) => (
                      <SortableNoteItem
                        key={note.id}
                        note={note}
                        isQuizQuestion={false}
                        onDelete={handleDelete}
                        onEdit={handleEdit}
                      />
                    ))}
                  </div>
                </SortableContext>
              </DndContext>
            )}
          </div>
        </div>
      )}
    </div>
  );
}