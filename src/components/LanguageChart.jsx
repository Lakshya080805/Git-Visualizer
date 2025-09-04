// LanguageChart.jsx
import React from "react";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";

function LanguageChart({ languages }) {
  if (!languages || Object.keys(languages).length === 0) return null;
  const COLORS = ["#1f77b4", "#ff7f0e", "#2ca02c", "#d62728", "#9467bd", "#8c564b"];
  const data = Object.entries(languages).map(([lang, bytes]) => ({ name: lang, value: bytes }));

  return (
    <div style={{ width: 220, height: 220, margin: "auto" }}>
      <h3 className="text-base font-semibold text-center mb-2">Language Distribution</h3>
      <ResponsiveContainer width="100%" height="85%">
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={85}
            fill="#8884d8"
            label
          >
            {data.map((entry, i) => (
              <Cell key={entry.name} fill={COLORS[i % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
      {/* Small legend below chart */}
      <div className="flex flex-wrap justify-center gap-2 mt-2 text-xs">
        {data.map((entry, i) => (
          <span
            key={entry.name}
            style={{
              color: COLORS[i % COLORS.length],
              fontWeight: "bold",
              marginRight: 8,
            }}
          >
            {entry.name}
          </span>
        ))}
      </div>
    </div>
  );
}

export default LanguageChart;
