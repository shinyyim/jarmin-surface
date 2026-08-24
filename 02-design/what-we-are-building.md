---
status: settled
date: 2026-08-23
---

# What we are building

The one document that says exactly what gets built. If somebody read only this,
they could build it.

---

## In one sentence

**One screen: a single column of cards, one card per thing the AI employee needs
from the person, where the work itself is shown in full and the conversation
about it happens inside the card.**

No sidebar. No tabs. No split view. No settings.

---

## The person, and the day

**Summer** owns an eleven-person consultancy. She is not technical and has no
interest in becoming technical. She has had an AI assistant for six weeks. It
drafts her email, keeps Monday.com and a revenue sheet current, and sends her a
summary each morning.

She opens this surface with coffee, around 8:40. If it takes more than a few
minutes she stops opening it.

**The light day.** A normal Wednesday. Three things waiting. She reads each one
properly, approves two, answers one, and closes the tab in four minutes.

**The heavy day.** Tuesday, back from four days at a conference. Thirty-one
things have piled up. Twelve of them are the same spreadsheet gap repeated
twelve times. This is the day that decides whether she keeps using the product.

Both days are in `system/fixtures.ts` and both are reachable in the build.

---

## What is on the screen

### Collapsed — the default

One row per item. Enough to decide whether to look closer, and often enough to
act without looking at all.

```
┌────────────────────────────────────────────────────────┐
│  Reply to Daniel about the Q3 renewal              ▾   │
│  He asked for the revised terms this morning.          │
│  Gmail · 2h ago                    [Send it]  [Edit]   │
└────────────────────────────────────────────────────────┘
```

Every row carries the same five things, whatever the work is:
**what · why you're needed · where it came from · when · what you can do.**

### Expanded — the work itself

The body swaps by kind. Everything around it stays identical.

- **document** — the artefact in full. Recipient, subject, whole body, and the
  message being replied to. Enough to judge whether it should go out.
- **diff** — where it lives, the value today, the value proposed. One row per
  field, because a change can involve several at once.
- **evidence** — the question, and everything the AI already found, so she never
  opens another tool to answer it.
- **fallback** — a kind with no renderer. Shows the envelope, says plainly that
  it can't display this kind of work yet, and still offers the actions.

A reply box sits at the bottom of every expanded card.

### Grouped — the heavy day

Items that are the same thing repeated collapse into one row.

```
▾ Filling March revenue      12 · same pattern    [Approve all]
▾ Pipeline updates            8 · same pattern    [Approve all]
▾ About Daniel                4
  Needs a closer look         3
```

Thirty-one items become about eleven rows. The same component does both days —
grouping is driven by `groupKey`, not by a separate heavy-day layout.

---

## The three jobs, and where each happens

| The brief | Where it lives |
|---|---|
| **1. Approving work** | The card. Approve, edit then approve, or discard. |
| **2. Talking to each other** | The reply box inside the card. Never a separate thread. |
| **3. The employee asking** | The same card, with an `evidence` body. It looks no different structurally — being asked a question and being asked to approve are the same shape of interruption. |

**This is the brief's own named hardest call** — whether approving a draft and
answering a question about a blank cell belong in the same place. Our answer is
yes, *because* the conversation is attached to the work rather than living in its
own room. "Make this warmer" needs no antecedent when it is typed under the draft.

---

## Trust, as a thing you can click

After a run of approvals on similar work, the card offers a second button:

```
[Yes, this time]   [Yes, always — emails to Daniel]
```

The scope is named in the label. "Always" with no named scope is a blank cheque,
not consent. Handed-off scopes stay visible and revocable — one line at the top
of the surface, not a settings screen.

This is the only answer to "the person should trust the AI more over time and
spend less effort reviewing." Nothing else on the screen changes with time.

---

## Every state that must be reachable

The brief grades "the states that are easy to skip over" by name.

| State | What it shows |
|---|---|
| Light day | Three cards, room to breathe |
| Heavy day | Grouping, batch approve |
| Expanded — each of the three bodies | The work in full |
| **Unknown kind** | Fallback renders; page does not break |
| **Just approved** | Confirmation, and undo, for a few seconds |
| **"Yes, always" offered** | The scoped hand-off prompt |
| **Nothing waiting** | Not a blank page — says the assistant is working |
| Loading | Skeleton rows, no layout jump |

---

## What we are explicitly not building

Out of scope per the brief: backend, login, settings, navigation to any other
part of a product, real integrations, and any resemblance to Jarmin's actual
product.

Cut by us, on purpose — these go in the write-up as decisions, not gaps:

| Cut | Why |
|---|---|
| Confidence percentages | Summer cannot act on "87% sure" |
| An autonomy slider | Asking someone non-technical to pick a level hands them the decision |
| Reasoning traces / tool call logs | The brief's first constraint |
| A separate chat panel | The conversation belongs with the work |
| Mobile layout | One surface, one context. Responsive down, not redesigned |
| Search, filters, archive | Nothing here is old enough to need finding |

---

## How each constraint is answered

| Constraint | Answer |
|---|---|
| The person is not technical | No tool names, no args, no states named after engineering. "Gmail", not an integration id |
| Three things some days, forty others | `groupKey` collapsing + batch approve. Same component both days |
| Approvals and questions — same place? | Yes, because conversation is attached to work. See above |
| Trust should grow, effort should shrink | Scoped hand-off after a run of approvals, always reversible |
| Every interruption costs something | `urgency` decides order and what is worth surfacing; most things are `whenever` |
| Must survive a different role and toolset | Renderer registry + fallback. Proven by the coverage test and by an unregistered kind in the fixtures |

---

## Open, and deliberately so

- **Where handed-off scopes are listed.** One line at the top is the current
  intent. If it grows past three or four scopes it needs somewhere else to live —
  but Summer is six weeks in, so it won't.
- **Whether `urgency: 'now'` should do anything visually beyond ordering.** Colour
  on a row is cheap and gets ignored fast. Decide while building, with real rows
  on screen.

Both are the kind of thing that is settled faster by looking at it than by
arguing about it, which is the reason Phase 3 folds into the build.
