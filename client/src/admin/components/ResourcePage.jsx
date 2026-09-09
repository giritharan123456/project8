import { useState } from "react";
import DataTable from "./DataTable.jsx";
import FormModal from "./FormModal.jsx";
import ConfirmDialog from "./ConfirmDialog.jsx";
import { useAdminData } from "../AdminContext.jsx";

/**
 * A fully wired CRUD screen for one admin resource.
 * `resource` is the key in AdminContext's data map (e.g. "students").
 * `columns`/`fields` describe the table and the add/edit form respectively.
 */
export default function ResourcePage({ resource, title, description, columns, fields, searchKeys, addLabel, renderRowActions, extra }) {
  const { data, addItem, updateItem, deleteItem } = useAdminData();
  const rows = data[resource] ?? [];

  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [pendingDelete, setPendingDelete] = useState(null);

  function openAdd() {
    setEditing(null);
    setModalOpen(true);
  }
  function openEdit(row) {
    setEditing(row);
    setModalOpen(true);
  }
  function handleSave(values) {
    const result = editing ? updateItem(resource, editing.id, values) : addItem(resource, values);
    setModalOpen(false);
    setEditing(null);
    result?.catch?.((err) => window.alert(err?.body?.message || err?.message || "Something went wrong saving that."));
  }
  function handleDeleteConfirmed() {
    const result = pendingDelete ? deleteItem(resource, pendingDelete.id) : undefined;
    setPendingDelete(null);
    result?.catch?.((err) => window.alert(err?.body?.message || err?.message || "Something went wrong deleting that."));
  }

  return (
    <>
      <DataTable
        title={title}
        description={description}
        columns={columns}
        rows={rows}
        searchKeys={searchKeys}
        onAdd={openAdd}
        onEdit={openEdit}
        onDelete={setPendingDelete}
        addLabel={addLabel}
        renderRowActions={renderRowActions}
      />
      {extra}
      <FormModal
        open={modalOpen}
        title={editing ? `Edit ${title.replace(/s$/, "")}` : `Add ${title.replace(/s$/, "")}`}
        fields={fields}
        initial={editing}
        onSave={handleSave}
        onClose={() => {
          setModalOpen(false);
          setEditing(null);
        }}
      />
      <ConfirmDialog
        open={!!pendingDelete}
        title={`Delete ${pendingDelete?.name ?? pendingDelete?.title ?? pendingDelete?.id ?? "item"}?`}
        message="This action can't be undone. The record will be permanently removed."
        onConfirm={handleDeleteConfirmed}
        onCancel={() => setPendingDelete(null)}
      />
    </>
  );
}
