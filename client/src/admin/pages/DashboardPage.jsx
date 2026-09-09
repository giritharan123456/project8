import {
  GraduationCap,
  Users,
  Landmark,
  LibraryBig,
  HelpCircle,
  ClipboardList,
  TrendingUp,
} from "lucide-react";
import { useAdminData } from "../AdminContext.jsx";
import StatCard from "../components/StatCard.jsx";

export default function DashboardPage() {
  const { data } = useAdminData();

  const activeStudents = data.students.filter((s) => s.status === "active").length;
  const activeTeachers = data.teachers.filter((t) => t.status === "active").length;
  const publishedQuestions = data.questions.filter((q) => q.status === "published").length;
  const publishedQuizzes = data.quizzes.filter((q) => q.status === "published").length;

  const studentsByGrade = [...data.classes]
    .sort((a, b) => a.grade - b.grade)
    .map(({ grade }) => ({
      grade,
      count: data.students.filter((s) => s.grade === grade).length,
    }));
  const maxByGrade = Math.max(1, ...studentsByGrade.map((g) => g.count));

  const studentsByBoard = data.boards.map((b) => ({
    board: b.id,
    count: data.students.filter((s) => s.board === b.id).length,
  }));
  const maxByBoard = Math.max(1, ...studentsByBoard.map((b) => b.count));

  const recentStudents = [...data.students]
    .sort((a, b) => new Date(b.joinedDate) - new Date(a.joinedDate))
    .slice(0, 5);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-2xl font-bold text-ink-primary">Dashboard</h2>
        <p className="mt-1 text-sm text-ink-muted">A snapshot of everything happening across LearnQuest right now.</p>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard icon={GraduationCap} label="Students" value={data.students.length} sublabel={`${activeStudents} active`} accent="purple" />
        <StatCard icon={Users} label="Teachers" value={data.teachers.length} sublabel={`${activeTeachers} active`} accent="cyan" />
        <StatCard icon={Landmark} label="Boards" value={data.boards.length} sublabel={`${data.classes.length} classes`} accent="green" />
        <StatCard icon={LibraryBig} label="Courses" value={data.courses.length} sublabel={`${data.chapters.length} chapters`} accent="gold" />
        <StatCard icon={HelpCircle} label="Questions" value={data.questions.length} sublabel={`${publishedQuestions} published`} accent="purple" />
        <StatCard icon={ClipboardList} label="Quizzes" value={data.quizzes.length} sublabel={`${publishedQuizzes} published`} accent="cyan" />
        <StatCard icon={LibraryBig} label="Lessons" value={data.lessons.length} sublabel={`${data.chapters.length} chapters`} accent="green" />
        <StatCard icon={TrendingUp} label="Subjects" value={data.subjects.length} sublabel="Chemistry live, 2 planned" accent="gold" />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-2xl border border-panel-line bg-panel/60 p-5">
          <h3 className="font-display text-base font-bold text-ink-primary">Students by Grade</h3>
          <div className="mt-4 space-y-3">
            {studentsByGrade.map((g) => (
              <div key={g.grade} className="flex items-center gap-3">
                <span className="w-16 flex-none font-mono text-xs text-ink-muted">Grade {g.grade}</span>
                <div className="h-2.5 flex-1 overflow-hidden rounded-full bg-panel-line">
                  <div
                    className="h-full rounded-full bg-arcane-purple"
                    style={{ width: `${(g.count / maxByGrade) * 100}%` }}
                  />
                </div>
                <span className="w-6 flex-none text-right font-mono text-xs text-ink-primary">{g.count}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-panel-line bg-panel/60 p-5">
          <h3 className="font-display text-base font-bold text-ink-primary">Students by Board</h3>
          <div className="mt-4 space-y-3">
            {studentsByBoard.map((b) => (
              <div key={b.board} className="flex items-center gap-3">
                <span className="w-16 flex-none font-mono text-xs text-ink-muted">{b.board}</span>
                <div className="h-2.5 flex-1 overflow-hidden rounded-full bg-panel-line">
                  <div
                    className="h-full rounded-full bg-neon-cyan"
                    style={{ width: `${(b.count / maxByBoard) * 100}%` }}
                  />
                </div>
                <span className="w-6 flex-none text-right font-mono text-xs text-ink-primary">{b.count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-panel-line bg-panel/60 p-5">
        <h3 className="font-display text-base font-bold text-ink-primary">Recently Joined Students</h3>
        <div className="mt-3 divide-y divide-panel-line">
          {recentStudents.map((s) => (
            <div key={s.id} className="flex items-center justify-between gap-3 py-2.5">
              <div className="min-w-0">
                <p className="truncate font-display text-sm font-semibold text-ink-primary">{s.name}</p>
                <p className="truncate text-xs text-ink-muted">
                  Grade {s.grade} &middot; {s.board}
                </p>
              </div>
              <span className="flex-none font-mono text-xs text-ink-faint">{s.joinedDate}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
