# Decisions & Assumptions

The brief: *"If something is unclear, make a call, write down what you assumed, and keep going."*
Every open question gets resolved here rather than deferred. Newest at the bottom.

---

### D-001 · Deadline unknown
**Assumption:** Plan is phase-based, not date-based. Phase 1 (the system) is protected; the
explorations and the build polish absorb any time pressure.
**Revisit if:** a due date is confirmed.

### D-002 · Stack — settled
**Call:** Vite + React + TypeScript, static fixtures, no backend. Styles are hand-written CSS with
design tokens at the top, ported from the prototype. No utility framework, no component kit.
**Why:** Nine components total — too small to justify a kit, and a kit-default look reads as
generic when craft is being graded. The prototype's CSS was already the design, so porting it kept
the built surface identical to the designed one.
**Cost:** Focus rings, keyboard handling and the collapse animation are hand-written. Cheap at this
size, and it keeps the stylesheet readable end to end.

### D-003 · Delegation is per scenario, not a global level
**Call:** Approving offers two buttons — "Yes, this time" and "Yes, always", where *always* carries
a named scope ("emails to Daniel"). Handed-off scopes are listed somewhere revocable.
**Why:** It replaces an unanswerable question ("how autonomous
should the AI be?") with an answerable one ("can it handle shipping questions?"). Scope named in
the button label is what makes it consent rather than a blank cheque.
**Cost:** Two components more than a single auto-approve button. Reverses the earlier call to
avoid an autonomy dial — the objection was to a *global* dial, and this is not one.

### D-004 · `Field.long` instead of a fourth primitive
**Call:** Long values inside `evidence.found` render as a block quote, via an optional flag.
**Why:** The contract-clause case in the coverage test needs a paragraph quoted inside evidence.
A fourth primitive would be wrong — it is evidence with a long value, not a new shape. Letting
`body` hold an array of primitives would turn every renderer into a layout engine to solve one case.
**Cost:** One optional boolean.

### D-005 · Conversation lives inside the card
**Call:** No separate chat panel or thread list. A reply box sits in every expanded card.
**Why:** This is the brief's own named hardest call — whether approving a draft and answering a
question belong in the same place. They do, but only because the talking happens against the work
it is about: "make this warmer" needs no antecedent when it is typed under the draft. It also
deletes the split view, the thread list, and every context switch between them.
**Cost:** No place for a conversation that is not about a specific piece of work. Accepted —
the brief's third job is the AI opening a conversation, and it always opens one about something.

---

<!-- Template
### D-00N · <the question>
**Call:** <what I decided>
**Why:** <one or two lines>
**Cost:** <what this gives up>
-->

### D-006 · Web surface, phone and desktop both first-class
**Call:** One responsive web surface, one codebase, one breakpoint. Phone (375–430) is the
primary shape for the light day, answering questions, handing off trust, and giving instructions
on the move. Desktop (≥1024) is the reading shape: the heavy day, full drafts, diffs, keyboard.
Same column, same components; only spacing and type tokens change.
**Why:** The brief says "web surface" and grades a browser build — but most of the scenarios
(S1, S4, S5, giving an instruction) are phone-shaped. The capsule language in the reference was
born at phone width; desktop is the extension, not the other way round.
**Cost:** Every state has to be checked at two widths. No swipe gestures — the undo strip exists,
but a mis-swipe on a "send" is still too expensive.

### D-007 · A standing instruction capsule (amends D-005)
**Call:** Conversation *about a piece of work* stays inside that work's capsule (D-005). Added: one
always-present composer capsule at the bottom of the surface for instructions that are not about
any waiting item — "put Halden in Friday's report", "move my 2pm". The AI replies in the same
capsule, and if the instruction produces work that needs sign-off, it shows up as a normal capsule.
**Why:** D-005's cost — "no place for a conversation that isn't about a specific piece of work" —
turned out to be a real hole once the phone became first-class. Giving the assistant something
to do while out is the brief's second job.
**Cost:** One more element on every screen. Kept to a single line until focused.

### D-008 · Grouping is the assistant's narration, not a time axis
**Call:** On the heavy day the gutter carries the assistant's own grouping — `4 Needs you · 4 About Daniel · 20 Same pattern · 3 From last week` — matching the briefing sentence at the top. No date grouping.
**Why:** Dates add a second sorting axis that competes with the grouping the assistant already announced, and they turn a backlog into guilt ("five days old"). The person cares what needs them, not when it arrived. Dates stay as small meta on each card.
**Cost:** The big-numeral date treatment from the reference is dropped; the numeral becomes a count instead.

### D-009 · Slide to confirm, and one accent colour
**Call:** The positive action inside an opened card is a slide-to-confirm; a plain click also works on desktop. Amends D-006's "no swipe": what was refused there was *accidental* swipes, and this gesture requires intent. The single accent is terracotta `#d95d44` used only for the Today dot, urgency chip, icon badge and the "Needs you" count. Green is reserved for done.
**Why:** iOS red read as an alarm repeated four times on a calm page. Terracotta keeps the meaning at lower volume. A glow was tried and removed — it read as decoration.
**Cost:** Slightly lower contrast than pure red; checked against white at small sizes.
