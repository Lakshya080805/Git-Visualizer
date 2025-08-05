import React from "react";

const CommitNode = ({ data, onHover }) => {
  return (
    <div
      className="relative group"
      onMouseEnter={() => onHover && onHover(data.label)} // ✅ Hover start
      onMouseLeave={() => onHover && onHover(null)}      // ✅ Hover end
    >
      {/* Commit Node */}
      <div
        className="px-4 py-2 rounded-md text-white font-bold shadow-md border-2"
        style={{
          backgroundColor: data.color,
          borderColor: data.borderColor || data.color,
        }}
      >
        {data.label}
      </div>

      {/* Tooltip */}
      <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 hidden group-hover:block">
        <div className="bg-gray-800 text-white text-xs rounded-md px-3 py-1 whitespace-nowrap shadow-lg">
          {data.author} • {data.date}
        </div>
      </div>
    </div>
  );
};

export default CommitNode;
