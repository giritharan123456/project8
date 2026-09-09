import { useState, useMemo, useCallback } from "react";
import {
  ChevronRight,
  ChevronDown,
  Plus,
  Pencil,
  Trash2,
  Search,
  Eye,
  GripVertical,
  BookOpen,
  FileText,
  Layers,
  Beaker,
  Lightbulb,
  Tag,
  GraduationCap,
  Globe2,
  Landmark,
  X,
} from "lucide-react";
import { useAdminData } from "../AdminContext.jsx";
import FormModal from "../components/FormModal.jsx";
import ConfirmDialog from "../components/ConfirmDialog.jsx";
import { COURSES, CHAPTERS, LESSONS, QUESTIONS } from "../mockData.js";

const TREE_ICONS = {
  curriculum: GraduationCap,
  course: BookOpen,
  chapter: FileText,
  lesson: Layers,
  question: Beaker,
};

const MOCK_CURRICULUM_TREE = [
  {
    id: "curr-1",
    name: "Chemistry",
    type: "curriculum",
    status: "published",
    children: COURSES.filter((c) => c.subject === "Chemistry").map((course) => ({
      id: course.id,
      name: course.name,
      type: "course",
      status: course.status,
      topic: course.topic,
      grade: course.grade,
      children: CHAPTERS.filter((ch) => ch.courseId === course.id).map((ch) => ({
        id: ch.id,
        name: ch.title,
        type: "chapter",
        status: ch.status,
        description: ch.description,
        children: LESSONS.filter((l) => l.chapterId === ch.id).map((l) => ({
          id: l.id,
          name: l.title,
          type: "lesson",
          status: l.status,
          description: l.description,
          board: l.board,
          children: QUESTIONS.filter((q) => q.lessonId === l.id).map((q) => ({
            id: q.id,
            name: q.questionText,
            type: "question",
            status: q.status,
            difficulty: q.difficulty,
            children: [],
          })),
        })),
      })),
    })),
  },
];

const ITEM_FIELDS = {
  course: [
    { key: "name", label: "Course Name", required: true },
    { key: "topic", label: "Topic", required: true },
    { key: "grade", label: "Grade", type: "select", required: true, options: ["4", "5", "6", "7", "8", "9", "10", "11", "12"] },
    { key: "status", label: "Status", type: "select", required: true, options: ["published", "draft"] },
  ],
  chapter: [
    { key: "name", label: "Chapter Title", required: true },
    { key: "description", label: "Description", type: "textarea" },
    { key: "status", label: "Status", type: "select", required: true, options: ["published", "draft"] },
  ],
  lesson: [
    { key: "name", label: "Lesson Title", required: true },
    { key: "description", label: "Description", type: "textarea" },
    { key: "board", label: "Board", type: "select", options: ["CBSE", "ICSE", "TN", "MH", "IB", "IGCSE"] },
    { key: "status", label: "Status", type: "select", required: true, options: ["published", "draft"] },
  ],
  question: [
    { key: "name", label: "Question Text", type: "textarea", required: true },
    { key: "difficulty", label: "Difficulty", type: "select", required: true, options: ["easy", "medium", "hard", "expert"] },
    { key: "status", label: "Status", type: "select", required: true, options: ["published", "draft"] },
  ],
};

function TreeNode({ node, depth = 0, expanded, onToggle, onAdd, onEdit, onDelete, onPreview }) {
  const hasChildren = node.children && node.children.length > 0;
  const isExpanded = expanded.has(node.id);
  const Icon = TREE_ICONS[node.type] || BookOpen;

  return (
    <div>
      <div
        className={`flex items-center gap-2 rounded-lg px-3 py-2 transition-colors hover:bg-panel-alt/40 ${
          depth > 0 ? "ml-4 border-l-2 border-panel-line" : ""
        }`}
        style={{ paddingLeft: `${depth * 20 + 12}px` }}
      >
        {hasChildren ? (
          <button type="button" onClick={() => onToggle(node.id)} className="flex-none text-ink-faint hover:text-ink-primary">
            {isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
          </button>
        ) : (
          <span className="h-4 w-4 flex-none" />
        )}

        <Icon className="h-4 w-4 flex-none text-arcane-purple" />
        <span className="flex-1 truncate font-display text-sm font-semibold text-ink-primary">{node.name}</span>

        <span className={`inline-flex items-center rounded-full border px-2 py-0.5 font-mono text-[9px] uppercase ${
          node.status === "published" ? "border-neon-green/30 bg-neon-green/10 text-neon-green" : "border-reward-gold/30 bg-reward-gold/10 text-reward-gold"
        }`}>
          {node.status}
        </span>

        {node.difficulty && (
          <span className="rounded-full border border-panel-line px-2 py-0.5 font-mono text-[9px] text-ink-faint">
            {node.difficulty}
          </span>
        )}

        <div className="flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100"
          onMouseEnter={(e) => e.currentTarget.style.opacity = 1}
          onMouseLeave={(e) => e.currentTarget.style.opacity = 0}
          style={{ opacity: 1 }}
        >
          {node.type !== "curriculum" && (
            <>
              <button type="button" onClick={() => onPreview(node)} className="flex h-6 w-6 items-center justify-center rounded text-ink-faint hover:bg-neon-cyan/10 hover:text-neon-cyan">
                <Eye className="h-3.5 w-3.5" />
              </button>
              <button type="button" onClick={() => onEdit(node)} className="flex h-6 w-6 items-center justify-center rounded text-ink-faint hover:bg-neon-cyan/10 hover:text-neon-cyan">
                <Pencil className="h-3.5 w-3.5" />
              </button>
              <button type="button" onClick={() => onDelete(node)} className="flex h-6 w-6 items-center justify-center rounded text-ink-faint hover:bg-red-500/10 hover:text-red-400">
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </>
          )}
          {node.type !== "question" && node.type !== "curriculum" && (
            <button type="button" onClick={() => onAdd(node)} className="flex h-6 w-6 items-center justify-center rounded text-ink-faint hover:bg-neon-green/10 hover:text-neon-green">
              <Plus className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
      </div>

      {isExpanded && hasChildren && (
        <div>
          {node.children.map((child) => (
            <TreeNode
              key={child.id}
              node={child}
              depth={depth + 1}
              expanded={expanded}
              onToggle={onToggle}
              onAdd={onAdd}
              onEdit={onEdit}
              onDelete={onDelete}
              onPreview={onPreview}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default function CurriculumTreePage() {
  const { addItem, updateItem, deleteItem } = useAdminData();
  const [expanded, setExpanded] = useState(new Set(["curr-1", "atom-valley"]));
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [addParent, setAddParent] = useState(null);
  const [pendingDelete, setPendingDelete] = useState(null);
  const [previewNode, setPreviewNode] = useState(null);

  const toggle = useCallback((id) => {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const handleAdd = useCallback((parent) => {
    setAddParent(parent);
    setEditing(null);
    setModalOpen(true);
  }, []);

  const handleEdit = useCallback((node) => {
    setEditing(node);
    setAddParent(null);
    setModalOpen(true);
  }, []);

  const handleSave = useCallback((values) => {
    setModalOpen(false);
    setEditing(null);
    setAddParent(null);
  }, []);

  const handleDeleteConfirmed = useCallback(() => {
    setPendingDelete(null);
  }, []);

  const filteredTree = useMemo(() => {
    if (!search.trim()) return MOCK_CURRICULUM_TREE;
    const q = search.toLowerCase();
    function filterNode(node) {
      if (node.name.toLowerCase().includes(q)) return node;
      if (node.children) {
        const filtered = node.children.map(filterNode).filter(Boolean);
        if (filtered.length > 0) return { ...node, children: filtered };
      }
      return null;
    }
    return MOCK_CURRICULUM_TREE.map(filterNode).filter(Boolean);
  }, [search]);

  const nodeType = addParent ? addParent.type : editing?.type;
  const childType =
    nodeType === "curriculum" ? "course" :
    nodeType === "course" ? "chapter" :
    nodeType === "chapter" ? "lesson" :
    nodeType === "lesson" ? "question" : null;

  const formFields = childType ? ITEM_FIELDS[childType] : editing ? ITEM_FIELDS[editing.type] : [];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-2xl font-bold text-ink-primary">Curriculum Tree</h2>
        <p className="mt-1 text-sm text-ink-muted">Visual hierarchy: Curriculum \u2192 Course \u2192 Chapter \u2192 Lesson \u2192 Question</p>
      </div>

      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-faint" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search curriculum..."
            className="w-full rounded-lg border border-panel-line bg-void py-2 pl-9 pr-3 text-sm text-ink-primary outline-none focus:border-neon-cyan"
          />
        </div>
      </div>

      <div className="rounded-2xl border border-panel-line bg-panel/60 p-4">
        <div className="divide-y divide-panel-line">
          {filteredTree.length === 0 && (
            <p className="py-8 text-center text-sm text-ink-faint">No matching curriculum items found.</p>
          )}
          {filteredTree.map((node) => (
            <TreeNode
              key={node.id}
              node={node}
              expanded={expanded}
              onToggle={toggle}
              onAdd={handleAdd}
              onEdit={handleEdit}
              onDelete={setPendingDelete}
              onPreview={setPreviewNode}
            />
          ))}
        </div>
      </div>

      {previewNode && (
        <div className="fixed inset-0 z-[60] flex items-start justify-center overflow-y-auto bg-void/80 backdrop-blur-sm p-4 py-10">
          <div className="w-full max-w-lg rounded-2xl border border-panel-line bg-panel shadow-xl">
            <div className="flex items-center justify-between border-b border-panel-line px-5 py-4">
              <h3 className="font-display text-lg font-bold text-ink-primary">{previewNode.name}</h3>
              <button type="button" onClick={() => setPreviewNode(null)} className="flex h-8 w-8 items-center justify-center rounded-lg text-ink-faint hover:bg-panel-alt hover:text-ink-primary">
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="p-5 space-y-3">
              <div className="flex items-center gap-2">
                <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 font-mono text-[10px] uppercase ${
                  previewNode.status === "published" ? "border-neon-green/30 bg-neon-green/10 text-neon-green" : "border-reward-gold/30 bg-reward-gold/10 text-reward-gold"
                }`}>
                  {previewNode.status}
                </span>
                <span className="font-mono text-[10px] uppercase text-ink-faint">{previewNode.type}</span>
              </div>
              {previewNode.description && <p className="text-sm text-ink-muted">{previewNode.description}</p>}
              {previewNode.topic && <p className="text-sm text-ink-muted">Topic: {previewNode.topic}</p>}
              {previewNode.grade && <p className="text-sm text-ink-muted">Grade: {previewNode.grade}</p>}
              {previewNode.board && <p className="text-sm text-ink-muted">Board: {previewNode.board}</p>}
              {previewNode.difficulty && <p className="text-sm text-ink-muted">Difficulty: {previewNode.difficulty}</p>}
              {previewNode.children && (
                <p className="text-sm text-ink-muted">{previewNode.children.length} child items</p>
              )}
            </div>
          </div>
        </div>
      )}

      <FormModal
        open={modalOpen}
        title={editing ? `Edit ${editing.type}` : `Add ${childType}`}
        fields={formFields}
        initial={editing}
        onSave={handleSave}
        onClose={() => { setModalOpen(false); setEditing(null); setAddParent(null); }}
      />

      <ConfirmDialog
        open={!!pendingDelete}
        title={`Delete "${pendingDelete?.name}"?`}
        message="This will remove this item and all its children. This action can't be undone."
        onConfirm={handleDeleteConfirmed}
        onCancel={() => setPendingDelete(null)}
      />
    </div>
  );
}
