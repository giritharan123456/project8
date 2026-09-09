import { useCallback, useEffect, useMemo, useState } from "react";
import { ShieldCheck } from "lucide-react";
import DataTable from "../components/DataTable.jsx";
import FormModal from "../components/FormModal.jsx";
import ConfirmDialog from "../components/ConfirmDialog.jsx";
import { getAdminUsers, createAdminUser, updateAdminUser, deleteAdminUser } from "../api.js";
import { ApiError } from "../../api/client.js";
import { useAdminData } from "../AdminContext.jsx";

const ROLE_OPTIONS = ["Super Admin", "Admin", "Support"];
const PERMISSION_OPTIONS = ["Content", "People", "Reports", "Settings"];

const ROLE_TONE = {
  "Super Admin": "bg-arcane-purple/15 text-arcane-purple border-arcane-purple/30",
  Admin: "bg-neon-cyan/15 text-neon-cyan border-neon-cyan/30",
  Support: "bg-ink-faint/15 text-ink-muted border-panel-line",
};

function RoleBadge({ role }) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-wider ${
        ROLE_TONE[role] ?? ROLE_TONE.Support
      }`}
    >
      <ShieldCheck className="h-3 w-3" strokeWidth={2.2} />
      {role}
    </span>
  );
}

const columns = [
  { key: "id", label: "ID" },
  { key: "name", label: "Name" },
  { key: "email", label: "Email" },
  { key: "role", label: "Role", render: (row) => <RoleBadge role={row.role} /> },
  {
    key: "permissions",
    label: "Permissions",
    render: (row) => <span className="text-ink-primary">{(row.permissions ?? []).join(", ") || "\u2014"}</span>,
  },
  { key: "lastLogin", label: "Last Login" },
  { key: "status", label: "Status", status: true },
];

const fields = [
  { key: "name", label: "Name", required: true },
  { key: "email", label: "Email", type: "email", required: true },
  { key: "role", label: "Role", type: "select", required: true, options: ROLE_OPTIONS },
  { key: "permissions", label: "Permissions", type: "multiselect", options: PERMISSION_OPTIONS },
  { key: "status", label: "Status", type: "select", required: true, options: ["active", "inactive", "suspended"] },
];

// Talks to the real backend (GET/POST/PATCH/DELETE /api/admin/admin-users,
// see ../api.js and the `admin_users` table in
// server/migrations/008_admin_console_users.sql) the same way
// SchoolsPage.jsx does. The backend route is live, so the initial load
// succeeds and every read/write goes straight to the API. The one-time
// fallback to AdminContext's localStorage store below only kicks in if
// that first load 404s/network-fails (e.g. pointed at an older server
// that hasn't run the migration yet) - it's never touched in normal
// operation.
export default function AdminUsersPage() {
  const localStore = useAdminData();

  const [usingBackend, setUsingBackend] = useState(null); // null = not yet determined
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [saveError, setSaveError] = useState(null);
  const [deleteError, setDeleteError] = useState(null);

  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [pendingDelete, setPendingDelete] = useState(null);

  const loadFromBackend = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const rows = await getAdminUsers();
      setUsers(rows);
      setUsingBackend(true);
    } catch (err) {
      // 404/network error -> backend route isn't implemented yet, fall back
      // silently. Any other failure (e.g. 401/403/500) is a real error and
      // stays on-screen instead of masking it as "using local data".
      const notImplemented = !(err instanceof ApiError) || err.status === 404 || err.status === 0;
      if (notImplemented) {
        setUsingBackend(false);
        setError(null);
      } else {
        setError(err instanceof ApiError ? err.message : "Couldn't load admin users.");
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadFromBackend();
  }, [loadFromBackend]);

  const rows = usingBackend ? users : localStore.data.adminUsers ?? [];

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
    if (usingBackend) {
      try {
        if (editing) {
          await updateAdminUser(editing.id, values);
        } else {
          await createAdminUser(values);
        }
        setModalOpen(false);
        setEditing(null);
        loadFromBackend();
      } catch (err) {
        setSaveError(err instanceof ApiError ? err.message : "Couldn't save that admin user.");
      }
      return;
    }
    if (editing) {
      localStore.updateItem("adminUsers", editing.id, values);
    } else {
      localStore.addItem("adminUsers", values);
    }
    setModalOpen(false);
    setEditing(null);
  }

  async function handleDeleteConfirmed() {
    setDeleteError(null);
    if (usingBackend) {
      try {
        await deleteAdminUser(pendingDelete.id);
        setPendingDelete(null);
        loadFromBackend();
      } catch (err) {
        setDeleteError(err instanceof ApiError ? err.message : "Couldn't delete that admin user.");
      }
      return;
    }
    localStore.deleteItem("adminUsers", pendingDelete.id);
    setPendingDelete(null);
  }

  const description = useMemo(
    () =>
      usingBackend
        ? "Console accounts with access to /admin, and what each one can manage."
        : "Console accounts with access to /admin, and what each one can manage. Backend route not connected yet \u2014 showing local sample data.",
    [usingBackend]
  );

  return (
    <div className="space-y-6">
      {loading ? (
        <p className="text-sm text-ink-faint">Loading admin users\u2026</p>
      ) : error ? (
        <div className="rounded-2xl border border-red-500/30 bg-red-500/5 p-6 text-center">
          <p className="text-sm text-red-400">{error}</p>
          <button
            type="button"
            onClick={loadFromBackend}
            className="mt-3 rounded-lg border border-panel-line px-4 py-2 font-display text-xs font-semibold text-ink-muted hover:text-ink-primary"
          >
            Retry
          </button>
        </div>
      ) : (
        <DataTable
          title="Admin Users"
          description={description}
          columns={columns}
          rows={rows}
          searchKeys={["id", "name", "email", "role"]}
          onAdd={openAdd}
          onEdit={openEdit}
          onDelete={setPendingDelete}
          addLabel="Add Admin User"
        />
      )}

      <FormModal
        open={modalOpen}
        title={editing ? "Edit Admin User" : "Add Admin User"}
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
        title={`Delete ${pendingDelete?.name ?? "admin user"}?`}
        message={deleteError || "This action can't be undone. The account will lose access to /admin immediately."}
        onConfirm={handleDeleteConfirmed}
        onCancel={() => {
          setPendingDelete(null);
          setDeleteError(null);
        }}
      />
    </div>
  );
}
