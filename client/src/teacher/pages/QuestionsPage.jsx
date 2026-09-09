import { useMemo } from "react";
import ResourcePage from "../components/ResourcePage.jsx";
import { useTeacherData } from "../TeacherContext.jsx";

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
  { key: "lessonId", label: "Lesson" },
  { key: "difficulty", label: "Difficulty" },
  { key: "type", label: "Type" },
  { key: "status", label: "Status", status: true },
];

export default function QuestionsPage() {
  const { data } = useTeacherData();
  const lessonOptions = useMemo(() => data.lessons.map((l) => ({ value: l.id, label: l.title })), [data.lessons]);

  const fields = useMemo(
    () => [
      { key: "questionText", label: "Question Text", type: "textarea", required: true },
      { key: "lessonId", label: "Lesson", type: "select", required: true, options: lessonOptions },
      { key: "difficulty", label: "Difficulty", type: "select", required: true, options: ["easy", "medium", "hard", "expert"] },
      { key: "type", label: "Question Type", type: "select", required: true, options: ["mcq", "multi_select", "true_false", "fill_blank", "numerical", "sequence", "match_following"] },
      { key: "correctAnswer", label: "Correct Answer", required: true },
      { key: "explanation", label: "Explanation", type: "textarea" },
      { key: "status", label: "Status", type: "select", required: true, options: ["published", "draft"] },
    ],
    [lessonOptions]
  );

  return (
    <ResourcePage
      resource="questions"
      title="Questions"
      description="The question bank for the lessons assigned to you."
      columns={columns}
      fields={fields}
      searchKeys={["id", "questionText", "difficulty"]}
      addLabel="Add Question"
    />
  );
}
