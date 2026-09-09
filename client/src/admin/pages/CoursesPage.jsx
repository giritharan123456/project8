import ResourcePage from "../components/ResourcePage.jsx";

const columns = [
  { key: "id", label: "ID" },
  { key: "name", label: "Name" },
  { key: "topic", label: "Topic" },
  { key: "subject", label: "Subject" },
  { key: "grade", label: "Grade" },
  { key: "boss", label: "Boss" },
  { key: "status", label: "Status", status: true },
];

const fields = [
  { key: "id", label: "Course ID (e.g. atom-valley)", required: true },
  { key: "name", label: "Name", required: true },
  { key: "topic", label: "Topic", required: true },
  { key: "subject", label: "Subject", type: "select", options: ["Chemistry", "Physics", "Biology"], required: true },
  { key: "grade", label: "Grade", type: "select", options: [4, 5, 6, 7, 8, 9, 10, 11, 12], required: true },
  { key: "boss", label: "Boss Name" },
  { key: "icon", label: "Icon (lucide name)", type: "text" },
  { key: "sortOrder", label: "Sort Order", type: "number" },
  { key: "isFinal", label: "Final World", type: "checkbox" },
  {
    key: "status",
    label: "Status",
    type: "select",
    required: true,
    options: ["published", "draft"],
  },
];

export default function CoursesPage() {
  return (
    <ResourcePage
      resource="courses"
      title="Courses"
      description="Chemistry Worlds on the World Map -- one course per topic."
      columns={columns}
      fields={fields}
      searchKeys={["id", "name", "topic", "subject"]}
      addLabel="Add Course"
    />
  );
}
