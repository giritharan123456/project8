import { useMemo } from "react";
import ResourcePage from "../components/ResourcePage.jsx";
import { useAdminData } from "../AdminContext.jsx";

const columns = [
  { key: "id", label: "ID" },
  { key: "title", label: "Title" },
  { key: "courseId", label: "Course" },
  { key: "difficulty", label: "Difficulty" },
  { key: "questionCount", label: "Questions" },
  { key: "timeLimitMin", label: "Time (min)" },
  { key: "status", label: "Status", status: true },
];

export default function QuizzesPage() {
  const { data } = useAdminData();
  const courseOptions = useMemo(
    () => data.courses.map((c) => ({ value: c.id, label: c.name })),
    [data.courses]
  );

  const fields = useMemo(
    () => [
      { key: "title", label: "Title", required: true },
      { key: "courseId", label: "Course", type: "select", required: true, options: courseOptions },
      {
        key: "difficulty",
        label: "Difficulty",
        type: "select",
        required: true,
        options: ["easy", "medium", "hard", "expert"],
      },
      { key: "questionCount", label: "Question Count", type: "number" },
      { key: "timeLimitMin", label: "Time Limit (minutes)", type: "number" },
      { key: "status", label: "Status", type: "select", required: true, options: ["published", "draft"] },
    ],
    [courseOptions]
  );

  return (
    <ResourcePage
      resource="quizzes"
      title="Quizzes"
      description="Assembled question sets players attempt inside a course."
      columns={columns}
      fields={fields}
      searchKeys={["id", "title", "difficulty"]}
      addLabel="Add Quiz"
    />
  );
}
