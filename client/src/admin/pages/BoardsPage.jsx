import { useMemo } from "react";
import ResourcePage from "../components/ResourcePage.jsx";
import { useAdminData } from "../AdminContext.jsx";

export default function BoardsPage() {
  const { data } = useAdminData();
  const subjectsById = useMemo(() => Object.fromEntries(data.subjects.map((s) => [s.id, s.name])), [data.subjects]);

  const columns = useMemo(
    () => [
      { key: "id", label: "Code" },
      { key: "name", label: "Name" },
      { key: "type", label: "Type" },
      { key: "category", label: "Category" },
      {
        key: "subjectIds",
        label: "Subjects",
        render: (row) => (
          <span className="text-ink-primary">
            {(row.subjectIds ?? []).map((id) => subjectsById[id] ?? id).join(", ") || "\u2014"}
          </span>
        ),
      },
      { key: "courses", label: "Courses" },
      { key: "lessons", label: "Lessons" },
      { key: "status", label: "Status", status: true },
    ],
    [subjectsById]
  );

  const fields = useMemo(
    () => [
      { key: "id", label: "Board Code (e.g. CBSE)", required: true },
      { key: "name", label: "Name", required: true },
      {
        key: "type",
        label: "Type",
        type: "select",
        required: true,
        options: ["Central Board", "State Board", "International Board"],
      },
      {
        key: "category",
        label: "Category",
        type: "select",
        required: true,
        options: ["Central Boards", "State Boards", "International Boards"],
      },
      { key: "description", label: "Description", type: "textarea" },
      {
        key: "subjectIds",
        label: "Subjects Offered",
        type: "multiselect",
        options: data.subjects.map((s) => ({ value: s.id, label: s.name })),
      },
      { key: "courses", label: "Courses", type: "number" },
      { key: "lessons", label: "Lessons", type: "number" },
      { key: "icon", label: "Icon (lucide name)", type: "text" },
      {
        key: "status",
        label: "Status",
        type: "select",
        required: true,
        options: ["active", "draft"],
      },
    ],
    [data.subjects]
  );

  return (
    <ResourcePage
      resource="boards"
      title="Boards"
      description="Education boards, and which subjects each one offers."
      columns={columns}
      fields={fields}
      searchKeys={["id", "name", "type", "category"]}
      addLabel="Add Board"
    />
  );
}
