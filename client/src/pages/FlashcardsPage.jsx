import { useState, useEffect, useCallback, useMemo } from "react";
import { useSearchParams, Link } from "react-router-dom";
import * as Icons from "lucide-react";
import {
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Plus,
  RotateCcw,
  CheckCircle2,
  XCircle,
  Shuffle,
  Layers,
  BookOpen,
  Brain,
  Target,
  Download,
  Upload,
  Trash2,
  Eye,
  EyeOff,
  Sparkles,
  X,
} from "lucide-react";
import ParticleField from "../components/ParticleField.jsx";
import {
  getFlashcardSets,
  getFlashcards,
  createFlashcardSet,
  createFlashcard,
  updateFlashcardReview,
} from "../api/endpoints.js";

function FlashcardViewer({ card, flipped, onFlip, onKnow, onDontKnow }) {
  return (
    <div className="space-y-4">
      <button
        type="button"
        onClick={onFlip}
        className="w-full"
      >
        <div
          className={`hud-frame flex min-h-[220px] cursor-pointer items-center justify-center rounded-2xl border p-8 text-center transition-all ${
            flipped
              ? "border-arcane-purple/60 bg-arcane-purple/10"
              : "border-panel-line bg-panel/60"
          }`}
          style={{ "--hud-color": flipped ? "#806BFF" : "#38D9F4" }}
        >
          <div>
            <p className="mb-2 font-mono text-[10px] uppercase tracking-widest text-ink-faint">
              {flipped ? "Definition" : "Term"}
            </p>
            <p className="font-display text-xl font-bold text-ink-primary">
              {flipped ? card.back : card.front}
            </p>
          </div>
        </div>
      </button>

      {flipped && (
        <div className="flex gap-3">
          <button
            type="button"
            onClick={onDontKnow}
            className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-red-400/40 bg-red-400/10 py-3 font-display text-sm font-bold text-red-400 transition-all hover:bg-red-400/20"
          >
            <XCircle className="h-4 w-4" /> Still Learning
          </button>
          <button
            type="button"
            onClick={onKnow}
            className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-neon-green/40 bg-neon-green/10 py-3 font-display text-sm font-bold text-neon-green transition-all hover:bg-neon-green/20"
          >
            <CheckCircle2 className="h-4 w-4" /> Got It
          </button>
        </div>
      )}

      <p className="text-center font-body text-xs text-ink-faint">
        Tap card to {flipped ? "see term" : "reveal definition"}
      </p>
    </div>
  );
}

function MatchMode({ cards, onComplete }) {
  const [selected, setSelected] = useState(null);
  const [matched, setMatched] = useState([]);
  const [wrongPair, setWrongPair] = useState(null);

  const pairs = useMemo(() => {
    const shuffled = [...cards].sort(() => Math.random() - 0.5);
    const fronts = shuffled.map((c) => ({ id: c.id, text: c.front, type: "front" }));
    const backs = shuffled.map((c) => ({ id: c.id, text: c.back, type: "back" }));
    const all = [...fronts, ...backs].sort(() => Math.random() - 0.5);
    return all;
  }, [cards]);

  function handleSelect(item) {
    if (matched.includes(item.id)) return;
    if (!selected) {
      setSelected(item);
      return;
    }
    if (selected.id === item.id && selected.type !== item.type) {
      setMatched((prev) => [...prev, item.id]);
      setSelected(null);
      if (matched.length + 1 === cards.length) {
        onComplete();
      }
    } else {
      setWrongPair([selected, item]);
      setTimeout(() => {
        setWrongPair(null);
        setSelected(null);
      }, 800);
    }
    if (selected.type === item.type) {
      setSelected(item);
    }
  }

  return (
    <div className="grid grid-cols-2 gap-3">
      {pairs.map((item, i) => {
        const isMatched = matched.includes(item.id);
        const isSelected = selected?.id === item.id && selected?.type === item.type;
        const isWrong = wrongPair?.some((w) => w.id === item.id && w.type === item.type);
        return (
          <button
            key={`${item.id}-${item.type}-${i}`}
            type="button"
            onClick={() => handleSelect(item)}
            disabled={isMatched}
            className={`rounded-xl border p-3 text-left font-body text-xs transition-all ${
              isMatched
                ? "border-neon-green/40 bg-neon-green/10 opacity-50"
                : isWrong
                ? "border-red-400/60 bg-red-400/10 animate-pulse"
                : isSelected
                ? "border-arcane-purple/60 bg-arcane-purple/10"
                : "border-panel-line bg-panel/60 hover:border-arcane-purple/40"
            }`}
          >
            <span className="line-clamp-3 text-ink-primary">
              {item.type === "front" ? (
                <span className="font-bold">{item.text}</span>
              ) : (
                <span className="text-ink-muted">{item.text}</span>
              )}
            </span>
          </button>
        );
      })}
    </div>
  );
}

function CreateSetModal({ onClose, onCreate }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [subject, setSubject] = useState("CHEM");

  function handleSubmit(e) {
    e.preventDefault();
    if (!title.trim()) return;
    onCreate({ title: title.trim(), description: description.trim(), subject });
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-void/80 px-4">
      <div className="w-full max-w-md rounded-2xl border border-panel-line bg-panel p-6">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="font-display text-lg font-bold text-ink-primary">Create Flashcard Set</h3>
          <button type="button" onClick={onClose} className="text-ink-faint hover:text-ink-muted">
            <X className="h-5 w-5" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1 block font-mono text-xs uppercase tracking-widest text-ink-faint">Title</label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full rounded-lg border border-panel-line bg-panel/60 px-3 py-2 font-body text-sm text-ink-primary outline-none focus:border-arcane-purple"
              placeholder="e.g. Chemical Bonding Terms"
              required
            />
          </div>
          <div>
            <label className="mb-1 block font-mono text-xs uppercase tracking-widest text-ink-faint">Description</label>
            <input
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full rounded-lg border border-panel-line bg-panel/60 px-3 py-2 font-body text-sm text-ink-primary outline-none focus:border-arcane-purple"
              placeholder="Optional description"
            />
          </div>
          <div>
            <label className="mb-1 block font-mono text-xs uppercase tracking-widest text-ink-faint">Subject</label>
            <select
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="w-full rounded-lg border border-panel-line bg-panel/60 px-3 py-2 font-body text-sm text-ink-primary outline-none focus:border-arcane-purple"
            >
              <option value="CHEM">Chemistry</option>
              <option value="MATH">Mathematics</option>
              <option value="PHY">Physics</option>
              <option value="BIO">Biology</option>
              <option value="ENG">English</option>
            </select>
          </div>
          <button
            type="submit"
            className="w-full rounded-xl bg-neon-green py-2.5 font-display text-sm font-bold uppercase tracking-wider text-void transition-transform hover:scale-[1.02]"
          >
            Create Set
          </button>
        </form>
      </div>
    </div>
  );
}

function AddCardModal({ onClose, onAdd }) {
  const [front, setFront] = useState("");
  const [back, setBack] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    if (!front.trim() || !back.trim()) return;
    onAdd({ front: front.trim(), back: back.trim() });
    setFront("");
    setBack("");
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-void/80 px-4">
      <div className="w-full max-w-md rounded-2xl border border-panel-line bg-panel p-6">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="font-display text-lg font-bold text-ink-primary">Add Flashcard</h3>
          <button type="button" onClick={onClose} className="text-ink-faint hover:text-ink-muted">
            <X className="h-5 w-5" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1 block font-mono text-xs uppercase tracking-widest text-ink-faint">Front (Term)</label>
            <input
              value={front}
              onChange={(e) => setFront(e.target.value)}
              className="w-full rounded-lg border border-panel-line bg-panel/60 px-3 py-2 font-body text-sm text-ink-primary outline-none focus:border-arcane-purple"
              placeholder="e.g. Ionic Bond"
              required
            />
          </div>
          <div>
            <label className="mb-1 block font-mono text-xs uppercase tracking-widest text-ink-faint">Back (Definition)</label>
            <textarea
              value={back}
              onChange={(e) => setBack(e.target.value)}
              rows={3}
              className="w-full rounded-lg border border-panel-line bg-panel/60 px-3 py-2 font-body text-sm text-ink-primary outline-none focus:border-arcane-purple resize-none"
              placeholder="e.g. A bond formed by transfer of electrons"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full rounded-xl bg-arcane-purple py-2.5 font-display text-sm font-bold uppercase tracking-wider text-void transition-transform hover:scale-[1.02]"
          >
            Add Card
          </button>
        </form>
      </div>
    </div>
  );
}

export default function FlashcardsPage() {
  const [searchParams] = useSearchParams();
  const grade = searchParams.get("class") ?? "9";
  const board = searchParams.get("board") ?? "CBSE";
  const subject = searchParams.get("subject") ?? "CHEM";
  const queryBase = `?class=${grade}&board=${board}&subject=${subject}`;

  const [sets, setSets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSet, setSelectedSet] = useState(null);
  const [cards, setCards] = useState([]);
  const [mode, setMode] = useState("browse");
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [knownCount, setKnownCount] = useState(0);
  const [sessionComplete, setSessionComplete] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showAddCardModal, setShowAddCardModal] = useState(false);

  const loadSets = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getFlashcardSets({ subject });
      setSets(data);
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  }, [subject]);

  useEffect(() => {
    loadSets();
  }, [loadSets]);

  async function handleSelectSet(setData) {
    setSelectedSet(setData);
    try {
      const flashcards = await getFlashcards(setData.id);
      setCards(flashcards.length > 0 ? flashcards : setData.cards ?? []);
    } catch {
      setCards(setData.cards ?? []);
    }
    setCurrentCardIndex(0);
    setFlipped(false);
    setKnownCount(0);
    setSessionComplete(false);
    setMode("study");
  }

  function handleCreateSet(data) {
    createFlashcardSet(data).then((newSet) => {
      setSets((prev) => [...prev, newSet]);
    });
  }

  function handleAddCard(data) {
    if (!selectedSet) return;
    createFlashcard({ ...data, setId: selectedSet.id }).then((card) => {
      setCards((prev) => [...prev, card]);
    });
  }

  function handleKnow() {
    const card = cards[currentCardIndex];
    if (card) {
      updateFlashcardReview(card.id, { known: true, reviewCount: (card.reviewCount ?? 0) + 1 });
    }
    setKnownCount((c) => c + 1);
    advanceCard();
  }

  function handleDontKnow() {
    advanceCard();
  }

  function advanceCard() {
    setFlipped(false);
    if (currentCardIndex < cards.length - 1) {
      setCurrentCardIndex((i) => i + 1);
    } else {
      setSessionComplete(true);
    }
  }

  function startMatchMode() {
    setMode("match");
    setSessionComplete(false);
  }

  function restartStudy() {
    setCurrentCardIndex(0);
    setFlipped(false);
    setKnownCount(0);
    setSessionComplete(false);
    setMode("study");
  }

  if (mode === "study" && selectedSet && !sessionComplete) {
    const card = cards[currentCardIndex];
    if (!card) return null;
    const progress = cards.length > 0 ? ((currentCardIndex + 1) / cards.length) * 100 : 0;

    return (
      <div className="relative min-h-screen bg-void">
        <div className="absolute inset-0 bg-radial-fade" />
      <div className="aurora-canvas pointer-events-none absolute inset-0" aria-hidden="true" />
        <ParticleField density={10} />
        <div className="relative z-10 mx-auto max-w-lg px-4 py-8">
          <button
            type="button"
            onClick={() => { setMode("browse"); setSelectedSet(null); }}
            className="mb-6 inline-flex items-center gap-1 font-display text-sm text-ink-muted hover:text-ink-primary"
          >
            <ChevronLeft className="h-4 w-4" /> Back to Sets
          </button>

          <h2 className="font-display text-xl font-bold text-ink-primary">{selectedSet.title}</h2>
          <p className="mt-1 font-body text-xs text-ink-muted">
            Card {currentCardIndex + 1} of {cards.length}
          </p>

          <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-panel-line">
            <div className="h-full rounded-full bg-gradient-to-r from-arcane-purple to-neon-cyan transition-all" style={{ width: `${progress}%` }} />
          </div>

          <div className="mt-6">
            <FlashcardViewer
              card={card}
              flipped={flipped}
              onFlip={() => setFlipped(!flipped)}
              onKnow={handleKnow}
              onDontKnow={handleDontKnow}
            />
          </div>

          <div className="mt-6 flex items-center justify-between text-xs text-ink-faint">
            <span className="flex items-center gap-1"><CheckCircle2 className="h-3 w-3 text-neon-green" /> {knownCount} known</span>
            <span>{cards.length - currentCardIndex - 1} remaining</span>
          </div>
        </div>
      </div>
    );
  }

  if (mode === "study" && sessionComplete) {
    const accuracy = cards.length > 0 ? Math.round((knownCount / cards.length) * 100) : 0;
    return (
      <div className="relative flex min-h-screen items-center justify-center bg-void px-4 py-16">
        <div className="absolute inset-0 bg-radial-fade" />
      <div className="aurora-canvas pointer-events-none absolute inset-0" aria-hidden="true" />
        <ParticleField density={20} />
        <div className="hud-frame relative z-10 w-full max-w-md rounded-2xl border border-panel-line bg-panel/80 p-8 text-center backdrop-blur-sm" style={{ "--hud-color": "#4ADE80", borderColor: "#4ADE8055" }}>
          <Sparkles className="mx-auto h-10 w-10 text-neon-green" />
          <h1 className="mt-3 font-display text-2xl font-bold uppercase tracking-wide text-ink-primary">Study Session Complete!</h1>
          <div className="mt-6 grid grid-cols-2 gap-3">
            <div className="rounded-lg border border-panel-line bg-panel/60 p-3">
              <p className="font-mono text-[10px] uppercase tracking-widest text-ink-faint">Known</p>
              <p className="mt-1 font-display text-2xl font-bold text-neon-green">{knownCount}/{cards.length}</p>
            </div>
            <div className="rounded-lg border border-panel-line bg-panel/60 p-3">
              <p className="font-mono text-[10px] uppercase tracking-widest text-ink-faint">Accuracy</p>
              <p className="mt-1 font-display text-2xl font-bold text-ink-primary">{accuracy}%</p>
            </div>
          </div>
          <div className="mt-6 flex flex-col gap-3">
            <button type="button" onClick={restartStudy} className="flex items-center justify-center gap-2 rounded-xl bg-neon-green py-3 font-display text-sm font-bold uppercase tracking-wider text-void transition-transform hover:scale-[1.02]">
              <RotateCcw className="h-4 w-4" /> Study Again
            </button>
            <button type="button" onClick={startMatchMode} className="flex items-center justify-center gap-2 rounded-xl border border-panel-line py-3 font-display text-sm font-bold uppercase tracking-wider text-ink-muted transition-colors hover:border-arcane-purple hover:text-arcane-purple">
              <Layers className="h-4 w-4" /> Match Mode
            </button>
            <button type="button" onClick={() => { setMode("browse"); setSelectedSet(null); }} className="flex items-center justify-center gap-2 rounded-xl border border-panel-line py-3 font-display text-sm font-bold uppercase tracking-wider text-ink-muted transition-colors hover:border-ink-faint hover:text-ink-primary">
              <ChevronLeft className="h-4 w-4" /> Back to Sets
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (mode === "match" && selectedSet) {
    return (
      <div className="relative min-h-screen bg-void">
        <div className="absolute inset-0 bg-radial-fade" />
      <div className="aurora-canvas pointer-events-none absolute inset-0" aria-hidden="true" />
        <ParticleField density={12} />
        <div className="relative z-10 mx-auto max-w-2xl px-4 py-8">
          <button
            type="button"
            onClick={() => { setMode("browse"); setSelectedSet(null); }}
            className="mb-6 inline-flex items-center gap-1 font-display text-sm text-ink-muted hover:text-ink-primary"
          >
            <ChevronLeft className="h-4 w-4" /> Back to Sets
          </button>
          <h2 className="font-display text-xl font-bold text-ink-primary">
            Match Mode: {selectedSet.title}
          </h2>
          <p className="mt-1 font-body text-xs text-ink-muted">Match each term with its definition</p>

          <div className="mt-6">
            <MatchMode
              cards={cards}
              onComplete={() => {
                setSessionComplete(true);
                setMode("study");
              }}
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-void">
      <div className="absolute inset-0 bg-radial-fade" />
      <div className="aurora-canvas pointer-events-none absolute inset-0" aria-hidden="true" />
      <ParticleField density={14} />
      {showCreateModal && (
        <CreateSetModal onClose={() => setShowCreateModal(false)} onCreate={handleCreateSet} />
      )}
      {showAddCardModal && (
        <AddCardModal onClose={() => setShowAddCardModal(false)} onAdd={handleAddCard} />
      )}

      <div className="relative z-10 mx-auto max-w-4xl px-4 py-8">
        <Link
          to={`/games${queryBase}`}
          className="mb-6 inline-flex items-center gap-1 font-display text-sm text-ink-muted hover:text-ink-primary"
        >
          <ChevronLeft className="h-4 w-4" /> Back to Games
        </Link>

        <div className="flex items-end justify-between">
          <div>
            <h1 className="font-display text-3xl font-bold uppercase tracking-wide text-ink-primary">
              Flashcards
            </h1>
            <p className="mt-2 font-body text-sm text-ink-muted">
              Create, study, and master your flashcard sets.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2 rounded-lg bg-arcane-purple px-4 py-2 font-display text-xs font-bold uppercase tracking-wider text-void transition-transform hover:scale-[1.02]"
          >
            <Plus className="h-3.5 w-3.5" /> New Set
          </button>
        </div>

        {loading ? (
          <div className="mt-12 flex justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-arcane-purple border-t-transparent" />
          </div>
        ) : sets.length === 0 ? (
          <div className="mt-12 text-center">
            <Layers className="mx-auto h-10 w-10 text-ink-faint" />
            <p className="mt-3 font-display text-lg font-bold text-ink-primary">No flashcard sets yet</p>
            <p className="mt-1 font-body text-sm text-ink-muted">Create your first set to start studying.</p>
          </div>
        ) : (
          <div className="mt-8 space-y-4">
            {sets.map((setData) => (
              <div
                key={setData.id}
                className="hud-frame rounded-xl border border-panel-line bg-panel/60 p-5"
                style={{ "--hud-color": "#806BFF" }}
              >
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg border border-arcane-purple/30 bg-arcane-purple/10">
                    <BookOpen className="h-6 w-6 text-arcane-purple" strokeWidth={1.5} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-display text-lg font-bold text-ink-primary">{setData.title}</p>
                    {setData.description && (
                      <p className="mt-0.5 font-body text-xs text-ink-muted">{setData.description}</p>
                    )}
                    <div className="mt-2 flex items-center gap-3 text-xs text-ink-faint">
                      <span>{setData.cardCount ?? setData.cards?.length ?? 0} cards</span>
                      <span>{setData.subject}</span>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleSelectSet(setData)}
                    className="flex items-center gap-1 rounded-lg bg-neon-green px-3 py-2 font-display text-xs font-bold text-void transition-transform hover:scale-[1.02]"
                  >
                    Study <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
