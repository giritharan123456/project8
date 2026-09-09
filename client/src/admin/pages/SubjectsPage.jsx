import ResourcePage from "../components/ResourcePage.jsx";

const columns = [
  { key: "id", label: "Code" },
  { key: "name", label: "Name" },
  { key: "description", label: "Description" },
  { key: "worldsCount", label: "Worlds" },
  { key: "status", label: "Status", status: true },
];

const fields = [
  { key: "id", label: "Code (e.g. chemistry)", required: true },
  { key: "name", label: "Name", required: true },
  { key: "description", label: "Description", type: "textarea" },
  { key: "icon", label: "Icon (lucide name)", type: "text" },
  {
    key: "status",
    label: "Status",
    type: "select",
    required: true,
    options: ["active", "coming_soon"],
  },
];

export default function SubjectsPage() {
  return (
    <ResourcePage
      resource="subjects"
      title="Subjects"
      description="Top-level subjects that curriculum content is organized under."
      columns={columns}
      fields={fields}
      searchKeys={["id", "name"]}
      addLabel="Add Subject"
    />
  );
}
