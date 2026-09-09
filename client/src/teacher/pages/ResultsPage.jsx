import { useMemo } from "react";
import ResourcePage from "../components/ResourcePage.jsx";
import { useTeacherData } from "../TeacherContext.jsx";

export default function ResultsPage() {
  const { data } = useTeacherData();

  const studentsById = useMemo(() => Object.fromEntries(data.students.map((s) => [s.id, s.name])), [data.students]);
  const assignmentsById = useMemo(() => Object.fromEntries(data.assignments.map((a) => [a.id, a.title])), [data.assignments]);

  const columns = useMemo(
    () => [
      { key: "id", label: "ID" },
      {
        key: "studentId",
        label: "Student",
        render: (row) => <span className="text-ink-primary">{studentsById[row.studentId] ?? row.studentId}</span>,
      },
      {
        key: "assignmentId",
        label: "Assignment",
        render: (row) => (
          <span className="block max-w-xs truncate text-ink-primary" title={assignmentsById[row.assignmentId]}>
            {assignmentsById[row.assignmentId] ?? row.assignmentId}
          </span>
        ),
      },
      {
        key: "score",
        label: "Score",
        render: (row) => (row.score != null ? <span className="text-ink-primary">{row.score}%</span> : <span className="text-ink-faint">{"\u2014"}</span>),
      },
      { key: "submittedAt", label: "Submitted", render: (row) => <span className="text-ink-primary">{row.submittedAt ?? "\u2014"}</span> },
      { key: "status", label: "Status", status: true },
    ],
    [studentsById, assignmentsById]
  );

  const studentOptions = useMemo(() => data.students.map((s) => ({ value: s.id, label: s.name })), [data.students]);
  const assignmentOptions = useMemo(() => data.assignments.map((a) => ({ value: a.id, label: a.title })), [data.assignments]);

  const fields = useMemo(
    () => [
      { key: "assignmentId", label: "Assignment", type: "select", required: true, options: assignmentOptions },
      { key: "studentId", label: "Student", type: "select", required: true, options: studentOptions },
      { key: "status", label: "Status", type: "select", required: true, options: ["submitted", "graded", "late", "missing"] },
      { key: "score", label: "Score (%)", type: "number" },
      { key: "submittedAt", label: "Submitted Date", type: "date" },
      { key: "feedback", label: "Feedback", type: "textarea" },
    ],
    [assignmentOptions, studentOptions]
  );

  return (
    <ResourcePage
      resource="results"
      title="Results"
      description="Submissions and grades for the assignments you've created."
      columns={columns}
      fields={fields}
      searchKeys={["id", "studentId", "assignmentId"]}
      addLabel="Add Result"
    />
  );
}
