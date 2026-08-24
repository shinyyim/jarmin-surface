---
status: superseded by the build
note: the zones and card anatomy still hold; the visual language is direction F
date: 2026-08-23
---

# UX structure

The skeleton before any visual decision. Every box here maps to a field in `work-block.ts`.

---

## 1 · The page

One page, one column, no chrome. Reads top to bottom; done when the column is empty.

```
┌──────────────────────────────────────────────────────────────┐
│  Wednesday · 3 things need you                    [light/heavy]│  ← A. header
│  Handling on its own: emails to Daniel · pipeline updates  ⓧ  │  ← B. hand-off line
├──────────────────────────────────────────────────────────────┤
│  ▌ Reply to Daniel about the Q3 renewal                   ▾   │  ← C. card (now)
│    He asked for the revised terms this morning.               │
│    Gmail · 2h ago                          [Send it] [Edit]    │
├──────────────────────────────────────────────────────────────┤
│    Move the Acme deal to Closed won                        ▾   │  ← C. card (today)
│    Daniel signed this morning, so the board is out of date.   │
│    Monday.com · 1h ago                   [Update it] [Edit]    │
├──────────────────────────────────────────────────────────────┤
│    I can't tell which client Tuesday's meeting was with    ▾   │  ← C. card (whenever)
│    Three sources say three different things.                  │
│    Calendar · 3h ago                                 [Answer]  │
├──────────────────────────────────────────────────────────────┤
│  Nothing else. Next I'm drafting Friday's report.             │  ← D. floor
└──────────────────────────────────────────────────────────────┘
```

| Zone | Content | Rule |
|---|---|---|
| **A. Header** | Day name + count in words. Scenario switcher (grader only). | Count is the only number on the page. |
| **B. Hand-off line** | Scopes the person has said "always" to, each with a stop. Hidden when empty. | The whole trust model, one line. Never a settings page. |
| **C. Cards** | One per Work Block, ordered `now` → `today` → `whenever`, newest first within a band. | No section headers between bands — `now` gets a left rule, nothing else changes. |
| **D. Floor** | What the AI does next. Appears when the column is empty, and always at the bottom. | The empty state is not blank; it is the floor with nothing above it. |

Width: single column, max ~680px, centred. Reading width, not app width.

---

## 2 · The card — collapsed

Five things, same five for every kind of work. The person should usually be able to act here.

```
┌──────────────────────────────────────────────────────────────┐
│ ▌ TITLE                                                   ▾  │  what        (title)
│   WHY — one sentence, the AI's reason for needing you        │  why you     (why)
│   SOURCE · TIME                    [positive]  [secondary]   │  where·when  (source, raisedAt)
└──────────────────────────────────────────────────────────────┘                (actions[0..1])
```

- Left rule (▌) only for `urgency: now`.
- Positive action label comes from the block ("Send it", "Update it", "Answer"); secondary is Edit, or nothing for questions.
- Discard is never shown collapsed — throwing work away deserves a look first.
- Whole row is the expand target; buttons stop propagation.

---

## 3 · The card — expanded

Same envelope on top, body in the middle, actions and reply at the bottom. **Only the body changes.**

```
┌──────────────────────────────────────────────────────────────┐
│ ▌ TITLE                                                   ▴  │
│   WHY                                                        │
│   SOURCE · TIME                                              │
│ ┌──────────────────────────────────────────────────────────┐ │
│ │                                                          │ │
│ │                     B O D Y                              │ │  ← swapped by body.kind
│ │                                                          │ │
│ └──────────────────────────────────────────────────────────┘ │
│   [Send it]  [Yes, always — emails to Daniel]  [Edit]  Discard│  ← all actions
│ ┌──────────────────────────────────────────────────────────┐ │
│ │  Tell it something…                                      │ │  ← reply box, every card
│ └──────────────────────────────────────────────────────────┘ │
└──────────────────────────────────────────────────────────────┘
```

### 3a. `document` — an artefact to judge
```
│ To        daniel@acme.com                                     │  fields[]
│ Subject   Re: Q3 renewal terms                                │
│ ─────────────────────────────────────────────────────────────│
│ Hi Daniel,                                                    │  content — full, never truncated,
│ Happy to proceed on the terms you outlined…                   │  set in the "work" typeface
│ ─────────────────────────────────────────────────────────────│
│ ▎ What Daniel sent                                            │  context — quoted, muted,
│ ▎ Morning — can you send over the revised terms?              │  collapsible after 4 lines
```

### 3b. `diff` — a record change
```
│ Sales Pipeline › Acme Corp — Q3 renewal                       │  path, as breadcrumb
│                                                               │
│ Status        Negotiating      →   Closed won                 │  changes[] — one row each
│ Close date    empty            →   23 Aug 2026                │  before muted, after strong,
│                                                               │  null rendered as "empty"
```

### 3c. `evidence` — a question, with everything already found
```
│ Which client was this meeting with?                           │  question, largest text in body
│                                                               │
│ Calendar title     "Sync — Northwind"                         │  found[] — label/value rows
│ Invite body        mentions Meridian twice                    │
│ Transcript         ▎ "…as we discussed with the Meridian team │  long: true → block quote
│                    ▎ last Thursday…"                          │
│                                                               │
│ ( Northwind )  ( Meridian )  ( Neither )                      │  options[] → answer chips,
│                                                               │  reply box handles "other"
```

### 3d. `fallback` — a kind this build has never seen
```
│ I can't show this kind of work here yet.                      │  plain sentence, no jargon
│ Northwind PO · needs a second approver · $18,400              │  best-effort one-line from data
│                                                               │
│ [Approve]  Discard                                            │  actions still work
```

---

## 4 · The card — transient states

| State | What changes | Leaves how |
|---|---|---|
| **Editing** | Body becomes editable in place (document content; diff `after` cells). Positive action reads "Send edited". | Save → approved flow. Cancel → back. |
| **Approved** | Card collapses to one line: "Sent to Daniel · Undo", then fades after 6 s. Next card takes focus. | Undo → restores in place. |
| **Discarded** | Same one-line strip: "Thrown away · Undo". | Same. |
| **Answered** | Chip highlights, card collapses with "Told it: Meridian · Undo". | Same. |
| **Replied** | Message appears under the reply box; ~800 ms later the AI's reply (scripted). Card stays open. | Person acts or collapses. |
| **Hand-off offered** | `approveAlways` renders as a second positive button with the scope in the label. Appears only on expand. | Click → hand-off line gains a scope; card approves. |

---

## 5 · The heavy day — grouping

Same page, same card. `groupKey` folds siblings into one **group row**.

```
┌──────────────────────────────────────────────────────────────┐
│ ▾ Filling March revenue          12 · same pattern            │
│   e.g. Beacon Labs  empty → $4,200  ·  Corvid  empty → $1,850 │  ← 2-item sample, so
│   the March revenue sheet          [Approve all 12]  [Look]   │    "Approve all" is informed
└──────────────────────────────────────────────────────────────┘
```

- Group rows sit where their most urgent child would.
- **Look** expands to the 12 child cards, each individually actionable; the group row stays as a sticky header with the batch action.
- Approve all → one undo strip for the batch.
- Groups form only for `whenever` and `today`; `now` items never fold.
- Non-pattern groups (e.g. everything about Daniel) show count without "same pattern" and without a batch action — they are a reading aid, not a batch.

31 items → ~11 rows. The person clears the day in under ten actions.

---

## 6 · Flows

**Light day (4 minutes)**
open → read card 1 → Send it → strip, focus moves → read card 2 → Update it → card 3 → tap "Meridian" → floor shows "Nothing else" → close.

**Heavy day (under 10 actions)**
open → hand-off line shows what's already handled → group "Filling March revenue" · sample looks right → Approve all → group "Pipeline updates" → Approve all → "About Daniel" ▾ → 4 cards, act on each → 3 singles → floor.

**Pushing back**
expand → type "too formal, and mention the Thursday board meeting" → AI reply + revised body appears in the same card → Send it.

**The AI was wrong**
expand evidence card → none of the chips is right → type the real answer → AI: "Got it — I'll update the calendar and the transcript note." → card collapses as answered.

**Taking trust back**
hand-off line → ⓧ on "emails to Daniel" → line updates → next Daniel email appears as a normal card again.

---

## 7 · Keyboard

`J / K` next / previous · `Enter` expand / collapse · `A` positive action · `E` edit · `X` discard · `R` focus reply · `U` undo last · `Esc` collapse / cancel edit · `1–9` pick an answer chip.

Focus ring is always visible on the card, never only on a button.

---

## 8 · What is deliberately absent

No sidebar, tabs, filters, search, archive, badges, avatars, timestamps as dates, confidence scores, tool logs, autonomy slider, settings, notifications panel, or a separate chat. Each removal is a decision recorded in `what-we-are-building.md`.
