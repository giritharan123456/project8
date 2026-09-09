import { useMemo } from "react";
import ResourcePage from "../components/ResourcePage.jsx";
import { useAdminData } from "../AdminContext.jsx";

const columns = [
  { key: "id", label: "ID" },
  { key: "title", label: "Title" },
  { key: "courseId", label: "Course" },
  { key: "lessonsCount", label: "Lessons" },
  { key: "sortOrder", label: "Order" },
  { key: "status", label: "Status", status: true },
];

export default function ChaptersPage() {
  const { data } = useAdminData();
  const courseOptions = useMemo(
    () => data.courses.map((c) => ({ value: c.id, label: c.name })),
    [data.courses]
  );

  const fields = useMemo(
    () => [
      { key: "title", label: "Title", required: true },
      { key: "courseId", label: "Course", type: "select", required: true, options: courseOptions },
      { key: "description", label: "Description", type: "textarea" },
      { key: "lessonsCount", label: "Lessons Count", type: "number" },
      { key: "sortOrder", label: "Sort Order", type: "number" },
      { key: "status", label: "Status", type: "select", required: true, options: ["published", "draft"] },
    ],
    [courseOptions]
  );

  return (
    <ResourcePage
      resource="chapters"
      title="Chapters"
      description="Groups of lessons within a course."
      columns={columns}
      fields={fields}
      searchKeys={["id", "title", "courseId"]}
      addLabel="Add Chapter"
    />
  );
}
