---
status: done
date: 2026-08-23
---

# Coverage test

Claiming a design scales is worthless. This is the test that settles it.

Five kinds of work the brief **never mentions** are encoded using only the
primitives in `work-block.ts`. If any of them needs a fourth primitive, the set
is wrong — and it gets fixed here, before a line of UI is written.

The brief's own four cases are excluded on purpose. Passing on the examples you
were handed proves nothing.

---

## 1 · Refund in an invoicing system

> A client was charged twice. The AI wants to refund one of the charges.

```ts
{
  title: 'Refund a duplicate charge to Beacon Labs',
  why: 'The same $2,400 charge went through twice on 14 March.',
  source: 'Stripe',
  urgency: 'today',
  body: {
    kind: 'diff',
    path: ['Beacon Labs', 'Invoice #1043'],
    changes: [
      { field: 'Status',          before: 'Paid',      after: 'Partially refunded' },
      { field: 'Amount refunded', before: null,        after: '$2,400.00' },
    ],
  },
}
```

**Verdict — passes.** A refund is a record change. Two fields move together,
which is exactly why `changes` is a list.

---

## 2 · Support desk reply

> A customer wrote in. The AI drafted the answer.

```ts
{
  title: 'Reply to Priya about the missing export',
  why: "She's asked twice. I'd like you to see this before it goes.",
  source: 'Intercom',
  urgency: 'now',
  body: {
    kind: 'document',
    fields: [
      { label: 'To',     value: 'Priya Raman' },
      { label: 'Ticket', value: '#8812 · open 3 days' },
    ],
    content: 'Hi Priya — sorry about the wait...',
    context: { label: 'Her last message', content: "Still can't export..." },
  },
}
```

**Verdict — passes.** Identical shape to a drafted email. The tool changed; the
primitive did not.

---

## 3 · Calendar conflict

> Two meetings overlap. The AI cannot decide which one gives way.

```ts
{
  title: 'Two meetings booked for Thursday 2pm',
  why: 'I can move one, but not without knowing which matters more.',
  source: 'Google Calendar',
  urgency: 'today',
  body: {
    kind: 'evidence',
    question: 'Which one should I move?',
    found: [
      { label: 'Acme quarterly review', value: 'Booked 3 weeks ago · 6 attendees' },
      { label: 'Coffee with Sam',       value: 'Booked yesterday · 2 attendees' },
      { label: 'Your note last month',  value: '"Never move client calls."' },
    ],
    options: ['Move the coffee', 'Move the review', 'Leave both'],
  },
}
```

**Verdict — passes.** Note the third finding: the AI surfaces the person's own
previous instruction back to them. That is the primitive doing real work.

---

## 4 · Contract clause anomaly

> A clause in a returned contract contradicts what was agreed.

```ts
{
  title: 'The payment terms came back different',
  why: "Their version says 60 days. Every email said 30. I won't sign either way.",
  source: 'DocuSign',
  urgency: 'now',
  body: {
    kind: 'evidence',
    question: 'Which terms are right?',
    found: [
      { label: 'Clause 7.2, their version', long: true,
        value: 'Payment shall be remitted within sixty (60) days of invoice...' },
      { label: 'Your email, 4 March',        value: '"Net 30, same as last year."' },
      { label: 'Last year\'s contract',      value: 'Net 30' },
    ],
    options: ['Net 30 is right', 'Net 60 is right', 'Ask them'],
  },
}
```

**Verdict — passes, after one change.**

This is the case that found a real gap. The clause needs to be quoted in full —
a paragraph, not a one-line value — but it is still *evidence*, not a document
awaiting approval. Nobody is approving the clause; they are answering a question
about it.

Two ways out were considered:

| Option | Rejected because |
|---|---|
| Add a fourth primitive for "quoted source material" | It is not a fourth shape. It is evidence with a long value. |
| Let `body` hold an array of primitives | Turns every renderer into a layout engine to solve one case. |

**Chosen:** add `long?: boolean` to `Field`. Long values render as a block quote
instead of a row. One optional flag, no new primitive, and it pays off elsewhere —
any finding that needs to be read rather than scanned uses it.

---

## 5 · Slack escalation

> Something is going wrong in a shared channel and the AI drafted the response.

```ts
{
  title: 'Draft reply in #acme-launch',
  why: 'They think the launch slipped. It did not — I can correct it.',
  source: 'Slack',
  urgency: 'now',
  body: {
    kind: 'document',
    fields: [
      { label: 'Channel',   value: '#acme-launch' },
      { label: 'Replying to', value: 'Marcus Webb · 11 min ago' },
    ],
    content: "Hi all — the date hasn't moved...",
    context: { label: 'What Marcus said', content: 'Are we slipping to April?' },
  },
}
```

**Verdict — passes.** A Slack message and an email are the same primitive with
different header fields. `fields` being an open list is what makes that true —
had it been typed as `{ to, subject }`, this would have needed a new primitive.

---

## Result

| Work type | Primitive | Passed |
|---|---|---|
| Invoicing refund | `diff` | ✓ |
| Support desk reply | `document` | ✓ |
| Calendar conflict | `evidence` | ✓ |
| Contract clause | `evidence` | ✓ after adding `Field.long` |
| Slack escalation | `document` | ✓ |

Five kinds of work across five tools the brief never mentions, none of which
existed when the primitives were drawn. No fourth primitive needed.

**One change came out of it:** `Field.long`. That is what the test was for —
finding it here cost ten minutes. Finding it in the build would have cost a
component.

## What this does not prove

Only that the *data* fits. Whether each renders well is a craft question settled
in Phase 3, not here. And a genuinely new shape will eventually appear — which is
why `UnknownBody` and the fallback renderer exist, and why the fixtures carry a
deliberately unregistered kind.
