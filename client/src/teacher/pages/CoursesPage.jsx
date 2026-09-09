import { useMemo } from "react";
import ResourcePage from "../components/ResourcePage.jsx";
import { useTeacherData } from "../TeacherContext.jsx";

const columns = [
  { key: "id", label: "ID" },
  { key: "name", label: "Name" },
  { key: "topic", label: "Topic" },
  { key: "subject", label: "Subject" },
  { key: "grade", label: "Grade" },
  { key: "boss", label: "Boss" },
  { key: "status", label: "Status", status: true },
];

export default function CoursesPage() {
  const { data } = useTeacherData();

  const gradeOptions = useMemo(() => data.classes.map((c) => c.grade), [data.classes]);
  const subjectOptions = data.subjects;

  const fields = useMemo(
    () => [
      { key: "id", label: "Course ID (e.g. atom-valley)", required: true },
      { key: "name", label: "Name", required: true },
      { key: "topic", label: "Topic", required: true },
      { key: "subject", label: "Subject", type: "select", options: subjectOptions, required: true },
      { key: "grade", label: "Grade", type: "select", options: gradeOptions, required: true },
      { key: "boss", label: "Boss Name" },
      { key: "icon", label: "Icon (lucide name)", type: "text" },
      { key: "sortOrder", label: "Sort Order", type: "number" },
      { key: "isFinal", label: "Final World", type: "checkbox" },
      { key: "status", label: "Status", type: "select", required: true, options: ["published", "draft"] },
    ],
    [subjectOptions, gradeOptions]
  );

  return (
    <ResourcePage
      resource="courses"
      title="Courses"
      description="Worlds within the subjects and grades assigned to you."
      columns={columns}
      fields={fields}
      searchKeys={["id", "name", "topic", "subject"]}
      addLabel="Add Course"
    />
  );
}
