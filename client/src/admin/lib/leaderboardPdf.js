import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

// Builds and downloads "LearnQuest_Leaderboard_<Class><ClassNum>_<Subject>.pdf"
// (Section 15). Pure client-side generation - no server round trip - so it
// works from data the Leaderboard page already has in memory.
function formatMs(ms) {
  if (ms == null) return "\u2014";
  const seconds = Math.round(ms / 1000);
  if (seconds < 60) return `${seconds}s`;
  return `${Math.floor(seconds / 60)}m ${seconds % 60}s`;
}

function formatDate(value) {
  if (!value) return "\u2014";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "\u2014";
  return d.toLocaleString(undefined, {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function slug(value) {
  return String(value || "All").replace(/[^a-z0-9]+/gi, "");
}

const PERFORMANCE_COLORS = {
  Excellent: [22, 163, 74],
  Good: [8, 145, 178],
  Average: [217, 119, 6],
  "Needs Improvement": [220, 38, 38],
};

export function downloadLeaderboardPdf({ school, board, grade, subject, rows, summary }) {
  const doc = new jsPDF({ orientation: "portrait", unit: "pt", format: "a4" });
  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 40;

  // Header
  doc.setFont("helvetica", "bold");
  doc.setFontSize(20);
  doc.setTextColor(30, 30, 40);
  doc.text("LEARNQUEST", margin, 50);
  doc.setFontSize(13);
  doc.setTextColor(90, 90, 100);
  doc.text("LEADERBOARD REPORT", margin, 70);

  doc.setDrawColor(210, 210, 220);
  doc.line(margin, 82, pageWidth - margin, 82);

  const meta = [
    ["School", school || "All Schools"],
    ["Board", board || "All Boards"],
    ["Class", grade ? `Grade ${grade}` : "All Classes"],
    ["Subject", subject || "All Subjects"],
    ["Date", new Date().toLocaleDateString(undefined, { day: "2-digit", month: "long", year: "numeric" })],
  ];

  doc.setFontSize(10);
  let metaY = 102;
  const colWidth = (pageWidth - margin * 2) / 2;
  meta.forEach((row, i) => {
    const col = i % 2;
    const rowY = metaY + Math.floor(i / 2) * 20;
    const x = margin + col * colWidth;
    doc.setFont("helvetica", "bold");
    doc.setTextColor(60, 60, 70);
    doc.text(`${row[0]}:`, x, rowY);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(20, 20, 30);
    doc.text(String(row[1]), x + 55, rowY);
  });

  const tableStartY = metaY + Math.ceil(meta.length / 2) * 20 + 12;

  const body = rows.map((r) => [
    String(r.rank),
    r.name,
    `${r.score}`,
    `${r.percentage}%`,
    formatMs(r.avgTimeTakenMs),
    formatDate(r.completedAt),
    r.performance,
  ]);

  autoTable(doc, {
    startY: tableStartY,
    head: [["Rank", "Student", "Score", "Percentage", "Time Taken", "Completed At", "Performance"]],
    body,
    styles: { font: "helvetica", fontSize: 9, cellPadding: 5, textColor: [30, 30, 40] },
    headStyles: { fillColor: [79, 70, 229], textColor: [255, 255, 255], fontStyle: "bold" },
    alternateRowStyles: { fillColor: [246, 246, 250] },
    margin: { left: margin, right: margin },
    didParseCell: (data) => {
      if (data.section === "body" && data.column.index === 6) {
        const color = PERFORMANCE_COLORS[data.cell.raw];
        if (color) {
          data.cell.styles.textColor = color;
          data.cell.styles.fontStyle = "bold";
        }
      }
    },
  });

  let y = doc.lastAutoTable.finalY + 24;
  const pageHeight = doc.internal.pageSize.getHeight();
  if (y > pageHeight - 140) {
    doc.addPage();
    y = 50;
  }

  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.setTextColor(30, 30, 40);
  doc.text("Summary", margin, y);
  y += 10;
  doc.setDrawColor(210, 210, 220);
  doc.line(margin, y, pageWidth - margin, y);
  y += 20;

  const summaryRows = [
    ["Total Students", summary.totalStudents],
    ["Average Score", `${summary.averageScore}%`],
    ["Highest Score", `${summary.highestScore}%`],
    ["Average Time", formatMs(summary.averageTimeTakenMs)],
    ["Excellent Count", summary.excellentCount],
    ["Good Count", summary.goodCount],
    ["Average Count", summary.averageCount],
    ["Needs Improvement Count", summary.needsImprovementCount],
  ];

  doc.setFontSize(10);
  const sColWidth = (pageWidth - margin * 2) / 2;
  summaryRows.forEach((row, i) => {
    const col = i % 2;
    const rowY = y + Math.floor(i / 2) * 20;
    const x = margin + col * sColWidth;
    doc.setFont("helvetica", "normal");
    doc.setTextColor(90, 90, 100);
    doc.text(`${row[0]}:`, x, rowY);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(20, 20, 30);
    doc.text(String(row[1]), x + 150, rowY);
  });

  // Footer / print-friendly page numbers
  const pageCount = doc.internal.getNumberOfPages();
  for (let i = 1; i <= pageCount; i += 1) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(150, 150, 160);
    doc.text(`LearnQuest \u00b7 Generated ${new Date().toLocaleString()}`, margin, pageHeight - 20);
    doc.text(`Page ${i} of ${pageCount}`, pageWidth - margin - 60, pageHeight - 20);
  }

  const filename = `LearnQuest_Leaderboard_Class${slug(grade)}_${slug(subject)}.pdf`;
  doc.save(filename);
}
