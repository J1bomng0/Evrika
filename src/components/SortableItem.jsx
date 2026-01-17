import React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

export default function SortableItem({ id, title, order }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.6 : 1,
    background: "white",
    borderRadius: 12,
    padding: 16,
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    boxShadow: "0 1px 6px rgba(0,0,0,0.08)",
    border: "1px solid rgba(0,0,0,0.06)",
  };

  const left = {
    display: "flex",
    alignItems: "center",
    gap: 12,
    minWidth: 0,
  };

  const handle = {
    cursor: "grab",
    userSelect: "none",
    padding: "6px 10px",
    borderRadius: 10,
    border: "1px solid rgba(0,0,0,0.12)",
    background: "rgba(0,0,0,0.03)",
    fontWeight: 600,
  };

  return (
    <div ref={setNodeRef} style={style}>
      <div style={left}>
        <span style={{ width: 36, fontVariantNumeric: "tabular-nums", opacity: 0.7 }}>
          {order}.
        </span>

        <div style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
          {title}
        </div>
      </div>

      {/* Drag handle */}
      <div style={handle} {...attributes} {...listeners}>
        ↕
      </div>
    </div>
  );
}
