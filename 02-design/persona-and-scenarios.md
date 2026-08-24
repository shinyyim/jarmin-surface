---
status: settled
date: 2026-08-23
supersedes: scenarios.md
---

# Persona & scenarios

One person, one AI employee, seven moments. Everything in the design must trace back to a line here.

---

## The person — Summer

| | |
|---|---|
| Who | Owner of an eleven-person consultancy. Runs client relationships herself. |
| Tech | Not technical, not interested in becoming technical. Uses Gmail, Monday.com, a revenue sheet — because clients and staff do. |
| The assistant | Six weeks in. Drafts her email, keeps Monday and the sheet current, sends a morning summary and a Friday report. |
| Rhythm | Checks the surface with coffee at 8:40, again from the phone between meetings, and once before leaving. |
| Tolerance | A few minutes per visit. If a visit gets long or asks her to think about *how the assistant works*, she stops opening it. |
| What she wants | To know nothing went out wrong, and to not be the bottleneck. |
| What she fears | Approving something she didn't actually read. Being asked forty things. Losing the thread with Daniel. |

**Not encoded anywhere in the build.** The surface never learns her role or the assistant's; swap the
fixtures for a support-desk day and nothing else changes.

---

## The AI employee

**Definition.** A colleague, not a tool: it runs on its own in the background, does real work in
the person's actual tools, and meets the person only on this surface — when it needs a sign-off,
is stuck, or is told to do something. The definition is role-independent; the executive assistant
below is one instance of it.

### Whose employee, and what job

**The split.** Judgement and expertise are Summer's — the consulting itself, whether to take a
client, what to charge, what to say when it matters. Everything administrative around that is
the AI employee's. The surface exists because admin keeps running into moments that need
judgement, and this is where those moments are handed over.

**The job.** Summer's company sells advice and projects to clients. Every client runs through the
same loop, and every step of it sheds admin:

```
enquiry → proposal → contract → kickoff → delivery → invoice → payment → renewal → (again)
```

The AI employee runs that loop's admin for all eleven clients at once — the role a small
consultancy would hire first. It does not do the consulting, decide whether to take a client,
set a price, or move money.

| Loop step | Admin it owns | In the fixtures |
|---|---|---|
| Enquiry | Reply, book a call, create the deal in Monday | Halden, the new prospect (S4) |
| Contract | Check returned terms against what was agreed | Net 30 vs 60 (coverage test) |
| Kickoff · delivery | Schedule, file notes, chase actions | Kickoff-date email · which client was the meeting |
| Invoice · payment | Raise invoices, match payments, flag mismatches | Payment numbers don't line up (S2) |
| Renewal | Watch the date, draft terms, update the board | Daniel's Q3 renewal · Acme → Closed won |
| Always | Keep Monday and the revenue sheet true; 7:30 summary; Friday report; month-end close | March revenue cells · pipeline updates |

**Employee card**

| | |
|---|---|
| Works for | Summer alone. One-to-one — no team, no other approvers |
| Tenure | Six weeks. Knows her clients, tone and past instructions; not yet trusted with everything. Hand-offs are just beginning |
| Has access to | Gmail (draft and send as Summer) · Monday.com Sales Pipeline · the revenue sheet · calendar · meeting transcripts |
| Has no access to | Banking, payment execution, hiring |
| Knows | The client list, last year's terms, what Summer said before ("never move client calls") |
| Doesn't know | People not yet in any system; the priorities in Summer's head |
| Name | None. Speaks in the first person; the brief calls it "the AI employee" and so do we. A name makes a character, and a character makes mistakes personal |
| Voice | Short. Fact first, one line of reason. No apology, no emoji. Careful, not servile |
| Measured on | Nothing wrong goes out · board and sheet always match reality · Summer handles fewer things each week |

None of this card is encoded in the build. It lives in fixture comments only.

### What it does — the three bands

The work splits into three bands. The band decides whether the person ever sees it.

| Band | Work | On the surface |
|---|---|---|
| **Does alone** | Reads incoming mail, calendar, Monday, the sheet · keeps notes and transcripts filed · sends the 7:30 daily summary and the Friday report · moves obviously-finished items · answers routine internal questions · anything inside a handed-off scope | Only in the top line, in passing: *"I sent the daily report at 7:30"* |
| **Does, then asks before it goes out** | Drafts client emails and replies · changes to Monday items and sheet cells · adds or edits records · refunds, invoices, anything with money · anything leaving the company | A capsule with the work in full and **approve · edit · discard** |
| **Cannot decide, so asks** | Two sources disagree (payment numbers, meeting client) · a blank cell it would have to guess · a Monday item that looks done but nobody moved · a contract term that changed · an instruction it doesn't understand | A capsule with the question and everything it already found, plus answer chips |

Where a piece of work sits is not fixed. It moves **down** a band as the person hands off scopes
(S5), and moves **up** a band when something unusual happens inside a scope — first invoice over
$50k, a recipient it has never emailed, a change touching more than one record.

### What it never does
- Sends anything external without sign-off unless the scope was handed over by name.
- Guesses when sources conflict.
- Deletes, or changes money, on its own.
- Explains itself in terms of how it works — no confidence, no steps, no tool names as such.

### How it behaves on the surface

- Speaks first. Every visit opens with one line from it.
- Asks only when it must: work that needs sign-off, or a question it can't answer alone.
- Sorts before she arrives: groups repeats, orders by urgency, says what it did in the top line.
- Shows the work in full — never a summary of an email, never a confidence number.
- Rewrites in place when pushed back on. No thread, no versions.
- Does more on its own as she hands scopes over, and still flags anything unusual inside a scope.

---

## Where she is when she uses it

| Shape | When | What she does there |
|---|---|---|
| **Phone** (390) | Commute, between meetings, evening | Clear a light day. Answer a question. Hand off a scope. Give an instruction. |
| **Desktop** (1280) | 8:40 with coffee; the heavy day | Read drafts in full. Review diffs. Clear a backlog with the keyboard. |

Same surface, same column, same components. The phone is the original shape; the desktop is the
one with room to read.

---

## Scenarios

Each: **where · what she sees · what she does · what the screen does · why it matters.**
All fixtures live in `system/fixtures.ts`; S1 and S2 are the two days already there.

### S1 · Light Wednesday — three things · phone, 8:20 on the train

**Sees.** The assistant's line: *"Morning. Three things need you — one before Daniel's board meets Thursday."*
Three capsules. The first is a touch larger.

**Does.** Opens the first: To, Subject, the email in full, Daniel's message quoted under it. Two lines in, it's fine. **Send it.**
Second: Negotiating → Closed won, close date empty → today. **Update it** without opening.
Third: the question, three findings, three chips. **Meridian.**

**Screen.** Each capsule shrinks to one line (*Sent to Daniel · Undo*), the next slides up, the line fades after six seconds. Then: *"That's everything. Next I'm drafting Friday's report."*

**Why.** Four minutes, one thumb. This is the default day and it has to feel like nothing.

### S2 · Tuesday after the conference — thirty-one things · desktop, 8:40

**Sees.** *"Welcome back. Thirty-one things came in while you were away. I've grouped what I could — twelve are the same gap in the March sheet, eight are routine pipeline updates. Four are about Daniel, and three I'd like you to look at properly."*
Eleven shapes, not thirty-one: a **stack** (12 · same pattern, two sample rows, **Approve all 12** · Look), a stack (8), a **bundle** (*About Daniel* · 4, no batch button), three singles — the first with a left rule — and one capsule that says plainly *"I can't show this kind of work here yet"* with Approve · Discard still live.

**Does.** Reads the two sample rows. **Approve all 12.** Same for the eight. Opens the bundle; four capsules unfold; sends two, approves one, types an answer. Reads the three singles properly; on the payment one, picks *One charge*. Approves the unknown one — she knows the PO.

**Screen.** One undo line per batch. Top line ends at *"That's everything. I'll send the weekly report at 9."*

**Why.** Nine actions, under ten minutes. This is the day that decides whether she keeps the product.

### S3 · Pushing back · desktop

Daniel's draft reads stiff. Under it, in the reply box every capsule has, she types *too formal, and mention Thursday's board meeting.*
A dot pulses. The assistant: *"Sure — warmer, and it now references Thursday."* The body **rewrites in place**. **Send it** hasn't moved.

**Why.** No thread, no "which email?", no pane switch. The conversation is attached to the work.

### S4 · The assistant was wrong · phone

The Tuesday-meeting question — none of the chips is right. She types *it was Halden, new prospect, not a client yet.*
*"Got it. I'll add Halden as a prospect in Monday and file the transcript under them."* Capsule collapses: *Told it: Halden · Undo.*
Tomorrow's briefing has a new capsule: *Add Halden as a prospect* — a two-field diff.

**Why.** It did what she said, and still showed her before touching a record.

### S5 · Handing trust over, and taking it back · phone

Sixth unchanged email to Daniel in a row. The buttons read: **Send it · Send — and handle emails to Daniel from now on · Edit.** She picks the second.
A quiet line appears under the greeting: *Handling on my own: emails to Daniel ⓧ*.
Three weeks later a capsule appears anyway: *"I sent Daniel the revised SOW — flagging it because it's the first one over $50k."*
She taps ⓧ one day; the next Daniel email is a normal capsule.

**Why.** Trust is a button with its scope in the label, and a line that can be removed. No settings.

### S6 · Giving an instruction · phone, walking out of a meeting

Nothing is waiting. The composer capsule at the bottom is the only thing on screen besides the top line. She types *tell Daniel we're moving kickoff to the 9th, and update the board.*
The capsule shows the dot, then: *"Drafted the email and the board change — both are above."* Two capsules appear: a document, a diff. She sends one, approves the other.

**Why.** This is the brief's second job — she starts the conversation — and it lands as the same kind of work as everything else.

### S7 · Nothing waiting · either

*"Nothing needs you this morning. I sent the daily report at 7:30, moved two items to done in Monday, and I'm drafting Friday's report next."*
Below it, only the composer.

**Why.** Not a blank page. The assistant is present, with nothing to ask.

---

## What the scenarios lock in

| Decision | Comes from |
|---|---|
| The assistant's line at the top is the interface; capsules are what it is talking about | S1, S2, S7 |
| One object through every state: closed → open → editing → done-line → gone | S1, S3 |
| Stacks and bundles, narrated in the top line, not filters | S2 |
| Reply box inside the work; pushback rewrites in place | S3, S4 |
| Trust = scoped button + removable line; flagged items still surface inside a scope | S5 |
| A composer capsule at the bottom for instructions not about a waiting item | S6, S7 |
| Unknown kinds render in plain language and stay actionable | S2 |
| Phone first for acting; desktop for reading; same components | all |

## Grading map

| Criterion | Scenario that proves it |
|---|---|
| Product sense | Summer's Wednesday (S1) and Tuesday (S2) |
| Showing the work | S1 email in full · S2 diffs and evidence · S2 unknown kind |
| Craft — easy-to-skip states | S1 done-line + undo · S2 loading/grouping · S7 empty · S2 unknown |
| Scalability | S2 unknown kind · S6 instruction producing new work · fixtures never name the role |
| Build matches design | Same fixtures at 390 and 1280 |
| Explaining it | This document and `DECISIONS.md` |
