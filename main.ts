// Invent a Word We Need — a make.fun program/v1 entry.
// Eight coined words are held in this file and scored on the judge's own
// criteria: a real gap in the language, an exact one-line definition, a
// word that is sayable, spellable and memorable, and a fresh pairing.
// The winner is written as a single line to /output/entry.txt.
// Deterministic by design: no network, no clock, no randomness.

import { mkdirSync, writeFileSync } from "node:fs";

type Draft = {
  word: string;
  definition: string;
  gap: number;
  clarity: number;
  sayability: number;
  freshness: number;
};

const DRAFTS: Draft[] = [
  { word: "doorblank", definition: "the sudden blank that strikes the moment you step through a doorway and forget what you came in for.", gap: 5, clarity: 5, sayability: 5, freshness: 4 },
  { word: "snurkle", definition: "the small snort-laugh that escapes when something is funny at precisely the wrong moment.", gap: 3, clarity: 5, sayability: 5, freshness: 4 },
  { word: "flern", definition: "the flutter of panic when you wave back at a stranger who was waving at the person behind you.", gap: 4, clarity: 4, sayability: 3, freshness: 3 },
  { word: "plork", definition: "the hollow clink of a spoon in a mug you were certain still held one last sip.", gap: 3, clarity: 5, sayability: 4, freshness: 3 },
  { word: "glintch", definition: "the flash of annoyance when autocorrect overrules a word you had spelled right on purpose.", gap: 4, clarity: 4, sayability: 4, freshness: 4 },
  { word: "quilldown", definition: "the heavy tiredness that lands the instant you finally sit down after a long day on your feet.", gap: 4, clarity: 4, sayability: 3, freshness: 3 },
  { word: "snozzle", definition: "pressing your face into a pillow, a blanket or a pet and breathing in, just to feel safe for a second.", gap: 3, clarity: 4, sayability: 5, freshness: 4 },
  { word: "crumblet", definition: "the last corner of a biscuit that crumbles apart the moment you try to dunk it in your tea.", gap: 2, clarity: 5, sayability: 4, freshness: 3 },
];

// The gap matters most: a word that names nothing new cannot win, however
// pretty it sounds. Clarity and sayability share the next weight, and
// freshness breaks what is left. Weights are fixed, so the pick is stable.
function score(draft: Draft): number {
  return draft.gap * 3 + draft.clarity * 2 + draft.sayability * 2 + draft.freshness;
}

function pickWinner(drafts: Draft[]): Draft {
  let champion = drafts[0];
  let championScore = score(champion);
  let championLength = [...champion.word].length + 3 + [...champion.definition].length;
  for (const draft of drafts.slice(1)) {
    const total = score(draft);
    const length = [...draft.word].length + 3 + [...draft.definition].length;
    if (total > championScore || (total === championScore && length < championLength)) {
      champion = draft;
      championScore = total;
      championLength = length;
    }
  }
  return champion;
}

const winner = pickWinner(DRAFTS);
const entry = `${winner.word} \u2014 ${winner.definition}`;
const entryLength = [...entry].length;
if (entryLength < 1 || entryLength > 140) {
  throw new Error(`entry must be 1 to 140 characters, got ${entryLength}`);
}
if (entry.includes("\n")) {
  throw new Error("entry must be a single line");
}

mkdirSync("/output", { recursive: true });
writeFileSync("/output/entry.txt", entry, "utf8");
console.log(entry);
