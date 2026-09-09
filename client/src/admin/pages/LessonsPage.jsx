import { useMemo } from "react";
import ResourcePage from "../components/ResourcePage.jsx";
import { useAdminData } from "../AdminContext.jsx";

const columns = [
  { key: "id", label: "ID" },
  { key: "title", label: "Title" },
  { key: "courseId", label: "Course" },
  { key: "board", label: "Board" },
  { key: "sortOrder", label: "Order" },
  { key: "status", label: "Status", status: true },
];

export default function LessonsPage() {
  const { data } = useAdminData();
  // Real Course list (the `worlds` table, see AdminContext.jsx's
  // courseCatalog) - lessons no longer group under a mock chapterId;
  // the real `lessons` table only has a Course (world_id) relation, with
  // an optional per-board override.
  const courseOptions = useMemo(
    () => data.courseCatalog.map((c) => ({ value: c.id, label: c.name })),
    [data.courseCatalog]
  );

  const fields = useMemo(
    () => [
      { key: "title", label: "Title", required: true },
      { key: "courseId", label: "Course", type: "select", required: true, options: courseOptions },
      { key: "description", label: "Description", type: "textarea" },
      {
        key: "board",
        label: "Board Override",
        type: "select",
        options: ["CBSE", "ICSE", "TN", "MH", "IB", "IGCSE"],
      },
      { key: "sortOrder", label: "Sort Order", type: "number" },
      { key: "status", label: "Status", type: "select", required: true, options: ["published", "draft"] },
    ],
    [courseOptions]
  );

  return (
    <ResourcePage
      resource="lessons"
      title="Lessons"
      description="Individual lessons players complete inside a course."
      columns={columns}
      fields={fields}
      searchKeys={["id", "title", "courseId", "board"]}
      addLabel="Add Lesson"
    />
  );
}
