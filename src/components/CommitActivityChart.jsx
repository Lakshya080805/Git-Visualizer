// import React from "react";
// import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from "recharts";

// function CommitActivityChart({ commits }) {
//   // Aggregate commits by date (format: YYYY-MM-DD)
//   const commitCountByDate = commits.reduce((acc, commit) => {
//     const date = commit.date;
//     acc[date] = (acc[date] || 0) + 1;
//     return acc;
//   }, {});

//   // Convert to array and sort by date ascending
//   const data = Object.entries(commitCountByDate)
//     .map(([date, count]) => ({ date, count }))
//     .sort((a, b) => new Date(a.date) - new Date(b.date));

//   return (
//     <div style={{ width: "100%", height: 300 }}>
//       <ResponsiveContainer>
//         <LineChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
//           <CartesianGrid strokeDasharray="3 3" />
//           <XAxis dataKey="date" />
//           <YAxis allowDecimals={false} />
//           <Tooltip />
//           <Line type="monotone" dataKey="count" stroke="#1f77b4" strokeWidth={2} />
//         </LineChart>
//       </ResponsiveContainer>
//     </div>
//   );
// }

// export default CommitActivityChart;

import React, { forwardRef } from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from "recharts";

const CommitActivityChart = forwardRef(({ commits }, ref) => {
  // Aggregate commits by date (format: YYYY-MM-DD)
  const commitCountByDate = commits.reduce((acc, commit) => {
    const date = commit.date;
    acc[date] = (acc[date] || 0) + 1;
    return acc;
  }, {});

  // Convert to array and sort by date ascending
  const data = Object.entries(commitCountByDate)
    .map(([date, count]) => ({ date, count }))
    .sort((a, b) => new Date(a.date) - new Date(b.date));

  return (
    <div ref={ref} style={{ width: "100%", height: 300 }}>
      <ResponsiveContainer>
        <LineChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis allowDecimals={false} />
          <Tooltip />
          <Line type="monotone" dataKey="count" stroke="#1f77b4" strokeWidth={2} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
});

export default CommitActivityChart;

