import { useState } from "react";
import DataTable from "../../admin/components/DataTable.jsx";
import FormModal from "../../admin/components/FormModal.jsx";
import ConfirmDialog from "../../admin/components/ConfirmDialog.jsx";
import { useTeacherData } from "../TeacherContext.jsx";

/**
 * A CRUD screen for one teacher-scoped resource (courses/lessons/questions/
 * assignments). `resource` is a key in TeacherContext's scoped `data` map --
 * the rows here are already filtered to what this teacher is assigned to,
 * so there's no way to see or edit another teacher's content.
 */
export default function ResourcePage({ resource, title, description, columns, fields, searchKeys, addLabel, renderRowActions, extra, readOnly = false, injectOnCreate }) {
  const { data, addItem, updateItem, deleteItem } = useTeacherData();
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
    if (editing) {
      updateItem(resource, editing.id, values);
    } else {
      addItem(resource, { ...values, ...(injectOnCreate ?? {}) });
    }
    setModalOpen(false);
    setEditing(null);
  }
  function handleDeleteConfirmed() {
    if (pendingDelete) deleteItem(resource, pendingDelete.id);
    setPendingDelete(null);
  }

  return (
    <>
      <DataTable
        title={title}
        description={description}
        columns={columns}
        rows={rows}
        searchKeys={searchKeys}
        onAdd={readOnly ? undefined : openAdd}
        onEdit={readOnly ? undefined : openEdit}
        onDelete={readOnly ? undefined : setPendingDelete}
        addLabel={addLabel}
        renderRowActions={renderRowActions}
      />
      {extra}
      {!readOnly && (
        <>
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
      )}
    </>
  );
}
