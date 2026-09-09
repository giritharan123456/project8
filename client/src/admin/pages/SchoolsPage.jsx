import { useCallback, useEffect, useState } from "react";
import { Landmark, GraduationCap, Users } from "lucide-react";
import DataTable from "../components/DataTable.jsx";
import FormModal from "../components/FormModal.jsx";
import ConfirmDialog from "../components/ConfirmDialog.jsx";
import StatCard from "../components/StatCard.jsx";
import { getSchools, createSchool, updateSchool, deleteSchool } from "../api.js";
import { ApiError } from "../../api/client.js";

const columns = [
  { key: "id", label: "ID" },
  { key: "name", label: "Name" },
  { key: "studentCount", label: "Students" },
  { key: "teacherCount", label: "Teachers" },
  {
    key: "created_at",
    label: "Added",
    render: (row) => (
      <span className="text-ink-primary">{row.created_at ? new Date(row.created_at).toLocaleDateString() : "\u2014"}</span>
    ),
  },
];

const fields = [{ key: "name", label: "School Name", required: true }];

// Unlike every other /admin resource page, this one talks to the real
// database (server/src/routes/admin.js's /schools CRUD) instead of
// AdminContext's localStorage store - the schools table has existed since
// Section 4's school-based data separation, so there's no reason to mock it.
export default function SchoolsPage() {
  const [schools, setSchools] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [saveError, setSaveError] = useState(null);

  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [pendingDelete, setPendingDelete] = useState(null);
  const [deleteError, setDeleteError] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const rows = await getSchools();
      setSchools(rows);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Couldn't load schools.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  function openAdd() {
    setSaveError(null);
    setEditing(null);
    setModalOpen(true);
  }
  function openEdit(row) {
    setSaveError(null);
    setEditing(row);
    setModalOpen(true);
  }

  async function handleSave(values) {
    setSaveError(null);
    try {
      if (editing) {
        await updateSchool(editing.id, values.name);
      } else {
        await createSchool(values.name);
      }
      setModalOpen(false);
      setEditing(null);
      load();
    } catch (err) {
      setSaveError(err instanceof ApiError ? err.message : "Couldn't save that school.");
    }
  }

  async function handleDeleteConfirmed() {
    setDeleteError(null);
    try {
      await deleteSchool(pendingDelete.id);
      setPendingDelete(null);
      load();
    } catch (err) {
      setDeleteError(err instanceof ApiError ? err.message : "Couldn't delete that school.");
    }
  }

  const totalStudents = schools.reduce((sum, s) => sum + Number(s.studentCount || 0), 0);
  const totalTeachers = schools.reduce((sum, s) => sum + Number(s.teacherCount || 0), 0);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-2xl font-bold text-ink-primary">Schools</h2>
        <p className="mt-1 text-sm text-ink-muted">
          Every school on file, backed by the real database - the same list the Teacher Portal's school scoping
          (Section 4) uses.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-3">
        <StatCard icon={Landmark} label="Schools" value={schools.length} accent="purple" />
        <StatCard icon={GraduationCap} label="Students" value={totalStudents} accent="cyan" />
        <StatCard icon={Users} label="Teachers" value={totalTeachers} accent="gold" />
      </div>

      {loading ? (
        <p className="text-sm text-ink-faint">Loading schools…</p>
      ) : error ? (
        <div className="rounded-2xl border border-red-500/30 bg-red-500/5 p-6 text-center">
          <p className="text-sm text-red-400">{error}</p>
          <button
            type="button"
            onClick={load}
            className="mt-3 rounded-lg border border-panel-line px-4 py-2 font-display text-xs font-semibold text-ink-muted hover:text-ink-primary"
          >
            Retry
          </button>
        </div>
      ) : (
        <DataTable
          title="Schools"
          description="Add, rename, or remove schools. A school with students/teachers still assigned can't be deleted."
          columns={columns}
          rows={schools}
          searchKeys={["id", "name"]}
          onAdd={openAdd}
          onEdit={openEdit}
          onDelete={setPendingDelete}
          addLabel="Add School"
        />
      )}

      <FormModal
        open={modalOpen}
        title={editing ? "Edit School" : "Add School"}
        fields={fields}
        initial={editing}
        onSave={handleSave}
        onClose={() => {
          setModalOpen(false);
          setEditing(null);
          setSaveError(null);
        }}
      />
      {modalOpen && saveError && (
        <p className="fixed bottom-6 left-1/2 z-[65] -translate-x-1/2 rounded-lg border border-red-500/30 bg-panel px-4 py-2 text-sm text-red-400 shadow-xl">
          {saveError}
        </p>
      )}

      <ConfirmDialog
        open={!!pendingDelete}
        title={`Delete ${pendingDelete?.name ?? "school"}?`}
        message={deleteError || "This action can't be undone. Schools with students or teachers still assigned can't be deleted."}
        onConfirm={handleDeleteConfirmed}
        onCancel={() => {
          setPendingDelete(null);
          setDeleteError(null);
        }}
      />
    </div>
  );
}
