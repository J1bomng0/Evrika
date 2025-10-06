import React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

export function SortableItem({ note, onDelete, onEdit }) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: note.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    border: "1px solid #ccc",
    padding: "10px",
    marginBottom: "10px",
    borderRadius: "8px",
    background: "#fafafa",
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <h3>{note.title}</h3>
      <div style={{ display: "flex", gap: "10px" }}>
        <button onClick={() => onEdit(note)}>რედაქტირება</button>
        <button onClick={() => onDelete(note.id)}>წაშლა</button>
      </div>
    </div>
  );
}
