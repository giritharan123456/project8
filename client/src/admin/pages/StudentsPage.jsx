import { useState } from "react";
import { Eye } from "lucide-react";
import ResourcePage from "../components/ResourcePage.jsx";
import StudentProgressModal from "../components/StudentProgressModal.jsx";

const columns = [
  { key: "id", label: "ID" },
  { key: "name", label: "Name" },
  { key: "email", label: "Email" },
  { key: "grade", label: "Grade" },
  { key: "board", label: "Board" },
  { key: "level", label: "Level" },
  { key: "xp", label: "XP" },
  {
    key: "lessonsCompletedCount",
    label: "Lessons",
    render: (row) => <span className="text-ink-primary">{row.lessonsCompletedCount ?? 0}</span>,
  },
  {
    key: "avgQuizScore",
    label: "Avg. Quiz",
    render: (row) =>
      row.avgQuizScore === null || row.avgQuizScore === undefined ? (
        <span className="text-ink-faint">{"\u2014"}</span>
      ) : (
        <span className="text-ink-primary">{row.avgQuizScore}%</span>
      ),
  },
  { key: "status", label: "Status", status: true },
];

const fields = [
  { key: "name", label: "Name", required: true },
  { key: "email", label: "Email", type: "email", required: true },
  // Only shown when adding a new student - creating a real login account
  // needs a password; editing one doesn't touch it (see FormModal's
  // addOnly handling and admin.js's PATCH /students, which never accepts one).
  { key: "password", label: "Temporary Password", type: "text", required: true, addOnly: true },
  {
    key: "grade",
    label: "Grade",
    type: "select",
    required: true,
    options: [4, 5, 6, 7, 8, 9, 10, 11, 12],
  },
  {
    key: "board",
    label: "Board",
    type: "select",
    required: true,
    options: ["CBSE", "ICSE", "TN", "MH", "IB", "IGCSE"],
  },
  { key: "level", label: "Level", type: "number" },
  { key: "xp", label: "XP", type: "number" },
  { key: "coins", label: "Coins", type: "number" },
  {
    key: "status",
    label: "Status",
    type: "select",
    required: true,
    options: ["active", "inactive", "suspended"],
  },
];

export default function StudentsPage() {
  const [viewing, setViewing] = useState(null);

  return (
    <>
      <ResourcePage
        resource="students"
        title="Students"
        description="Every learner enrolled across boards and classes."
        columns={columns}
        fields={fields}
        searchKeys={["id", "name", "email", "board"]}
        addLabel="Add Student"
        renderRowActions={(row) => (
          <button
            type="button"
            onClick={() => setViewing(row)}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-ink-faint transition-colors hover:bg-arcane-purple/10 hover:text-arcane-purple"
            aria-label={`View progress for ${row.name}`}
            title="View progress"
          >
            <Eye className="h-4 w-4" strokeWidth={1.8} />
          </button>
        )}
      />
      {viewing && <StudentProgressModal student={viewing} onClose={() => setViewing(null)} />}
    </>
  );
}
