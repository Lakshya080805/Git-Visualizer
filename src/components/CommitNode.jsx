import React from "react";

const CommitNode = ({ data, onHover, onClick }) => {
  return (
    <div
      className="relative group cursor-pointer"
      onMouseEnter={() => onHover && onHover(data.label)}
      onMouseLeave={() => onHover && onHover(null)}
      onClick={() => onClick && onClick(data.label)}
    >
      <div
        className={`px-4 py-2 rounded-md text-white font-bold shadow-md border-2
          transform transition duration-200
          hover:scale-105 hover:shadow-lg
          ${data.isHighlighted ? 'scale-110 ring-2 ring-green-400' : ''}`}
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
