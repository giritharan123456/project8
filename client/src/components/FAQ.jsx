import { useState } from "react";
import { ChevronDown } from "lucide-react";

const FAQS = [
  {
    q: "Does LearnQuest follow my school's actual syllabus?",
    a: "Yes. Every world, lesson, and question is mapped to the exact Class and Board you select \u2014 CBSE, ICSE, state boards, or international boards \u2014 so nothing outside your syllabus ever shows up.",
  },
  {
    q: "Can I play more than one Class or Board?",
    a: "You can switch Class or Board any time from your Profile. Progress is tracked separately for each combination, so switching never overwrites what you've already earned.",
  },
  {
    q: "How do XP, coins, and stars work?",
    a: "Correct answers land an attack and earn XP and coins scaled to difficulty. Clearing a level with high accuracy earns up to three stars, and defeating a chapter boss pays out the biggest reward of all.",
  },
  {
    q: "Do I need to spend real money?",
    a: "No. The in-game shop only accepts coins you earn by playing \u2014 there are no real-money purchases anywhere in LearnQuest.",
  },
  {
    q: "Does it adapt to my learning level?",
    a: "Yes. Our mastery engine tracks your accuracy, speed, and consistency for every concept, identifies what you're weak at, and recommends targeted practice quizzes, lessons, and flashcards so you always know what to do next.",
  },
  {
    q: "What about teachers and schools?",
    a: "Teachers get a full portal: class management, a question bank, quiz builder, live games with Game PIN, assignments, analytics, and exportable reports. Admins manage schools, users, curriculum, and platform settings.",
  },
];

function FAQItem({ item, open, onToggle }) {
  return (
    <div className="border-b border-panel-line">
      <button
        onClick={onToggle}
        className="flex w-full items-center justify-between gap-4 py-5 text-left"
        aria-expanded={open}
      >
        <span className="font-display text-base font-semibold text-ink-primary sm:text-lg">
          {item.q}
        </span>
        <ChevronDown
          className={`h-5 w-5 flex-none text-neon-cyan transition-transform duration-300 ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>
      <div
        className={`grid overflow-hidden transition-all duration-300 ${
          open ? "grid-rows-[1fr] pb-5 opacity-100" : "grid-rows-[0fr] opacity-0"
        }`}
        style={{ display: "grid" }}
      >
        <div className="min-h-0">
          <p className="max-w-2xl font-body text-sm leading-relaxed text-ink-muted">
            {item.a}
          </p>
        </div>
      </div>
    </div>
  );
}

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <section id="faq" className="relative bg-void-soft px-6 py-28 lg:px-8">
      <div className="mx-auto max-w-3xl">
        <div className="mx-auto max-w-2xl text-center">
          <span className="font-mono text-xs uppercase tracking-[0.25em] text-arcane-purple">
            Questions
          </span>
          <h2 className="mt-3 font-display text-4xl font-bold text-ink-primary sm:text-5xl">
            Frequently Asked
          </h2>
        </div>

        <div className="mt-14">
          {FAQS.map((item, i) => (
            <FAQItem
              key={item.q}
              item={item}
              open={openIndex === i}
              onToggle={() => setOpenIndex(openIndex === i ? -1 : i)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
