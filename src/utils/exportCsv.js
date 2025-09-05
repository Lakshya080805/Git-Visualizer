// Utility to convert array of objects to CSV string
export function arrayToCsv(data) {
  if (!data || data.length === 0) return "";

  const keys = Object.keys(data[0]);
  const csvRows = [];

  // Header row
  csvRows.push(keys.join(","));

  // Data rows
  data.forEach(item => {
    const values = keys.map(key => {
      const escaped = ("" + item[key]).replace(/"/g, '""'); // Escape quotes
      return `"${escaped}"`; // Wrap in quotes
    });
    csvRows.push(values.join(","));
  });

  return csvRows.join("\n");
}

// Trigger CSV download in browser
export function downloadCsv(data, filename = "export.csv") {
  const csvString = arrayToCsv(data);
  const blob = new Blob([csvString], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
