// Landing-page subject context. Returns all subjects for the multi-subject
// landing page design, plus the "current" subject for any single-subject
// sections. A fresh visit defaults to Chemistry.
import { getSelectedSubject } from "../store/selectedSubject.js";
import { getSubjectByCode, getAllSubjects } from "../data/subjectCatalog.js";
import { worldTemplateFor } from "../data/content.js";

export function getLandingSubject() {
  const code = getSelectedSubject();
  const subject = getSubjectByCode(code);
  const resolved = subject ? subject.code : "CHEM";
  return {
    code: resolved,
    name: subject ? subject.name : "Chemistry",
    template: worldTemplateFor(resolved),
  };
}

// All subjects with their world templates, for the multi-subject hero and
// spotlight sections. Each entry has code, name, icon name, accent color,
// tagline, and up to 3 world templates for the card previews.
export function getAllLandingSubjects() {
  const all = getAllSubjects();
  const SUBJECT_META = {
    CHEM: { icon: "FlaskConical", accent: "neon-cyan", tagline: "Explore molecules, reactions & the building blocks of matter" },
    PHYS: { icon: "Atom", accent: "arcane-purple", tagline: "Master forces, energy & the laws that govern the universe" },
    MATH: { icon: "Sigma", accent: "reward-gold", tagline: "Solve equations, conquer geometry & unlock mathematical thinking" },
    BIO:  { icon: "Dna", accent: "neon-green", tagline: "Dive into cells, genetics & the science of life itself" },
    ENG:  { icon: "BookOpen", accent: "sky-400", tagline: "Sharpen reading, writing & communication skills" },
    CS:   { icon: "Monitor", accent: "fuchsia-400", tagline: "Learn programming, algorithms & computational thinking" },
    TAMIL:{ icon: "Feather", accent: "fuchsia-400", tagline: "Master Tamil grammar, literature & creative writing" },
  };
  return all.map((s) => {
    const meta = SUBJECT_META[s.code] ?? SUBJECT_META.CHEM;
    return {
      ...s,
      ...meta,
      template: worldTemplateFor(s.code),
    };
  });
}
