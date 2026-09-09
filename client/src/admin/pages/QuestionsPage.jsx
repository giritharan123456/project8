import { useMemo } from "react";
import ResourcePage from "../components/ResourcePage.jsx";
import { useAdminData } from "../AdminContext.jsx";

const columns = [
  { key: "id", label: "ID" },
  {
    key: "questionText",
    label: "Question",
    render: (row) => (
      <span className="block max-w-xs truncate text-ink-primary" title={row.questionText}>
        {row.questionText}
      </span>
    ),
  },
  { key: "courseId", label: "Course" },
  { key: "difficulty", label: "Difficulty" },
  { key: "type", label: "Type" },
  { key: "status", label: "Status", status: true },
];

export default function QuestionsPage() {
  const { data } = useAdminData();
  // Real Course list (the `worlds` table, see AdminContext.jsx's
  // courseCatalog) - the real `questions` table (and the battle engine
  // that reads it) scopes a question by Course + optional Board override
  // + Difficulty, never by lesson, so there's no lessonId field here.
  const courseOptions = useMemo(
    () => data.courseCatalog.map((c) => ({ value: c.id, label: c.name })),
    [data.courseCatalog]
  );

  const fields = useMemo(
    () => [
      { key: "questionText", label: "Question Text", type: "textarea", required: true },
      { key: "courseId", label: "Course", type: "select", required: true, options: courseOptions },
      {
        key: "board",
        label: "Board Override",
        type: "select",
        options: ["CBSE", "ICSE", "TN", "MH", "IB", "IGCSE"],
      },
      {
        key: "difficulty",
        label: "Difficulty",
        type: "select",
        required: true,
        options: ["easy", "medium", "hard", "expert"],
      },
      {
        key: "type",
        label: "Question Type",
        type: "select",
        required: true,
        options: ["mcq", "multi_select", "true_false", "fill_blank", "numerical", "sequence", "match_following"],
      },
      { key: "correctAnswer", label: "Correct Answer", required: true },
      { key: "explanation", label: "Explanation", type: "textarea" },
      { key: "status", label: "Status", type: "select", required: true, options: ["published", "draft"] },
    ],
    [courseOptions]
  );

  return (
    <ResourcePage
      resource="questions"
      title="Questions"
      description="The question bank powering battles and boss fights."
      columns={columns}
      fields={fields}
      searchKeys={["id", "questionText", "courseId", "difficulty"]}
      addLabel="Add Question"
    />
  );
}
