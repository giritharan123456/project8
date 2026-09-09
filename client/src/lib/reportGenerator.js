// Report generation — builds PDF (jsPDF) and Excel/CSV (xlsx) reports
// from student, class, and quiz data. All functions are synchronous
// helpers that produce blobs or trigger downloads client-side.

import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import "jspdf-autotable";

// ── PDF helpers ──────────────────────────────────────────────────────

function addHeader(doc, title, subtitle) {
  doc.setFontSize(20);
  doc.setTextColor(139, 92, 246); // arcane-purple
  doc.text(title, 14, 22);

  doc.setFontSize(10);
  doc.setTextColor(100, 100, 100);
  doc.text(subtitle || `Generated on ${new Date().toLocaleDateString()}`, 14, 30);

  doc.setDrawColor(139, 92, 246);
  doc.setLineWidth(0.5);
  doc.line(14, 34, 196, 34);

  return 40;
}

function addFooter(doc) {
  const pageCount = doc.internal.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    doc.text(
      `LearnQuest — Page ${i} of ${pageCount}`,
      doc.internal.pageSize.getWidth() / 2,
      doc.internal.pageSize.getHeight() - 10,
      { align: "center" }
    );
  }
}

// ── Student Report Card (PDF) ────────────────────────────────────────

export function generateStudentReportPDF(student, results = {}) {
  const doc = new jsPDF();

  const y = addHeader(doc, "Student Report Card", `Student: ${student.name}`);
  let curY = y;

  // Student info table
  doc.autoTable({
    startY: curY,
    head: [["Field", "Value"]],
    body: [
      ["Name", student.name || "N/A"],
      ["Level", String(student.level || "N/A")],
      ["XP", String(student.xp || 0)],
      ["Coins", String(student.coins || 0)],
      ["Streak", `${student.streak || 0} days`],
      ["Accuracy", `${student.accuracy || 0}%`],
      ["Questions Answered", String(student.questionsAnswered || 0)],
      ["Levels Completed", String(student.levelsCompleted || 0)],
      ["Bosses Defeated", String(student.bossesDefeated || 0)],
    ],
    theme: "grid",
    headStyles: { fillColor: [139, 92, 246], textColor: 255 },
    styles: { fontSize: 9 },
  });

  curY = doc.lastAutoTable.finalY + 10;

  // Performance by world
  if (results.worlds && results.worlds.length > 0) {
    doc.setFontSize(12);
    doc.setTextColor(34, 229, 255); // neon-cyan
    doc.text("World Performance", 14, curY);
    curY += 4;

    doc.autoTable({
      startY: curY,
      head: [["World", "Stars", "Accuracy", "Status"]],
      body: results.worlds.map((w) => [
        w.name || "Unknown",
        `${w.stars ?? 0}/3`,
        `${w.accuracy ?? 0}%`,
        w.status || "Not started",
      ]),
      theme: "grid",
      headStyles: { fillColor: [34, 229, 255], textColor: 0 },
      styles: { fontSize: 9 },
    });

    curY = doc.lastAutoTable.finalY + 10;
  }

  // Mastery data
  if (results.mastery && results.mastery.length > 0) {
    if (curY > 240) {
      doc.addPage();
      curY = 20;
    }

    doc.setFontSize(12);
    doc.setTextColor(57, 255, 136); // neon-green
    doc.text("Concept Mastery", 14, curY);
    curY += 4;

    doc.autoTable({
      startY: curY,
      head: [["Concept", "Level", "Accuracy", "Attempts"]],
      body: results.mastery.map((m) => [
        m.concept || "Unknown",
        m.level || "not_started",
        `${m.accuracy ?? 0}%`,
        String(m.totalAttempts ?? 0),
      ]),
      theme: "grid",
      headStyles: { fillColor: [57, 255, 136], textColor: 0 },
      styles: { fontSize: 9 },
    });
  }

  addFooter(doc);
  doc.save(`student-report-${(student.name || "student").replace(/\s+/g, "-")}.pdf`);
}

// ── Class Report (PDF) ───────────────────────────────────────────────

export function generateClassReportPDF(classData, results = {}) {
  const doc = new jsPDF();

  const y = addHeader(doc, "Class Report", `Class: ${classData.name || "N/A"} — Grade ${classData.grade || "?"}`);
  let curY = y;

  // Summary stats
  doc.autoTable({
    startY: curY,
    head: [["Metric", "Value"]],
    body: [
      ["Total Students", String(results.totalStudents || 0)],
      ["Average Accuracy", `${results.avgAccuracy || 0}%`],
      ["Average XP", String(results.avgXp || 0)],
      ["Lessons Completed", String(results.totalLessonsCompleted || 0)],
      ["Top Performer", results.topPerformer || "N/A"],
    ],
    theme: "grid",
    headStyles: { fillColor: [139, 92, 246], textColor: 255 },
    styles: { fontSize: 9 },
  });

  curY = doc.lastAutoTable.finalY + 10;

  // Student list
  if (results.students && results.students.length > 0) {
    doc.setFontSize(12);
    doc.setTextColor(34, 229, 255);
    doc.text("Student Performance", 14, curY);
    curY += 4;

    doc.autoTable({
      startY: curY,
      head: [["Name", "Level", "XP", "Accuracy", "Streak"]],
      body: results.students.map((s) => [
        s.name || "N/A",
        String(s.level || 0),
        String(s.xp || 0),
        `${s.accuracy || 0}%`,
        `${s.streak || 0}d`,
      ]),
      theme: "grid",
      headStyles: { fillColor: [34, 229, 255], textColor: 0 },
      styles: { fontSize: 8 },
    });
  }

  addFooter(doc);
  doc.save(`class-report-${(classData.name || "class").replace(/\s+/g, "-")}.pdf`);
}

// ── Quiz Results Report (PDF) ────────────────────────────────────────

export function generateQuizReportPDF(quiz, attempts = []) {
  const doc = new jsPDF();

  const y = addHeader(doc, "Quiz Report", `Quiz: ${quiz.title || "Untitled"}`);
  let curY = y;

  // Quiz summary
  doc.autoTable({
    startY: curY,
    head: [["Metric", "Value"]],
    body: [
      ["Total Questions", String(quiz.questionCount || 0)],
      ["Attempts", String(attempts.length)],
      [
        "Average Accuracy",
        `${attempts.length > 0 ? Math.round(attempts.reduce((s, a) => s + (a.accuracy || 0), 0) / attempts.length) : 0}%`,
      ],
      [
        "Average Time",
        `${attempts.length > 0 ? Math.round(attempts.reduce((s, a) => s + (a.timeTaken || 0), 0) / attempts.length) : 0}s`,
      ],
      ["Best Score", attempts.length > 0 ? `${Math.max(...attempts.map((a) => a.accuracy || 0))}%` : "N/A"],
    ],
    theme: "grid",
    headStyles: { fillColor: [139, 92, 246], textColor: 255 },
    styles: { fontSize: 9 },
  });

  curY = doc.lastAutoTable.finalY + 10;

  // Attempt details
  if (attempts.length > 0) {
    doc.setFontSize(12);
    doc.setTextColor(34, 229, 255);
    doc.text("Attempt Details", 14, curY);
    curY += 4;

    doc.autoTable({
      startY: curY,
      head: [["Student", "Score", "Accuracy", "Time", "Date"]],
      body: attempts.map((a) => [
        a.studentName || "N/A",
        `${a.score ?? 0}/${quiz.questionCount || "?"}`,
        `${a.accuracy || 0}%`,
        `${a.timeTaken || 0}s`,
        a.date ? new Date(a.date).toLocaleDateString() : "N/A",
      ]),
      theme: "grid",
      headStyles: { fillColor: [34, 229, 255], textColor: 0 },
      styles: { fontSize: 8 },
    });
  }

  addFooter(doc);
  doc.save(`quiz-report-${(quiz.title || "quiz").replace(/\s+/g, "-")}.pdf`);
}

// ── Excel export ─────────────────────────────────────────────────────

export function exportToExcel(data, filename, columns = []) {
  const ws = XLSX.utils.json_to_sheet(
    columns.length > 0
      ? data.map((row) => {
          const out = {};
          for (const col of columns) {
            out[col.header ?? col.key] = row[col.key];
          }
          return out;
        })
      : data
  );

  if (columns.length > 0) {
    ws["!cols"] = columns.map(() => ({ wch: 18 }));
  }

  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
  XLSX.writeFile(wb, `${filename}.xlsx`);
}

// ── Live backend report download (PDF / Excel) ───────────────────────
// The server (`/api/exports/...`) builds authorised, live PDF/XLS exports
// for each role. This helper fetches the binary and saves it locally.

export async function downloadReport(path) {
  const { API_BASE } = await import("../api/config.js");
  const requestUrl = path.startsWith(API_BASE) ? path : `${API_BASE}${path}`;
  const res = await fetch(requestUrl, { credentials: "include" });
  if (!res.ok) {
    let msg = `Download failed (${res.status})`;
    try {
      const body = await res.json();
      if (body.message) msg = body.message;
    } catch {
      // non-JSON error body — keep default message
    }
    throw new Error(msg);
  }
  const blob = await res.blob();
  const cd = res.headers.get("Content-Disposition") || "";
  const m = cd.match(/filename="?([^";]+)"?/);
  const filename = m ? m[1] : `learnquest-report`;
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// ── Leaderboard PDF ──────────────────────────────────────────────────

export function exportLeaderboardPDF(leaderboard = [], title = "Leaderboard") {
  const doc = new jsPDF();

  const y = addHeader(doc, title);
  let curY = y;

  if (leaderboard.length > 0) {
    doc.autoTable({
      startY: curY,
      head: [["Rank", "Name", "XP", "Level", "Accuracy"]],
      body: leaderboard.map((entry, i) => [
        String(i + 1),
        entry.name || "N/A",
        String(entry.xp || 0),
        String(entry.level || 0),
        `${entry.accuracy || 0}%`,
      ]),
      theme: "grid",
      headStyles: { fillColor: [255, 201, 77], textColor: 0 },
      styles: { fontSize: 10 },
      didParseCell: (data) => {
        if (data.section === "body") {
          const rank = data.row.index;
          if (rank === 0) {
            data.cell.styles.fillColor = [255, 215, 0]; // gold
          } else if (rank === 1) {
            data.cell.styles.fillColor = [192, 192, 192]; // silver
          } else if (rank === 2) {
            data.cell.styles.fillColor = [205, 127, 50]; // bronze
          }
        }
      },
    });
  }

  addFooter(doc);
  doc.save(`${title.replace(/\s+/g, "-").toLowerCase()}.pdf`);
}

// ── Format helpers ───────────────────────────────────────────────────

export function formatStudentReportData(student, results = {}) {
  return {
    name: student.name || "N/A",
    level: student.level || 0,
    xp: student.xp || 0,
    coins: student.coins || 0,
    streak: student.streak || 0,
    accuracy: student.accuracy || 0,
    questionsAnswered: student.questionsAnswered || 0,
    levelsCompleted: student.levelsCompleted || 0,
    bossesDefeated: student.bossesDefeated || 0,
    worlds: (results.worlds || []).map((w) => ({
      name: w.name,
      stars: w.stars ?? 0,
      accuracy: w.accuracy ?? 0,
      status: w.status || "Not started",
    })),
    mastery: (results.mastery || []).map((m) => ({
      concept: m.concept,
      level: m.level,
      accuracy: m.accuracy ?? 0,
      totalAttempts: m.totalAttempts ?? 0,
    })),
  };
}

export function formatClassReportData(classData, students = [], results = {}) {
  const avgAccuracy =
    students.length > 0
      ? Math.round(students.reduce((s, st) => s + (st.accuracy || 0), 0) / students.length)
      : 0;
  const avgXp =
    students.length > 0
      ? Math.round(students.reduce((s, st) => s + (st.xp || 0), 0) / students.length)
      : 0;
  const topPerformer =
    students.length > 0
      ? students.reduce((best, st) => ((st.xp || 0) > (best.xp || 0) ? st : best), students[0]).name
      : "N/A";

  return {
    name: classData.name || "N/A",
    grade: classData.grade || "?",
    totalStudents: students.length,
    avgAccuracy,
    avgXp,
    totalLessonsCompleted: results.totalLessonsCompleted || 0,
    topPerformer,
    students: students.map((s) => ({
      name: s.name,
      level: s.level || 0,
      xp: s.xp || 0,
      accuracy: s.accuracy || 0,
      streak: s.streak || 0,
    })),
  };
}
