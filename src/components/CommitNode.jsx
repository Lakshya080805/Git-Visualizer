
import React from "react";

export default function CommitNode({ data, onHover, onClick }) {
  const { label, author, date, color, borderColor, isHighlighted } = data;

  return (
    <div
      className={`rounded-lg shadow-md p-2 border-2 text-xs cursor-pointer transition-all`}
      style={{
        backgroundColor: color,
        borderColor: borderColor,
        transform: isHighlighted ? "scale(1.1)" : "scale(1)",
      }}
      onMouseEnter={() => onHover && onHover(label)}
      onMouseLeave={() => onHover && onHover(null)}
      onClick={() => onClick && onClick(label)}
    >
      <p className="font-bold">{label}</p>
      <p>{author}</p>
      <p>{date}</p>
    </div>
  );
}

