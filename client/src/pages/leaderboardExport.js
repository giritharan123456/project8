import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";

// Client-side PDF/Excel export for the student-facing Leaderboard page.
// Both exports carry the same two things shown on screen: the ranked
// leaderboard table, and "My Progress" as its own separate block (not
// folded into a leaderboard row) - Rank/Level/XP/Stars plus the deeper
// stats (lessons completed, overall progress, streak) that don't fit a
// leaderboard row but do belong in "my own" report.
function formatPercent(value) {
  return `${Math.round(value ?? 0)}%`;
}

function buildMeta({ scopeLabel, periodLabel, grade, board }) {
  return [
    ["Scope", scopeLabel],
    ["Period", periodLabel],
    ["Class", `Class ${grade}`],
    ["Board", board],
    ["Date", new Date().toLocaleDateString(undefined, { day: "2-digit", month: "long", year: "numeric" })],
  ];
}

function buildProgressRows(progress) {
  return [
    ["Current Rank", `#${progress.rank}`],
    ["Level", progress.level],
    ["Total XP", progress.xp.toLocaleString()],
    ["Stars Earned", progress.stars],
    ["Lessons Completed", progress.completedCount],
    ["Overall Progress", formatPercent(progress.overallProgress)],
    ["Current Streak", `${progress.streak} days`],
  ];
}

export function downloadLeaderboardPdf({ scopeLabel, periodLabel, grade, board, rows, progress }) {
  const doc = new jsPDF({ orientation: "portrait", unit: "pt", format: "a4" });
  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 40;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(20);
  doc.setTextColor(30, 30, 40);
  doc.text("LEARNQUEST", margin, 50);
  doc.setFontSize(13);
  doc.setTextColor(90, 90, 100);
  doc.text("LEADERBOARD & MY PROGRESS", margin, 70);

  doc.setDrawColor(210, 210, 220);
  doc.line(margin, 82, pageWidth - margin, 82);

  const meta = buildMeta({ scopeLabel, periodLabel, grade, board });
  doc.setFontSize(10);
  let y = 102;
  const colWidth = (pageWidth - margin * 2) / 2;
  meta.forEach((row, i) => {
    const col = i % 2;
    const rowY = y + Math.floor(i / 2) * 20;
    const x = margin + col * colWidth;
    doc.setFont("helvetica", "bold");
    doc.setTextColor(60, 60, 70);
    doc.text(`${row[0]}:`, x, rowY);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(20, 20, 30);
    doc.text(String(row[1]), x + 60, rowY);
  });
  y += Math.ceil(meta.length / 2) * 20 + 16;

  // "My Progress" - a separate block, not a leaderboard row, printed
  // before the table so it reads as its own section.
  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.setTextColor(30, 30, 40);
  doc.text("My Progress", margin, y);
  y += 10;
  doc.setDrawColor(210, 210, 220);
  doc.line(margin, y, pageWidth - margin, y);
  y += 20;

  const progressRows = buildProgressRows(progress);
  doc.setFontSize(10);
  const pColWidth = (pageWidth - margin * 2) / 2;
  progressRows.forEach((row, i) => {
    const col = i % 2;
    const rowY = y + Math.floor(i / 2) * 20;
    const x = margin + col * pColWidth;
    doc.setFont("helvetica", "normal");
    doc.setTextColor(90, 90, 100);
    doc.text(`${row[0]}:`, x, rowY);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(20, 20, 30);
    doc.text(String(row[1]), x + 130, rowY);
  });
  y += Math.ceil(progressRows.length / 2) * 20 + 20;

  const body = rows.map((r) => [String(r.rank), r.isYou ? `${r.name} (You)` : r.name, String(r.level), r.xp.toLocaleString(), String(r.stars)]);

  autoTable(doc, {
    startY: y,
    head: [["Rank", "Player", "Level", "XP", "Stars"]],
    body,
    styles: { font: "helvetica", fontSize: 9, cellPadding: 5, textColor: [30, 30, 40] },
    headStyles: { fillColor: [79, 70, 229], textColor: [255, 255, 255], fontStyle: "bold" },
    alternateRowStyles: { fillColor: [246, 246, 250] },
    margin: { left: margin, right: margin },
    didParseCell: (data) => {
      if (data.section === "body" && rows[data.row.index]?.isYou) {
        data.cell.styles.fillColor = [219, 250, 255];
        data.cell.styles.fontStyle = "bold";
      }
    },
  });

  const pageHeight = doc.internal.pageSize.getHeight();
  const pageCount = doc.internal.getNumberOfPages();
  for (let i = 1; i <= pageCount; i += 1) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(150, 150, 160);
    doc.text(`LearnQuest \u00b7 Generated ${new Date().toLocaleString()}`, margin, pageHeight - 20);
    doc.text(`Page ${i} of ${pageCount}`, pageWidth - margin - 60, pageHeight - 20);
  }

  doc.save(`LearnQuest_Leaderboard_Class${grade}_${board}.pdf`);
}

export function downloadLeaderboardExcel({ scopeLabel, periodLabel, grade, board, rows, progress }) {
  const meta = buildMeta({ scopeLabel, periodLabel, grade, board });
  const progressRows = buildProgressRows(progress);

  // Single sheet, per the request: meta block, then "My Progress" as its
  // own labelled section (kept apart from the leaderboard rows below it,
  // rather than mixed into the table), then the full leaderboard table.
  const aoa = [
    ["LEARNQUEST - LEADERBOARD & MY PROGRESS"],
    [],
    ...meta,
    [],
    ["MY PROGRESS"],
    ...progressRows,
    [],
    ["LEADERBOARD"],
    ["Rank", "Player", "Level", "XP", "Stars", "Is You"],
    ...rows.map((r) => [r.rank, r.name, r.level, r.xp, r.stars, r.isYou ? "Yes" : ""]),
  ];

  const sheet = XLSX.utils.aoa_to_sheet(aoa);
  sheet["!cols"] = [{ wch: 10 }, { wch: 24 }, { wch: 10 }, { wch: 12 }, { wch: 10 }, { wch: 10 }];

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, sheet, "Leaderboard");
  XLSX.writeFile(workbook, `LearnQuest_Leaderboard_Class${grade}_${board}.xlsx`);
}
