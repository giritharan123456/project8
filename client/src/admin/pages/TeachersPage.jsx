import { useMemo } from "react";
import ResourcePage from "../components/ResourcePage.jsx";
import { useAdminData } from "../AdminContext.jsx";

const BOARD_OPTIONS = ["CBSE", "ICSE", "TN", "MH", "IB", "IGCSE"];
const CLASS_OPTIONS = ["9", "10", "11", "12"];

function joinNames(ids, lookup) {
  if (!ids?.length) return "\u2014";
  return ids.map((id) => lookup[id] ?? id).join(", ");
}

export default function TeachersPage() {
  const { data } = useAdminData();
  const subjectsById = useMemo(() => Object.fromEntries(data.subjects.map((s) => [s.id, s.name])), [data.subjects]);

  const columns = useMemo(
    () => [
      { key: "id", label: "ID" },
      { key: "name", label: "Name" },
      { key: "email", label: "Email" },
      {
        key: "subjectIds",
        label: "Subjects",
        render: (row) => <span className="text-ink-primary">{joinNames(row.subjectIds, subjectsById)}</span>,
      },
      {
        key: "boardIds",
        label: "Boards",
        render: (row) => <span className="text-ink-primary">{(row.boardIds ?? []).join(", ") || "\u2014"}</span>,
      },
      {
        key: "classIds",
        label: "Classes",
        render: (row) => <span className="text-ink-primary">{(row.classIds ?? []).map((c) => `Grade ${c}`).join(", ") || "\u2014"}</span>,
      },
      { key: "status", label: "Status", status: true },
    ],
    [subjectsById]
  );

  const fields = useMemo(
    () => [
      { key: "name", label: "Name", required: true },
      { key: "email", label: "Email", type: "email", required: true },
      // Only shown when adding - see StudentsPage.jsx's identical field for why.
      { key: "password", label: "Temporary Password", type: "text", required: true, addOnly: true },
      {
        key: "subjectIds",
        label: "Subjects Taught",
        type: "multiselect",
        options: data.subjects.map((s) => ({ value: s.id, label: s.name })),
      },
      {
        key: "boardIds",
        label: "Boards Assigned",
        type: "multiselect",
        options: BOARD_OPTIONS,
      },
      {
        key: "classIds",
        label: "Classes Assigned",
        type: "multiselect",
        options: CLASS_OPTIONS.map((c) => ({ value: c, label: `Grade ${c}` })),
      },
      {
        key: "status",
        label: "Status",
        type: "select",
        required: true,
        options: ["active", "inactive", "suspended"],
      },
    ],
    [data.subjects]
  );

  return (
    <ResourcePage
      resource="teachers"
      title="Teachers"
      description="Educators, and the subjects/classes/boards they're assigned to."
      columns={columns}
      fields={fields}
      searchKeys={["id", "name", "email"]}
      addLabel="Add Teacher"
    />
  );
}
