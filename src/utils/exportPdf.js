// import jsPDF from "jspdf";

// // Generate and download a simple PDF report for commits or contributors
// export function exportPdfReport(title, data, filename = "report.pdf") {
//   const doc = new jsPDF();

//   doc.setFontSize(18);
//   doc.text(title, 10, 20);
//   doc.setFontSize(12);

//   const marginLeft = 10;
//   let y = 30;

//   // Table headers (keys of first object)
//   if (!data || data.length === 0) {
//     doc.text("No data available.", marginLeft, y);
//   } else {
//     const headers = Object.keys(data[0]);

//     // Print headers
//     headers.forEach((header, i) => {
//       doc.text(header, marginLeft + i * 40, y);
//     });

//     y += 10;

//     // Print rows (limit to first 30 rows for PDF size)
//     data.slice(0, 30).forEach(item => {
//       headers.forEach((header, i) => {
//         const text = String(item[header]).substring(0, 30); // Limit length
//         doc.text(text, marginLeft + i * 40, y);
//       });
//       y += 10;
//     });
//   }

//   doc.save(filename);
// }


import jsPDF from "jspdf";
import { toPng } from "html-to-image";

// Generate and download a PDF report including chart image and data table
export async function exportPdfReport(title, data, chartRef = null, filename = "report.pdf") {
  const doc = new jsPDF();

  doc.setFontSize(18);
  doc.text(title, 10, 20);
  doc.setFontSize(12);

  const marginLeft = 10;
  let y = 30;

  // Insert chart image from provided ref if exists
  // if (chartRef && chartRef.current) {
  //   try {
  //     const dataUrl = await toPng(chartRef.current);
  //     // Add image with width=180 units (around 6.3 inches), height calculated to maintain aspect ratio (~100)
  //     doc.addImage(dataUrl, "PNG", marginLeft, y, 180, 100);
  //     y += 110; // Move y below image with some margin
  //   } catch (error) {
  //     console.error("Failed to convert chart to image:", error);
  //     doc.text("Chart image not available", marginLeft, y);
  //     y += 10;
  //   }
  // }

  if (chartRef && chartRef.current) {
  try {
    console.log("Export: Chart ref found, starting toPng...");
    const dataUrl = await toPng(chartRef.current);
    console.log("Export: Chart image dataUrl:", dataUrl ? dataUrl.substring(0, 50) : "undefined");
    doc.addImage(dataUrl, "PNG", marginLeft, y, 180, 100);
    y += 110;
  } catch (error) {
    console.error("Export: Failed to convert chart to image:", error);
    doc.text("Chart image not available", marginLeft, y);
    y += 10;
  }
}


  // Table headers (keys of first object)
  if (!data || data.length === 0) {
    doc.text("No data available.", marginLeft, y);
  } else {
    const headers = Object.keys(data[0]);

    // Print headers
    headers.forEach((header, i) => {
      doc.text(header, marginLeft + i * 40, y);
    });

    y += 10;

    // Print rows (limit to first 30 rows for PDF size)
    data.slice(0, 30).forEach(item => {
      headers.forEach((header, i) => {
        const text = String(item[header]).substring(0, 30); // Limit length
        doc.text(text, marginLeft + i * 40, y);
      });
      y += 10;
    });
  }

  doc.save(filename);
}
