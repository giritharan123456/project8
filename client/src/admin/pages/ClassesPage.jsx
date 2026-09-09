import { useMemo } from "react";
import ResourcePage from "../components/ResourcePage.jsx";
import { useAdminData } from "../AdminContext.jsx";

export default function ClassesPage() {
  const { data } = useAdminData();
  const subjectsById = useMemo(() => Object.fromEntries(data.subjects.map((s) => [s.id, s.name])), [data.subjects]);

  const columns = useMemo(
    () => [
      { key: "grade", label: "Grade" },
      { key: "difficultyLabel", label: "Difficulty" },
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
      { key: "questions", label: "Questions" },
    ],
    [subjectsById]
  );

  const fields = useMemo(
    () => [
      { key: "id", label: "Class ID (e.g. 9)", required: true },
      { key: "grade", label: "Grade", type: "number", required: true },
      { key: "difficultyLabel", label: "Difficulty Label", required: true },
      {
        key: "subjectIds",
        label: "Subjects Offered",
        type: "multiselect",
        options: data.subjects.map((s) => ({ value: s.id, label: s.name })),
      },
      { key: "courses", label: "Courses", type: "number" },
      { key: "lessons", label: "Lessons", type: "number" },
      { key: "questions", label: "Questions", type: "number" },
      { key: "icon", label: "Icon (lucide name)", type: "text" },
    ],
    [data.subjects]
  );

  return (
    <ResourcePage
      resource="classes"
      title="Classes"
      description="Grade levels, and which subjects are offered at each grade."
      columns={columns}
      fields={fields}
      searchKeys={["grade", "difficultyLabel"]}
      addLabel="Add Class"
    />
  );
}
