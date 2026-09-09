import { useState, useCallback } from "react";
import {
  Bot,
  FileText,
  CheckCircle,
  XCircle,
  BarChart3,
  Settings,
  Sparkles,
  Clock,
  Zap,
  RefreshCw,
  Eye,
  ThumbsUp,
  ThumbsDown,
  Loader,
  AlertTriangle,
  Coins,
} from "lucide-react";
import StatCard from "../components/StatCard.jsx";
import StatusPill from "../components/StatusPill.jsx";

const MOCK_AI_USAGE = {
  totalTokens: 284500,
  contentGenerated: 47,
  approvalRate: 78,
  avgGenerationTime: 12,
  modelsUsed: [
    { name: "GPT-4o", tokens: 180000, requests: 30 },
    { name: "Claude 3.5", tokens: 104500, requests: 17 },
  ],
};

const MOCK_QUIZ_QUEUE = [
  { id: "AIQ-001", type: "quiz", topic: "Chemical Bonding Basics", generatedAt: "2026-09-08T10:30:00Z", questionCount: 12, difficulty: "medium", status: "pending", createdBy: "AI Generator" },
  { id: "AIQ-002", type: "question", topic: "Electron Configuration", generatedAt: "2026-09-08T09:15:00Z", questionCount: 8, difficulty: "hard", status: "pending", createdBy: "AI Generator" },
  { id: "AIQ-003", type: "quiz", topic: "Acids and Bases Review", generatedAt: "2026-09-07T16:00:00Z", questionCount: 15, difficulty: "easy", status: "approved", reviewedBy: "Ananya Rao" },
  { id: "AIQ-004", type: "question", topic: "Molecular Formulas", generatedAt: "2026-09-07T14:30:00Z", questionCount: 10, difficulty: "medium", status: "approved", reviewedBy: "Vikram Nair" },
  { id: "AIQ-005", type: "quiz", topic: "Reaction Rates Advanced", generatedAt: "2026-09-07T11:00:00Z", questionCount: 20, difficulty: "expert", status: "rejected", reviewedBy: "Ananya Rao", rejectionReason: "Questions too similar to existing content" },
  { id: "AIQ-006", type: "question", topic: "Isotopes and Mass Number", generatedAt: "2026-09-06T15:45:00Z", questionCount: 6, difficulty: "medium", status: "approved", reviewedBy: "Sara Thomas" },
];

const MOCK_AI_SETTINGS = {
  model: "GPT-4o",
  defaultDifficulty: "medium",
  questionTypes: ["mcq", "fill_blank", "true_false"],
  maxQuestionsPerGeneration: 20,
  requireApproval: true,
  contentGuidelines: "Focus on NCERT-aligned chemistry concepts. Use clear, concise language appropriate for the target grade level.",
};

export default function AIManagementPage() {
  const [activeTab, setActiveTab] = useState("queue");
  const [quizTopic, setQuizTopic] = useState("");
  const [quizDifficulty, setQuizDifficulty] = useState("medium");
  const [quizCount, setQuizCount] = useState(10);
  const [generating, setGenerating] = useState(false);
  const [questionTopic, setQuestionTopic] = useState("");
  const [questionCount, setQuestionCount] = useState(5);
  const [generatingQuestions, setGeneratingQuestions] = useState(false);
  const [settings, setSettings] = useState(MOCK_AI_SETTINGS);

  const handleGenerateQuiz = useCallback(() => {
    if (!quizTopic.trim()) return;
    setGenerating(true);
    setTimeout(() => {
      setGenerating(false);
      setQuizTopic("");
    }, 2000);
  }, [quizTopic]);

  const handleGenerateQuestions = useCallback(() => {
    if (!questionTopic.trim()) return;
    setGeneratingQuestions(true);
    setTimeout(() => {
      setGeneratingQuestions(false);
      setQuestionTopic("");
    }, 1500);
  }, [questionTopic]);

  const pendingCount = MOCK_QUIZ_QUEUE.filter((q) => q.status === "pending").length;
  const approvedCount = MOCK_QUIZ_QUEUE.filter((q) => q.status === "approved").length;
  const rejectedCount = MOCK_QUIZ_QUEUE.filter((q) => q.status === "rejected").length;

  const tabs = [
    { id: "queue", label: "Content Queue", icon: FileText },
    { id: "generate", label: "Generate", icon: Sparkles },
    { id: "stats", label: "Usage Stats", icon: BarChart3 },
    { id: "settings", label: "Settings", icon: Settings },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-2xl font-bold text-ink-primary">AI Management</h2>
        <p className="mt-1 text-sm text-ink-muted">Generate, review, and manage AI-powered quiz and question content.</p>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard icon={FileText} label="Content Generated" value={MOCK_AI_USAGE.contentGenerated} accent="purple" />
        <StatCard icon={Clock} label="Pending Review" value={pendingCount} accent="gold" />
        <StatCard icon={CheckCircle} label="Approved" value={approvedCount} accent="green" />
        <StatCard icon={Zap} label="Approval Rate" value={`${MOCK_AI_USAGE.approvalRate}%`} accent="cyan" />
      </div>

      <div className="flex gap-1 rounded-xl border border-panel-line bg-panel/40 p-1">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            className={`flex flex-1 items-center justify-center gap-2 rounded-lg px-3 py-2 font-display text-sm font-semibold transition-colors ${
              activeTab === tab.id
                ? "bg-arcane-purple text-white shadow-glow-purple"
                : "text-ink-muted hover:text-ink-primary"
            }`}
          >
            <tab.icon className="h-4 w-4" />
            <span className="hidden sm:inline">{tab.label}</span>
          </button>
        ))}
      </div>

      {activeTab === "queue" && (
        <div className="rounded-2xl border border-panel-line bg-panel/60">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-panel-line text-[11px] uppercase tracking-widest text-ink-faint">
                  <th className="px-4 py-3 font-mono font-medium">ID</th>
                  <th className="px-4 py-3 font-mono font-medium">Type</th>
                  <th className="px-4 py-3 font-mono font-medium">Topic</th>
                  <th className="px-4 py-3 font-mono font-medium">Questions</th>
                  <th className="px-4 py-3 font-mono font-medium">Difficulty</th>
                  <th className="px-4 py-3 font-mono font-medium">Generated</th>
                  <th className="px-4 py-3 font-mono font-medium">Status</th>
                  <th className="px-4 py-3 font-mono font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {MOCK_QUIZ_QUEUE.map((item) => (
                  <tr key={item.id} className="border-b border-panel-line/60 text-ink-muted transition-colors hover:bg-panel-alt/40">
                    <td className="whitespace-nowrap px-4 py-3 font-mono text-xs text-ink-primary">{item.id}</td>
                    <td className="whitespace-nowrap px-4 py-3">
                      <StatusPill value={item.type} />
                    </td>
                    <td className="px-4 py-3 text-xs text-ink-primary">{item.topic}</td>
                    <td className="whitespace-nowrap px-4 py-3 font-mono text-xs">{item.questionCount}</td>
                    <td className="whitespace-nowrap px-4 py-3">
                      <StatusPill value={item.difficulty} />
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 font-mono text-xs text-ink-faint">
                      {new Date(item.generatedAt).toLocaleDateString()}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3">
                      <StatusPill value={item.status} />
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-right">
                      {item.status === "pending" && (
                        <div className="flex justify-end gap-1.5">
                          <button type="button" className="flex h-7 w-7 items-center justify-center rounded-lg text-ink-faint transition-colors hover:bg-neon-green/10 hover:text-neon-green" title="Approve">
                            <ThumbsUp className="h-3.5 w-3.5" />
                          </button>
                          <button type="button" className="flex h-7 w-7 items-center justify-center rounded-lg text-ink-faint transition-colors hover:bg-red-500/10 hover:text-red-400" title="Reject">
                            <ThumbsDown className="h-3.5 w-3.5" />
                          </button>
                          <button type="button" className="flex h-7 w-7 items-center justify-center rounded-lg text-ink-faint transition-colors hover:bg-neon-cyan/10 hover:text-neon-cyan" title="Preview">
                            <Eye className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      )}
                      {item.status === "rejected" && (
                        <span className="text-[10px] text-red-400">{item.rejectionReason}</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === "generate" && (
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-2xl border border-panel-line bg-panel/60 p-5">
            <h3 className="flex items-center gap-2 font-display text-base font-bold text-ink-primary">
              <Sparkles className="h-4 w-4 text-arcane-purple" />
              AI Quiz Generator
            </h3>
            <p className="mt-1 text-xs text-ink-muted">Generate a complete quiz from a topic description.</p>
            <div className="mt-4 space-y-4">
              <div>
                <label className="mb-1.5 block font-mono text-[11px] uppercase tracking-widest text-ink-faint">Topic</label>
                <textarea
                  value={quizTopic}
                  onChange={(e) => setQuizTopic(e.target.value)}
                  placeholder="e.g., Ionic bonding in group 1 and group 17 elements..."
                  rows={3}
                  className="w-full resize-none rounded-lg border border-panel-line bg-void px-3 py-2 text-sm text-ink-primary outline-none focus:border-neon-cyan"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1.5 block font-mono text-[11px] uppercase tracking-widest text-ink-faint">Difficulty</label>
                  <select
                    value={quizDifficulty}
                    onChange={(e) => setQuizDifficulty(e.target.value)}
                    className="w-full rounded-lg border border-panel-line bg-void px-3 py-2 text-sm text-ink-primary outline-none focus:border-neon-cyan"
                  >
                    {["easy", "medium", "hard", "expert"].map((d) => (
                      <option key={d} value={d}>{d.charAt(0).toUpperCase() + d.slice(1)}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="mb-1.5 block font-mono text-[11px] uppercase tracking-widest text-ink-faint">Questions</label>
                  <input
                    type="number"
                    value={quizCount}
                    onChange={(e) => setQuizCount(e.target.valueAsNumber || 10)}
                    min={1}
                    max={50}
                    className="w-full rounded-lg border border-panel-line bg-void px-3 py-2 text-sm text-ink-primary outline-none focus:border-neon-cyan"
                  />
                </div>
              </div>
              <button
                type="button"
                onClick={handleGenerateQuiz}
                disabled={!quizTopic.trim() || generating}
                className="w-full flex items-center justify-center gap-2 rounded-lg bg-arcane-purple px-4 py-2.5 font-display text-sm font-semibold text-white shadow-glow-purple transition-colors hover:bg-arcane-violet disabled:cursor-not-allowed disabled:opacity-40"
              >
                {generating ? (
                  <>
                    <Loader className="h-4 w-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4" />
                    Generate Quiz
                  </>
                )}
              </button>
            </div>
          </div>

          <div className="rounded-2xl border border-panel-line bg-panel/60 p-5">
            <h3 className="flex items-center gap-2 font-display text-base font-bold text-ink-primary">
              <FileText className="h-4 w-4 text-neon-cyan" />
              AI Question Generator
            </h3>
            <p className="mt-1 text-xs text-ink-muted">Generate individual questions from content snippets.</p>
            <div className="mt-4 space-y-4">
              <div>
                <label className="mb-1.5 block font-mono text-[11px] uppercase tracking-widest text-ink-faint">Content / Topic</label>
                <textarea
                  value={questionTopic}
                  onChange={(e) => setQuestionTopic(e.target.value)}
                  placeholder="Paste content or describe the topic for question generation..."
                  rows={3}
                  className="w-full resize-none rounded-lg border border-panel-line bg-void px-3 py-2 text-sm text-ink-primary outline-none focus:border-neon-cyan"
                />
              </div>
              <div>
                <label className="mb-1.5 block font-mono text-[11px] uppercase tracking-widest text-ink-faint">Number of Questions</label>
                <input
                  type="number"
                  value={questionCount}
                  onChange={(e) => setQuestionCount(e.target.valueAsNumber || 5)}
                  min={1}
                  max={30}
                  className="w-full rounded-lg border border-panel-line bg-void px-3 py-2 text-sm text-ink-primary outline-none focus:border-neon-cyan"
                />
              </div>
              <button
                type="button"
                onClick={handleGenerateQuestions}
                disabled={!questionTopic.trim() || generatingQuestions}
                className="w-full flex items-center justify-center gap-2 rounded-lg bg-neon-cyan/20 border border-neon-cyan/40 px-4 py-2.5 font-display text-sm font-semibold text-neon-cyan transition-colors hover:bg-neon-cyan/30 disabled:cursor-not-allowed disabled:opacity-40"
              >
                {generatingQuestions ? (
                  <>
                    <Loader className="h-4 w-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Zap className="h-4 w-4" />
                    Generate Questions
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {activeTab === "stats" && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            <StatCard icon={Zap} label="Total Tokens" value={`${(MOCK_AI_USAGE.totalTokens / 1000).toFixed(1)}K`} accent="purple" />
            <StatCard icon={FileText} label="Content Generated" value={MOCK_AI_USAGE.contentGenerated} accent="cyan" />
            <StatCard icon={CheckCircle} label="Approval Rate" value={`${MOCK_AI_USAGE.approvalRate}%`} accent="green" />
            <StatCard icon={Clock} label="Avg. Gen Time" value={`${MOCK_AI_USAGE.avgGenerationTime}s`} accent="gold" />
          </div>

          <div className="rounded-2xl border border-panel-line bg-panel/60 p-5">
            <h3 className="font-display text-base font-bold text-ink-primary">Model Usage Breakdown</h3>
            <div className="mt-4 space-y-3">
              {MOCK_AI_USAGE.modelsUsed.map((model) => (
                <div key={model.name} className="flex items-center gap-4">
                  <span className="w-24 flex-none font-display text-sm font-semibold text-ink-primary">{model.name}</span>
                  <div className="h-3 flex-1 overflow-hidden rounded-full bg-panel-line">
                    <div
                      className="h-full rounded-full bg-arcane-purple"
                      style={{ width: `${(model.tokens / MOCK_AI_USAGE.totalTokens) * 100}%` }}
                    />
                  </div>
                  <span className="w-20 flex-none text-right font-mono text-xs text-ink-faint">
                    {(model.tokens / 1000).toFixed(1)}K tokens
                  </span>
                  <span className="w-16 flex-none text-right font-mono text-xs text-ink-faint">
                    {model.requests} calls
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-panel-line bg-panel/60 p-5">
            <h3 className="font-display text-base font-bold text-ink-primary">Content Generation Log</h3>
            <div className="mt-3 divide-y divide-panel-line">
              {MOCK_QUIZ_QUEUE.map((item) => (
                <div key={item.id} className="flex items-center gap-3 py-2.5">
                  <StatusPill value={item.status} />
                  <span className="flex-1 text-sm text-ink-primary">{item.topic}</span>
                  <span className="font-mono text-[10px] text-ink-faint">{item.questionCount} Qs</span>
                  <span className="font-mono text-xs text-ink-faint">{new Date(item.generatedAt).toLocaleDateString()}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === "settings" && (
        <div className="rounded-2xl border border-panel-line bg-panel/60 p-5">
          <h3 className="flex items-center gap-2 font-display text-base font-bold text-ink-primary">
            <Settings className="h-4 w-4 text-arcane-purple" />
            AI Configuration
          </h3>
          <div className="mt-5 space-y-5">
            <div>
              <label className="mb-1.5 block font-mono text-[11px] uppercase tracking-widest text-ink-faint">Default Model</label>
              <select
                value={settings.model}
                onChange={(e) => setSettings((s) => ({ ...s, model: e.target.value }))}
                className="w-full rounded-lg border border-panel-line bg-void px-3 py-2 text-sm text-ink-primary outline-none focus:border-neon-cyan"
              >
                <option>GPT-4o</option>
                <option>Claude 3.5 Sonnet</option>
                <option>Gemini Pro</option>
              </select>
            </div>
            <div>
              <label className="mb-1.5 block font-mono text-[11px] uppercase tracking-widest text-ink-faint">Default Difficulty</label>
              <select
                value={settings.defaultDifficulty}
                onChange={(e) => setSettings((s) => ({ ...s, defaultDifficulty: e.target.value }))}
                className="w-full rounded-lg border border-panel-line bg-void px-3 py-2 text-sm text-ink-primary outline-none focus:border-neon-cyan"
              >
                {["easy", "medium", "hard", "expert"].map((d) => (
                  <option key={d} value={d}>{d.charAt(0).toUpperCase() + d.slice(1)}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1.5 block font-mono text-[11px] uppercase tracking-widest text-ink-faint">Max Questions per Generation</label>
              <input
                type="number"
                value={settings.maxQuestionsPerGeneration}
                onChange={(e) => setSettings((s) => ({ ...s, maxQuestionsPerGeneration: e.target.valueAsNumber || 20 }))}
                min={1}
                max={50}
                className="w-full rounded-lg border border-panel-line bg-void px-3 py-2 text-sm text-ink-primary outline-none focus:border-neon-cyan"
              />
            </div>
            <div>
              <label className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={settings.requireApproval}
                  onChange={(e) => setSettings((s) => ({ ...s, requireApproval: e.target.checked }))}
                  className="h-4 w-4 rounded border-panel-line accent-arcane-purple"
                />
                <span className="text-sm text-ink-primary">Require admin approval before publishing AI content</span>
              </label>
            </div>
            <div>
              <label className="mb-1.5 block font-mono text-[11px] uppercase tracking-widest text-ink-faint">Content Guidelines</label>
              <textarea
                value={settings.contentGuidelines}
                onChange={(e) => setSettings((s) => ({ ...s, contentGuidelines: e.target.value }))}
                rows={4}
                className="w-full resize-none rounded-lg border border-panel-line bg-void px-3 py-2 text-sm text-ink-primary outline-none focus:border-neon-cyan"
              />
            </div>
            <button
              type="button"
              className="rounded-lg bg-arcane-purple px-4 py-2 font-display text-sm font-semibold text-white shadow-glow-purple transition-colors hover:bg-arcane-violet"
            >
              Save Settings
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
