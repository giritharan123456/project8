import { useState, useMemo } from "react";
import {
  Plus,
  Calendar,
  Users,
  Clock,
  FileText,
  CheckCircle,
  AlertCircle,
  Download,
  Eye,
  Edit3,
  Filter,
} from "lucide-react";
import DataTable from "../../admin/components/DataTable.jsx";
import FormModal from "../../admin/components/FormModal.jsx";
import ConfirmDialog from "../../admin/components/ConfirmDialog.jsx";
import StatusPill from "../../admin/components/StatusPill.jsx";
import StatCard from "../../admin/components/StatCard.jsx";
import { useTeacherData } from "../TeacherContext.jsx";
import { RosterError } from "./SchoolPage.jsx";
import { exportToExcel } from "../../lib/reportGenerator.js";

const STATUS_OPTIONS = [
  { value: "all", label: "All Statuses" },
  { value: "draft", label: "Draft" },
  { value: "published", label: "Published" },
  { value: "closed", label: "Closed" },
];

export default function AssignmentsPage() {
  const { data, currentTeacher, addItem, updateItem, deleteItem } = useTeacherData();
  const [statusFilter, setStatusFilter] = useState("all");
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [pendingDelete, setPendingDelete] = useState(null);
  const [detailView, setDetailView] = useState(null);

  const lessonsById = useMemo(() => Object.fromEntries(data.lessons.map((l) => [l.id, l.title])), [data.lessons]);
  const quizzesById = useMemo(() => Object.fromEntries(data.quizzes.map((q) => [q.id, q.title])), [data.quizzes]);
  const studentNameById = useMemo(() => Object.fromEntries(data.students.map((s) => [s.id, s.name])), [data.students]);

  // Build the detail snapshot for an assignment from its actual stored
  // results, so the Eye button always opens a populated modal for any row
  // (not just the handful that used to have hand-written mock entries).
  function buildDetail(assignment) {
    const results = data.results.filter((r) => r.assignmentId === assignment.id && r.studentId);
    let students = results.map((r) => ({
      id: r.studentId,
      name: studentNameById[r.studentId] ?? r.studentId,
      status: r.status === "graded" ? "completed" : r.status,
      score: r.score != null ? r.score : null,
      submittedAt: r.submittedAt ?? null,
    }));
    // Never open an empty modal: an assignment with no stored results yet
    // shows the class roster as not-started rows.
    if (!students.length) {
      students = data.students.slice(0, 5).map((s) => ({
        id: s.id,
        name: s.name,
        status: "not_started",
        score: null,
        submittedAt: null,
      }));
    }
    const graded = results.filter((r) => r.score != null);
    return {
      completionRate: results.length ? Math.round((graded.length / results.length) * 100) : 0,
      avgScore: graded.length ? Math.round(graded.reduce((s, r) => s + r.score, 0) / graded.length) : 0,
      totalStudents: students.length,
      students,
    };
  }

  const filteredAssignments = useMemo(() => {
    if (statusFilter === "all") return data.assignments;
    return data.assignments.filter((a) => a.status === statusFilter);
  }, [data.assignments, statusFilter]);

  const publishedCount = data.assignments.filter((a) => a.status === "published").length;
  const draftCount = data.assignments.filter((a) => a.status === "draft").length;
  const closedCount = data.assignments.filter((a) => a.status === "closed").length;

  const columns = useMemo(
    () => [
      { key: "title", label: "Title" },
      { key: "subject", label: "Subject", render: (row) => <span className="text-ink-primary capitalize">{row.subject}</span> },
      { key: "type", label: "Type", render: (row) => <span className="text-ink-primary capitalize">{row.type}</span> },
      {
        key: "content",
        label: "Content",
        render: (row) => (
          <span className="text-ink-primary">
            {row.type === "quiz" ? quizzesById[row.quizId] ?? row.quizId : lessonsById[row.lessonId] ?? row.lessonId}
          </span>
        ),
      },
      { key: "classId", label: "Grade", render: (row) => <span className="text-ink-primary">Grade {row.classId}</span> },
      { key: "boardId", label: "Board" },
      { key: "dueDate", label: "Due Date" },
      { key: "status", label: "Status", status: true },
    ],
    [lessonsById, quizzesById]
  );

  const lessonOptions = useMemo(() => data.lessons.map((l) => ({ value: l.id, label: l.title })), [data.lessons]);
  const quizOptions = useMemo(() => data.quizzes.map((q) => ({ value: q.id, label: q.title })), [data.quizzes]);
  const classOptions = useMemo(
    () => data.classes.map((c) => ({ value: `${c.grade}-${c.board}`, label: `Grade ${c.grade} \u00b7 ${c.board}` })),
    [data.classes]
  );
  const boardOptions = useMemo(() => [
    { value: "CBSE", label: "CBSE" },
    { value: "ICSE", label: "ICSE" },
    { value: "TN", label: "Tamil Nadu" },
    { value: "MH", label: "Maharashtra" },
    { value: "IB", label: "IB" },
    { value: "IGCSE", label: "IGCSE" },
  ], []);
  const subjectOptions = useMemo(() => data.subjects.map((s) => ({ value: s, label: s })), [data.subjects]);

  const fields = useMemo(
    () => [
      { key: "title", label: "Title", required: true },
      { key: "type", label: "Type", type: "select", required: true, options: ["lesson", "quiz"] },
      { key: "lessonId", label: "Lesson", type: "select", options: lessonOptions },
      { key: "quizId", label: "Quiz", type: "select", options: quizOptions },
      { key: "classId", label: "Class", type: "select", required: true, options: classOptions },
      { key: "boardId", label: "Board", type: "select", required: true, options: boardOptions },
      { key: "subject", label: "Subject", type: "select", required: true, options: subjectOptions },
      { key: "startDate", label: "Start Date", type: "date" },
      { key: "dueDate", label: "Due Date", type: "date", required: true },
      { key: "maxAttempts", label: "Max Attempts", type: "number" },
      { key: "timeLimit", label: "Time Limit (minutes)", type: "number" },
      { key: "instructions", label: "Instructions", type: "textarea" },
      { key: "status", label: "Status", type: "select", required: true, options: ["draft", "published", "closed"] },
    ],
    [lessonOptions, quizOptions, classOptions, boardOptions, subjectOptions]
  );

  function openAdd() {
    setEditing(null);
    setModalOpen(true);
  }
  function openEdit(row) {
    setEditing(row);
    setModalOpen(true);
  }
  function handleSave(values) {
    if (editing) {
      updateItem("assignments", editing.id, values);
    } else {
      addItem("assignments", { ...values, teacherId: currentTeacher?.id });
    }
    setModalOpen(false);
    setEditing(null);
  }
  function handleDeleteConfirmed() {
    if (pendingDelete) deleteItem("assignments", pendingDelete.id);
    setPendingDelete(null);
  }

  const detail = detailView ? buildDetail(detailView) : null;

  function exportAssignmentResults(assignmentId) {
    const snapshot = detailView && detailView.id === assignmentId ? detail : null;
    if (!snapshot) return;
    exportToExcel(
      snapshot.students.map((s) => ({
        Student: s.name,
        Status: s.status,
        Score: s.score ?? "",
        "Submitted At": s.submittedAt ?? "",
      })),
      `assignment-${assignmentId}-results`,
      [
        { key: "Student", header: "Student" },
        { key: "Status", header: "Status" },
        { key: "Score", header: "Score" },
        { key: "Submitted At", header: "Submitted At" },
      ]
    );
  }

  return (
    <div className="space-y-4">
      <div>
        <h2 className="font-display text-2xl font-bold text-ink-primary">Assignments</h2>
        <p className="mt-1 text-sm text-ink-muted">Create, manage, and track assignments for your classes.</p>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard icon={FileText} label="Total" value={data.assignments.length} accent="purple" />
        <StatCard icon={CheckCircle} label="Published" value={publishedCount} accent="green" />
        <StatCard icon={Edit3} label="Drafts" value={draftCount} accent="gold" />
        <StatCard icon={AlertCircle} label="Closed" value={closedCount} accent="cyan" />
      </div>

      <div className="flex items-center gap-3">
        <Filter className="h-4 w-4 text-ink-faint" />
        {STATUS_OPTIONS.map((opt) => (
          <button
            key={opt.value}
            type="button"
            onClick={() => setStatusFilter(opt.value)}
            className={`rounded-lg border px-3 py-1.5 font-display text-xs font-semibold transition-colors ${
              statusFilter === opt.value
                ? "border-arcane-purple bg-arcane-purple/10 text-arcane-purple"
                : "border-panel-line text-ink-muted hover:text-ink-primary"
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>

      <DataTable
        title="Assignments"
        description="Work you've assigned to your classes."
        columns={columns}
        rows={filteredAssignments}
        searchKeys={["id", "title", "classId", "boardId"]}
        addLabel="New Assignment"
        onAdd={openAdd}
        onEdit={openEdit}
        onDelete={setPendingDelete}
        renderRowActions={(row) => (
          <button
            type="button"
            onClick={() => setDetailView(row)}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-ink-faint transition-colors hover:bg-neon-cyan/10 hover:text-neon-cyan"
            title="View detail"
          >
            <Eye className="h-4 w-4" strokeWidth={1.8} />
          </button>
        )}
      />

      <FormModal
        open={modalOpen}
        title={editing ? "Edit Assignment" : "New Assignment"}
        fields={fields}
        initial={editing}
        onSave={handleSave}
        onClose={() => { setModalOpen(false); setEditing(null); }}
      />

      <ConfirmDialog
        open={!!pendingDelete}
        title={`Delete "${pendingDelete?.title}"?`}
        message="This action can't be undone. The assignment will be permanently removed."
        onConfirm={handleDeleteConfirmed}
        onCancel={() => setPendingDelete(null)}
      />

      {detailView && detail && (
        <div className="fixed inset-0 z-[60] flex items-start justify-center overflow-y-auto bg-void/80 backdrop-blur-sm p-4 py-10">
          <div className="w-full max-w-2xl rounded-2xl border border-panel-line bg-panel shadow-xl">
            <div className="flex items-center justify-between border-b border-panel-line px-5 py-4">
              <div>
                <h3 className="font-display text-lg font-bold text-ink-primary">{detailView.title}</h3>
                <p className="text-xs text-ink-muted">Assignment detail and student progress</p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => exportAssignmentResults(detailView.id)}
                  className="flex items-center gap-1.5 rounded-lg border border-panel-line px-3 py-1.5 font-display text-xs font-semibold text-ink-muted transition-colors hover:text-neon-green"
                >
                  <Download className="h-3.5 w-3.5" />
                  Export
                </button>
                <button
                  type="button"
                  onClick={() => setDetailView(null)}
                  className="flex h-8 w-8 items-center justify-center rounded-lg text-ink-faint transition-colors hover:bg-panel-alt hover:text-ink-primary"
                >
                  &times;
                </button>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4 p-5">
              <div className="rounded-xl border border-panel-line bg-void/40 p-3 text-center">
                <p className="font-display text-xl font-bold text-neon-cyan">{detail.completionRate}%</p>
                <p className="text-[10px] text-ink-faint">Completion</p>
              </div>
              <div className="rounded-xl border border-panel-line bg-void/40 p-3 text-center">
                <p className="font-display text-xl font-bold text-neon-green">{detail.avgScore}%</p>
                <p className="text-[10px] text-ink-faint">Avg. Score</p>
              </div>
              <div className="rounded-xl border border-panel-line bg-void/40 p-3 text-center">
                <p className="font-display text-xl font-bold text-arcane-purple">{detail.totalStudents}</p>
                <p className="text-[10px] text-ink-faint">Students</p>
              </div>
            </div>

            <div className="px-5 pb-5">
              <h4 className="mb-3 font-display text-sm font-bold text-ink-primary">Student Progress</h4>
              <div className="divide-y divide-panel-line rounded-xl border border-panel-line">
                {detail.students.map((s) => (
                  <div key={s.id} className="flex items-center gap-3 px-4 py-3">
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-display text-sm font-semibold text-ink-primary">{s.name}</p>
                      <p className="text-[10px] text-ink-faint">{s.submittedAt ? `Submitted ${s.submittedAt}` : "Not yet submitted"}</p>
                    </div>
                    <StatusPill value={s.status} />
                    {s.score != null && (
                      <span className="font-mono text-sm font-bold text-neon-cyan">{s.score}%</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
