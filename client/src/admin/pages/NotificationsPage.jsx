import { useState, useMemo } from "react";
import {
  Bell,
  Send,
  Clock,
  Users,
  GraduationCap,
  School,
  CheckCircle,
  Eye,
  Filter,
  Plus,
  Calendar,
  Search,
  Trash2,
  X,
} from "lucide-react";
import StatCard from "../components/StatCard.jsx";
import StatusPill from "../components/StatusPill.jsx";

const MOCK_TEMPLATES = [
  { id: "tmpl-1", name: "General Announcement", subject: "Important Update", body: "Dear students, we have an important update regarding your upcoming assessments.", category: "general" },
  { id: "tmpl-2", name: "Assignment Reminder", subject: "Assignment Due Soon", body: "This is a reminder that your assignment is due soon. Please make sure to submit on time.", category: "assignment" },
  { id: "tmpl-3", name: "Quiz Scheduled", subject: "Quiz Coming Up", body: "A new quiz has been scheduled. Please review the relevant chapters before attempting.", category: "quiz" },
  { id: "tmpl-4", name: "Welcome New Students", subject: "Welcome to LearnQuest!", body: "Welcome to LearnQuest! We're excited to have you on board. Start your learning journey today.", category: "onboarding" },
  { id: "tmpl-5", name: "Performance Update", subject: "Your Progress Report", body: "Your latest performance report is ready. Check your dashboard for detailed analytics.", category: "performance" },
];

const MOCK_NOTIFICATIONS = [
  { id: "NTF-001", subject: "Mid-term Exam Schedule Released", recipients: "All Students", recipientCount: 156, sentAt: "2026-09-08T10:00:00Z", readCount: 89, readRate: 57, status: "sent", scheduled: false },
  { id: "NTF-002", subject: "New Chemistry Quiz Available", recipients: "Grade 10 CBSE", recipientCount: 32, sentAt: "2026-09-07T14:00:00Z", readCount: 28, readRate: 88, status: "sent", scheduled: false },
  { id: "NTF-003", subject: "Parent-Teacher Meeting Reminder", recipients: "All Students", recipientCount: 156, sentAt: null, readCount: 0, readRate: 0, status: "scheduled", scheduled: true, scheduledFor: "2026-09-12T09:00:00Z" },
  { id: "NTF-004", subject: "Welcome to New Semester", recipients: "Grade 9", recipientCount: 48, sentAt: "2026-09-01T08:00:00Z", readCount: 42, readRate: 88, status: "sent", scheduled: false },
  { id: "NTF-005", subject: "Live Game Tomorrow!", recipients: "Specific Students", recipientCount: 24, sentAt: "2026-09-06T16:00:00Z", readCount: 20, readRate: 83, status: "sent", scheduled: false },
  { id: "NTF-006", subject: "Assignment Deadline Extended", recipients: "Grade 11 MH", recipientCount: 28, sentAt: null, readCount: 0, readRate: 0, status: "draft", scheduled: false },
];

const SEND_TO_OPTIONS = [
  { value: "all", label: "All Students", icon: Users },
  { value: "school", label: "Specific School", icon: School },
  { value: "class", label: "Specific Class", icon: GraduationCap },
  { value: "students", label: "Specific Students", icon: Users },
];

export default function NotificationsPage() {
  const [activeTab, setActiveTab] = useState("history");
  const [composeTo, setComposeTo] = useState("all");
  const [composeSubject, setComposeSubject] = useState("");
  const [composeBody, setComposeBody] = useState("");
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [scheduleDate, setScheduleDate] = useState("");
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  const totalSent = MOCK_NOTIFICATIONS.filter((n) => n.status === "sent").length;
  const totalReadRate = Math.round(
    MOCK_NOTIFICATIONS.filter((n) => n.status === "sent").reduce((s, n) => s + n.readRate, 0) /
    Math.max(1, MOCK_NOTIFICATIONS.filter((n) => n.status === "sent").length)
  );
  const totalRecipients = MOCK_NOTIFICATIONS.reduce((s, n) => s + n.recipientCount, 0);
  const totalReads = MOCK_NOTIFICATIONS.reduce((s, n) => s + n.readCount, 0);

  const filteredNotifications = useMemo(() => {
    return MOCK_NOTIFICATIONS.filter((n) => {
      if (filterStatus !== "all" && n.status !== filterStatus) return false;
      if (search.trim()) {
        const q = search.toLowerCase();
        if (!n.subject.toLowerCase().includes(q) && !n.recipients.toLowerCase().includes(q)) return false;
      }
      return true;
    });
  }, [filterStatus, search]);

  function applyTemplate(tmpl) {
    setSelectedTemplate(tmpl);
    setComposeSubject(tmpl.subject);
    setComposeBody(tmpl.body);
  }

  function handleSend() {
    setComposeTo("all");
    setComposeSubject("");
    setComposeBody("");
    setSelectedTemplate(null);
    setScheduleDate("");
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-2xl font-bold text-ink-primary">Notifications</h2>
        <p className="mt-1 text-sm text-ink-muted">Send announcements and manage notifications to students and classes.</p>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard icon={Send} label="Total Sent" value={totalSent} accent="purple" />
        <StatCard icon={Eye} label="Avg. Read Rate" value={`${totalReadRate}%`} accent="green" />
        <StatCard icon={Users} label="Total Recipients" value={totalRecipients} accent="cyan" />
        <StatCard icon={CheckCircle} label="Total Reads" value={totalReads} accent="gold" />
      </div>

      <div className="flex gap-1 rounded-xl border border-panel-line bg-panel/40 p-1">
        {[
          { id: "compose", label: "Compose", icon: Plus },
          { id: "templates", label: "Templates", icon: Bell },
          { id: "history", label: "History", icon: Clock },
        ].map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            className={`flex flex-1 items-center justify-center gap-2 rounded-lg px-3 py-2 font-display text-sm font-semibold transition-colors ${
              activeTab === tab.id ? "bg-arcane-purple text-white shadow-glow-purple" : "text-ink-muted hover:text-ink-primary"
            }`}
          >
            <tab.icon className="h-4 w-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === "compose" && (
        <div className="rounded-2xl border border-panel-line bg-panel/60 p-5">
          <h3 className="font-display text-base font-bold text-ink-primary">Compose Notification</h3>
          <div className="mt-5 space-y-5">
            <div>
              <label className="mb-2 block font-mono text-[11px] uppercase tracking-widest text-ink-faint">Send To</label>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                {SEND_TO_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setComposeTo(opt.value)}
                    className={`flex items-center gap-2 rounded-xl border p-3 text-left transition-colors ${
                      composeTo === opt.value
                        ? "border-arcane-purple bg-arcane-purple/10"
                        : "border-panel-line bg-void/40 hover:bg-panel-alt/30"
                    }`}
                  >
                    <opt.icon className="h-4 w-4 text-arcane-purple" />
                    <span className="font-display text-xs font-semibold text-ink-primary">{opt.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="mb-1.5 block font-mono text-[11px] uppercase tracking-widest text-ink-faint">Use Template (optional)</label>
              <div className="flex flex-wrap gap-2">
                {MOCK_TEMPLATES.map((tmpl) => (
                  <button
                    key={tmpl.id}
                    type="button"
                    onClick={() => applyTemplate(tmpl)}
                    className={`rounded-lg border px-3 py-1.5 font-display text-xs font-semibold transition-colors ${
                      selectedTemplate?.id === tmpl.id
                        ? "border-neon-cyan bg-neon-cyan/10 text-neon-cyan"
                        : "border-panel-line text-ink-muted hover:text-ink-primary"
                    }`}
                  >
                    {tmpl.name}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="mb-1.5 block font-mono text-[11px] uppercase tracking-widest text-ink-faint">Subject</label>
              <input
                value={composeSubject}
                onChange={(e) => setComposeSubject(e.target.value)}
                placeholder="Notification subject..."
                className="w-full rounded-lg border border-panel-line bg-void px-3 py-2 text-sm text-ink-primary outline-none focus:border-neon-cyan"
              />
            </div>

            <div>
              <label className="mb-1.5 block font-mono text-[11px] uppercase tracking-widest text-ink-faint">Message</label>
              <textarea
                value={composeBody}
                onChange={(e) => setComposeBody(e.target.value)}
                rows={5}
                placeholder="Write your notification message..."
                className="w-full resize-none rounded-lg border border-panel-line bg-void px-3 py-2 text-sm text-ink-primary outline-none focus:border-neon-cyan"
              />
            </div>

            <div>
              <label className="mb-1.5 block font-mono text-[11px] uppercase tracking-widest text-ink-faint">Schedule (optional)</label>
              <input
                type="datetime-local"
                value={scheduleDate}
                onChange={(e) => setScheduleDate(e.target.value)}
                className="rounded-lg border border-panel-line bg-void px-3 py-2 text-sm text-ink-primary outline-none focus:border-neon-cyan"
              />
            </div>

            <div className="flex justify-end gap-2 border-t border-panel-line pt-4">
              <button
                type="button"
                onClick={() => { setComposeSubject(""); setComposeBody(""); setSelectedTemplate(null); setScheduleDate(""); }}
                className="rounded-lg border border-panel-line px-4 py-2 font-display text-sm font-semibold text-ink-muted transition-colors hover:text-ink-primary"
              >
                Clear
              </button>
              <button
                type="button"
                onClick={handleSend}
                disabled={!composeSubject.trim() || !composeBody.trim()}
                className="flex items-center gap-1.5 rounded-lg bg-arcane-purple px-4 py-2 font-display text-sm font-semibold text-white shadow-glow-purple transition-colors hover:bg-arcane-violet disabled:cursor-not-allowed disabled:opacity-40"
              >
                <Send className="h-4 w-4" />
                {scheduleDate ? "Schedule" : "Send Now"}
              </button>
            </div>
          </div>
        </div>
      )}

      {activeTab === "templates" && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {MOCK_TEMPLATES.map((tmpl) => (
            <div key={tmpl.id} className="rounded-2xl border border-panel-line bg-panel/60 p-5">
              <div className="flex items-start justify-between">
                <StatusPill value={tmpl.category} />
              </div>
              <h4 className="mt-3 font-display text-sm font-bold text-ink-primary">{tmpl.name}</h4>
              <p className="mt-1 font-mono text-xs text-ink-faint">Subject: {tmpl.subject}</p>
              <p className="mt-2 text-xs text-ink-muted line-clamp-3">{tmpl.body}</p>
              <div className="mt-4 flex gap-2">
                <button
                  type="button"
                  onClick={() => { applyTemplate(tmpl); setActiveTab("compose"); }}
                  className="flex-1 rounded-lg border border-panel-line px-3 py-1.5 font-display text-xs font-semibold text-ink-muted transition-colors hover:text-neon-cyan"
                >
                  Use Template
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === "history" && (
        <div className="space-y-4">
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative flex-1 max-w-sm">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-faint" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search notifications..."
                className="w-full rounded-lg border border-panel-line bg-void py-2 pl-9 pr-3 text-sm text-ink-primary outline-none focus:border-neon-cyan"
              />
            </div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="rounded-lg border border-panel-line bg-void px-3 py-2 text-sm text-ink-primary outline-none focus:border-neon-cyan"
            >
              <option value="all">All Status</option>
              <option value="sent">Sent</option>
              <option value="scheduled">Scheduled</option>
              <option value="draft">Draft</option>
            </select>
          </div>

          <div className="rounded-2xl border border-panel-line bg-panel/60">
            <div className="divide-y divide-panel-line">
              {filteredNotifications.length === 0 && (
                <p className="py-8 text-center text-sm text-ink-faint">No notifications found.</p>
              )}
              {filteredNotifications.map((n) => (
                <div key={n.id} className="flex items-center gap-4 px-5 py-4">
                  <div className="hidden h-10 w-10 flex-none items-center justify-center rounded-xl border border-arcane-purple/30 bg-arcane-purple/10 sm:flex">
                    <Bell className="h-5 w-5 text-arcane-purple" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-display text-sm font-semibold text-ink-primary">{n.subject}</p>
                    <div className="mt-1 flex items-center gap-3 text-xs text-ink-muted">
                      <span className="flex items-center gap-1">
                        <Users className="h-3 w-3" />
                        {n.recipients} ({n.recipientCount})
                      </span>
                      {n.sentAt && (
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {new Date(n.sentAt).toLocaleDateString()}
                        </span>
                      )}
                      {n.scheduled && n.scheduledFor && (
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          Scheduled: {new Date(n.scheduledFor).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex-none text-right">
                    {n.status === "sent" && (
                      <>
                        <p className="font-mono text-xs text-neon-cyan">{n.readRate}% read</p>
                        <div className="mt-1 h-1.5 w-20 overflow-hidden rounded-full bg-panel-line">
                          <div className="h-full rounded-full bg-neon-cyan" style={{ width: `${n.readRate}%` }} />
                        </div>
                      </>
                    )}
                    <div className="mt-1">
                      <StatusPill value={n.status} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
