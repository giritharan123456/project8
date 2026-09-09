import { useMemo } from "react";
import ResourcePage from "../components/ResourcePage.jsx";
import { useTeacherData } from "../TeacherContext.jsx";

const columns = [
  { key: "id", label: "ID" },
  { key: "title", label: "Title" },
  { key: "chapterId", label: "Chapter" },
  { key: "board", label: "Board" },
  { key: "sortOrder", label: "Order" },
  { key: "status", label: "Status", status: true },
];

export default function LessonsPage() {
  const { data, lookups } = useTeacherData();

  const chapterOptions = useMemo(() => data.chapters.map((c) => ({ value: c.id, label: c.title })), [data.chapters]);
  const boardOptions = useMemo(() => lookups.boards.map((b) => b.id), [lookups.boards]);

  const fields = useMemo(
    () => [
      { key: "title", label: "Title", required: true },
      { key: "chapterId", label: "Chapter", type: "select", required: true, options: chapterOptions },
      { key: "description", label: "Description", type: "textarea" },
      { key: "board", label: "Board Override", type: "select", options: boardOptions },
      { key: "sortOrder", label: "Sort Order", type: "number" },
      { key: "status", label: "Status", type: "select", required: true, options: ["published", "draft"] },
    ],
    [chapterOptions, boardOptions]
  );

  return (
    <ResourcePage
      resource="lessons"
      title="Lessons"
      description="Lessons within the courses assigned to you."
      columns={columns}
      fields={fields}
      searchKeys={["id", "title", "board"]}
      addLabel="Add Lesson"
    />
  );
}
