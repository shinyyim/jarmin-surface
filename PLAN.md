# JARMIN · Work plan

**Deliverable:** A web surface where a person and the AI employee working for them get things done together.

---

## The bet

The brief lists three jobs (approve work / talk / the employee asks for something), but it also
says outright where the difficulty lives:

> "Each kind of work needs to be shown a different way, and new kinds will keep appearing.
> **Handling that is most of the design problem.**"

> "The AI employee will determine what to surface and can leverage **UI primitives/components**
> to render what it needs."

So the thing being graded is not four polished screens. It is **one review language that renders
any kind of work** — email today, Monday.com item today, a CRM record or an invoice tomorrow —
without a new bespoke screen each time.

Everything below is organised around that bet.

---

## Phases

### Phase 0 — Framing (done)
- [x] Read and extract the brief → `00-brief/`
- [x] Set up project structure + Obsidian sync
- [x] Persona and both day-shapes → `02-design/what-we-are-building.md`
- [x] Product spec — what gets built, every state, every constraint answered

**Exit:** I can name who this is for and what their Tuesday looks like.

---

### Phase 1 — The system (the core, do this before any screen)
This is the highest-leverage phase. Do not skip ahead to layout.

- [x] **Work Block schema** → `02-design/system/work-block-schema.md`
      One envelope every item shares: *who asked · what changed · why · evidence · what I can do about it*.
      Body is swappable by type.
- [x] **Body primitives** → typed in `work-block.ts`: `document` · `diff` · `evidence`, plus a
      fallback for kinds this build has never seen. Each covers many tools.
- [x] **Coverage test** → `02-design/system/coverage-test.md`
      Take five work types the brief never mentions (refund in an invoicing system, a support-desk
      reply, a calendar conflict, a contract clause, a Slack escalation). Render each with only the
      primitives above. Any type that needs a fifth primitive means the set is wrong — fix it here,
      not in code.
- [x] **Trust model** → settled in `DECISIONS.md` D-003 and built: `approveAlways` carries a named
      scope, and the hand-off line at the top can be switched off. No settings screen.
- [x] **Interruption model** → `urgency` is set by the assistant, never the person, and grouping is
      the model on a heavy day: twelve pings become one row. See D-008.

**Exit:** I can hand someone the schema and they can render a work type I never designed for.

---

### Phase 2 — Explorations (a graded deliverable — keep the rejects)
> "We want to see the directions you tried and threw out, not only the one you kept."

Each direction gets its own folder under `02-design/explorations/` with a sketch and a
`why-not.md` — what it was good at, what broke it.

- [x] **A · Inbox** — queue of work blocks, triage-first. Scales to 40; can feel like homework.
- [x] **B · Conversation-first** — one thread, work blocks inline. Great for back-and-forth;
      40 items in a scrollback is unmanageable.
- [x] **C · Split** — queue on one side, thread on the other. Answers the brief's own hardest
      question (do approvals and questions live in the same place?) by saying *both, one surface*.
- [x] Pick one. Write the pick and the reasoning in `DECISIONS.md`.

**Exit:** Three real attempts, one chosen, the other two documented as rejected with reasons.

---

### Phase 3 — Final design
- [x] Type scale, spacing, colour → `02-design/final/`
- [x] The 3-item day and the 40-item day, same surface
- [x] **The states that are easy to skip over** — the brief grades these by name:
      empty (nothing waiting) · loading · approved-and-undoable · the AI was wrong ·
      40-item overload · a block whose type the surface has never seen before
- [x] Every screen traceable back to a primitive from Phase 1

**Exit:** The build has nothing left to invent.

---

### Phase 4 — Build
> "Does the surface you built match the surface you designed?"

- [x] Scaffold in `03-build/` — **Vite + React + TypeScript**, hand-written CSS (see D-002)
- [x] Fake data in a single fixtures file, shaped exactly like the Work Block schema
- [x] Renderer registry: `type → component`. Adding a work type = adding one entry, nothing else
- [x] A deliberately unregistered type in the fixtures, to prove the fallback renders
- [x] Both day-shapes reachable in the running app
- [ ] Deploy or record the screen

**Exit:** It runs, and it looks like Phase 3.

---

### Phase 5 — Write-up
> "A few notes on your thinking help, but keep them short."

- [x] `04-writeup/notes.md` — three answers only:
      1. Who I pictured using this
      2. The hardest call I had to make
      3. What I left out
- [x] Tools used
- [x] `DECISIONS.md` cleaned up — the brief says: *make a call, write down what you assumed, keep going*

**Exit:** Package sent.

---

## What I am deliberately not building
Out of scope per the brief: backend, login, settings, navigation to the rest of a product,
real integrations, matching Jarmin's existing product. Anything that grows here should be
recorded in `04-writeup/notes.md` as a choice, not left as a gap.

## Grading rubric, kept close
| | |
|---|---|
| Product sense | A specific person having a specific day; decided what matters and cut the rest |
| Showing the work | Person can tell exactly what the AI did, across **every** kind of work |
| Craft | Type, hierarchy, spacing, and the easy-to-skip states |
| Scalability | Decisions that survive new use cases |
| The build | Built surface matches designed surface |
| Explaining it | Can walk through the calls made |

> Not scored on how much was built, or on how close it lands to the product they already have.
