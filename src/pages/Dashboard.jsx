import React, { useState, useEffect } from "react";
import { db, storage  } from "../firebase";
import { collection, addDoc, getDocs, query, where, orderBy, deleteDoc, doc, updateDoc,} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { DndContext, closestCenter, PointerSensor, useSensor, useSensors, } from "@dnd-kit/core";
import { arrayMove, SortableContext, verticalListSortingStrategy, } from "@dnd-kit/sortable";
import { SortableItem } from "../components/SortableItem";
import "./Dashboard.css";

const categories = [
  { id: 1, name: "კონსპექტები", slug: "konspektebi" },
  { id: 2, name: "კითხვა-პასუხი", slug: "rukebi" },
  { id: 3, name: "რუკები", slug: "pasuxi" },
  { id: 4, name: "ქრონოლოგია", slug: "kronologia" },
  { id: 5, name: "ზავები,ედიქტები...", slug: "zavebi" },
  { id: 6, name: "ბრძოლები, აჯანყებები", slug: "brdzolebi_ajankebebi" },
  { id: 7, name: "მსოფლიო ისტორიის მნიშვნელოვანი მოვლენები", slug: "movlenebi" },
  { id: 8, name: "ილუსტრაციები", slug: "ilustraciebi" },
];

const Dashboard = () => {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [notes, setNotes] = useState([]);
  const [newNote, setNewNote] = useState({
    title: "",
    text: "",
    sources: "",
    images: [],
    files: [],
  });
  const [editingNote, setEditingNote] = useState(null);
  const [uploadingFiles, setUploadingFiles] = useState(false);
  const [previewImages, setPreviewImages] = useState([]);

  const sensors = useSensors(useSensor(PointerSensor));

  useEffect(() => {
    const fetchNotes = async () => {
      if (!selectedCategory) return;
      if (selectedCategory.slug === "istoria") {
        setNotes([]);
        return;
      }

      try {
        const q = query(
          collection(db, "notes"),
          where("category", "==", selectedCategory.slug),
          orderBy("order", "asc")
        );
        const querySnapshot = await getDocs(q);
        const notesData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setNotes(notesData);
      } catch (error) {
        console.error("Error fetching notes:", error);
      }
    };
    fetchNotes();
  }, [selectedCategory]);

  // File upload handler
  const handleFileChange = async (e) => {
    const files = Array.from(e.target.files);
    setUploadingFiles(true);

    const uploadedImages = [];
    const uploadedFiles = [];

    for (let file of files) {
      const storageRef = ref(storage, `notes/${Date.now()}_${file.name}`);
      await uploadBytes(storageRef, file);
      const url = await getDownloadURL(storageRef);

      if (file.type.startsWith("image/")) {
        uploadedImages.push(url);
      } else {
        uploadedFiles.push(url);
      }
    }

    setNewNote((prev) => ({
      ...prev,
      images: [...prev.images, ...uploadedImages],
      files: [...prev.files, ...uploadedFiles],
    }));

    setPreviewImages((prev) => [...prev, ...uploadedImages]);
    setUploadingFiles(false);
  };

  // Add new note
  const handleAddNote = async (e) => {
    e.preventDefault();
    if (!selectedCategory) return alert("აირჩიე კატეგორია!");

    try {
      const docRef = await addDoc(collection(db, "notes"), {
        ...newNote,
        category: selectedCategory.slug,
        createdAt: new Date(),
        order: notes.length,
      });

      setNotes((prev) => [
        ...prev,
        { id: docRef.id, ...newNote, category: selectedCategory.slug, order: prev.length },
      ]);
      setNewNote({ title: "", text: "", sources: "", images: [], files: [] });
      setPreviewImages([]);
    } catch (error) {
      console.error("Error adding note:", error);
    }
  };

  // Delete note
  const handleDelete = async (id) => {
    if (!window.confirm("წაშლა გინდა?")) return;
    try {
      await deleteDoc(doc(db, "notes", id));
      setNotes((prev) => prev.filter((n) => n.id !== id));
    } catch (error) {
      console.error("Error deleting note:", error);
    }
  };

  // Edit note
  const handleEdit = (note) => {
    setEditingNote(note);
    setNewNote({
      title: note.title,
      text: note.text,
      sources: note.sources || "",
      images: note.images || [],
      files: note.files || [],
    });
    setPreviewImages(note.images || []);
  };

  const handleSaveEdit = async (e) => {
    e.preventDefault();
    if (!editingNote) return;

    try {
      const noteRef = doc(db, "notes", editingNote.id);
      await updateDoc(noteRef, {
        title: newNote.title,
        text: newNote.text,
        sources: newNote.sources,
        images: newNote.images,
        files: newNote.files,
      });
      setNotes((prev) =>
        prev.map((n) => (n.id === editingNote.id ? { ...n, ...newNote } : n))
      );
      setEditingNote(null);
      setNewNote({ title: "", text: "", sources: "", images: [], files: [] });
      setPreviewImages([]);
    } catch (error) {
      console.error("Error saving edit:", error);
    }
  };

  const handleDragEnd = async (event) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = notes.findIndex((n) => n.id === active.id);
    const newIndex = notes.findIndex((n) => n.id === over.id);

    const newNotes = arrayMove(notes, oldIndex, newIndex);
    setNotes(newNotes);

    try {
      for (let i = 0; i < newNotes.length; i++) {
        const noteRef = doc(db, "notes", newNotes[i].id);
        await updateDoc(noteRef, { order: i });
      }
    } catch (error) {
      console.error("Error updating order:", error);
    }
  };

  return (
    <div className="dashboard-container">
      {!selectedCategory ? (
        <>
          <h1>აირჩიე კატეგორია</h1>
          <div className="category-list">
            {categories.map((cat) => (
              <button
                key={cat.id}
                className="category-button"
                onClick={() => setSelectedCategory(cat)}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </>
      ) : (
        <>
          <button className="back-button" onClick={() => setSelectedCategory(null)}>
            ← დაბრუნება
          </button>
          <h2>{selectedCategory.name}</h2>

          {selectedCategory.slug === "istoria" ? (
            <div className="notes-text">
              <p>▄︻デ══━一💥 𐦂</p>
            </div>
          ) : (
            <>
              {/* Add / Edit Note */}
              <form
                onSubmit={editingNote ? handleSaveEdit : handleAddNote}
                className="dashboard-form"
              >
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
                  required
                />
                <input
                  type="text"
                  placeholder="წყაროები (გამოყავი მძიმით)"
                  value={newNote.sources}
                  onChange={(e) =>
                    setNewNote({ ...newNote, sources: e.target.value })
                  }
                />

                {/* File Upload */}
                <input
                  type="file"
                  multiple
                  accept=".png,.jpg,.jpeg,.gif,.pdf,.doc,.docx"
                  onChange={handleFileChange}
                />
                {uploadingFiles && <p>ფაილები იტვირთება...</p>}

                {/* Preview Images */}
                {previewImages.length > 0 && (
                  <div className="preview-images">
                    {previewImages.map((img, idx) => (
                      <img key={idx} src={img} alt={`preview-${idx}`} />
                    ))}
                  </div>
                )}

                <button type="submit">
                  {editingNote ? "შენახვა" : "დამატება"}
                </button>
              </form>

              {/* Notes List with drag-and-drop */}
              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
              >
                <SortableContext
                  items={notes.map((n) => n.id)}
                  strategy={verticalListSortingStrategy}
                >
                  <div className="notes-list">
                    {notes.map((note) => (
                      <SortableItem
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
        </>
      )}
    </div>
  );
};

export default Dashboard;