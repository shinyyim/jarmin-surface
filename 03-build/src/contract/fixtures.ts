/**
 * FIXTURES — fake data, shaped exactly like the contract in `work-block.ts`.
 *
 * Two days for the same person, because the brief says both have to feel
 * manageable: a light day with three things, and a heavy day with forty.
 *
 * The person: the owner of a small consultancy. Their AI employee is an
 * executive assistant. None of that is encoded anywhere below — the surface
 * never learns what role it is serving, which is the point.
 *
 * Note `heavyDay` carries one block with an unregistered `kind`. It is there
 * deliberately, to prove the fallback renders rather than the surface breaking.
 */

import type { WorkBlock } from './work-block'

// ---------------------------------------------------------------------------
// The light day — three things waiting
// ---------------------------------------------------------------------------

export const lightDay: WorkBlock[] = [
  {
    id: 'wb-001',
    title: 'Reply to Daniel about the Q3 renewal',
    why: "He asked for the revised terms this morning. I'd like a look before it goes.",
    source: 'Gmail',
    urgency: 'now',
    raisedAt: '2026-08-23T08:12:00Z',
    body: {
      kind: 'document',
      fields: [
        { label: 'To', value: 'daniel@acme.com' },
        { label: 'Subject', value: 'Re: Q3 renewal terms' },
      ],
      content: [
        'Hi Daniel,',
        '',
        'Happy to proceed on the terms you outlined. To confirm: same scope as',
        'last year, Net 30, starting 1 October. I have attached the revised',
        'schedule.',
        '',
        'Anything else you need from me before we sign?',
      ].join('\n'),
      context: {
        label: 'What Daniel sent',
        content:
          'Morning — can you send over the revised terms? Board meets Thursday.',
      },
    },
    actions: [
      { kind: 'approve', label: 'Send it' },
      // Offered because five emails to this recipient have been approved
      // unchanged in a row. Scope is named, and it is reversible.
      { kind: 'approveAlways', scope: 'emails to Daniel', after: 5 },
      { kind: 'edit' },
      { kind: 'discard' },
    ],
  },

  {
    id: 'wb-002',
    title: 'Move the Acme deal to Closed won',
    why: 'Daniel signed this morning, so the board is out of date.',
    source: 'Monday.com',
    urgency: 'today',
    raisedAt: '2026-08-23T08:40:00Z',
    body: {
      kind: 'diff',
      path: ['Sales Pipeline', 'Acme Corp — Q3 renewal'],
      changes: [
        { field: 'Status', before: 'Negotiating', after: 'Closed won' },
        { field: 'Close date', before: null, after: '23 Aug 2026' },
      ],
    },
    actions: [
      { kind: 'approve', label: 'Update it' },
      { kind: 'edit' },
      { kind: 'discard' },
    ],
  },

  {
    id: 'wb-003',
    title: "I can't tell which client Tuesday's meeting was with",
    why: 'The title, the invite and the transcript each name a different one.',
    source: 'Google Calendar',
    urgency: 'whenever',
    raisedAt: '2026-08-23T09:05:00Z',
    body: {
      kind: 'evidence',
      question: 'Which client was this?',
      found: [
        { label: 'Calendar title', value: 'Sync meeting' },
        { label: 'Invite description', value: 'Acme onboarding follow-up' },
        { label: 'Named in the transcript', value: 'Beacon Labs — 3 times' },
        { label: 'Attendee domains', value: '2 × @beaconlabs.io, 1 × yours' },
      ],
      options: ['Beacon Labs', 'Acme'],
    },
    actions: [{ kind: 'answer' }, { kind: 'discard' }],
  },
]

// ---------------------------------------------------------------------------
// The heavy day — forty things, most of them the same thing forty times
// ---------------------------------------------------------------------------

/** Twelve blank cells in one sheet. One decision, not twelve. */
const revenueCells: WorkBlock[] = [
  ['Beacon Labs', 47, '4,200.00'],
  ['Acme Corp', 48, '12,000.00'],
  ['Corvid Studio', 49, '2,750.00'],
  ['Meridian Health', 50, '8,400.00'],
  ['Northwind', 51, '3,100.00'],
  ['Palegrove', 52, '5,600.00'],
  ['Quarry & Co', 53, '1,950.00'],
  ['Rothwell', 54, '7,200.00'],
  ['Saltmarsh', 55, '2,400.00'],
  ['Tenby Partners', 56, '6,800.00'],
  ['Umbral', 57, '3,350.00'],
  ['Vantage Rowe', 58, '9,100.00'],
].map(([client, row, amount], i) => ({
  id: `wb-cell-${i + 1}`,
  title: `Fill March revenue for ${client}`,
  why: 'The invoice cleared but the sheet was never updated.',
  source: 'the 2026 revenue sheet',
  urgency: 'whenever' as const,
  raisedAt: '2026-08-23T07:30:00Z',
  groupKey: 'march-revenue-cells',
  body: {
    kind: 'diff' as const,
    path: ['2026 Revenue', 'March', `Row ${row}`],
    changes: [{ field: 'Amount', before: null, after: `$${amount}` }],
  },
  actions: [{ kind: 'approve' as const }, { kind: 'edit' as const }, { kind: 'discard' as const }],
}))

/** Four things about the same person, worth reading together. */
const danielThread: WorkBlock[] = [
  {
    id: 'wb-d1',
    title: 'Reply to Daniel about the kickoff date',
    why: 'He suggested the 4th. Your calendar is clear.',
    source: 'Gmail',
    urgency: 'today',
    raisedAt: '2026-08-23T07:50:00Z',
    groupKey: 'daniel',
    body: {
      kind: 'document',
      fields: [
        { label: 'To', value: 'daniel@acme.com' },
        { label: 'Subject', value: 'Re: Kickoff' },
      ],
      content: 'The 4th works. I will send an invite this afternoon.',
      context: { label: 'What Daniel sent', content: 'Does the 4th work for kickoff?' },
    },
    actions: [
      { kind: 'approve', label: 'Send it' },
      { kind: 'approveAlways', scope: 'emails to Daniel', after: 5 },
      { kind: 'edit' },
      { kind: 'discard' },
    ],
  },
  {
    id: 'wb-d2',
    title: 'Add Daniel as the Acme primary contact',
    why: 'He has been signing, but the record still lists his predecessor.',
    source: 'Monday.com',
    urgency: 'whenever',
    raisedAt: '2026-08-23T07:52:00Z',
    groupKey: 'daniel',
    body: {
      kind: 'diff',
      path: ['Clients', 'Acme Corp'],
      changes: [{ field: 'Primary contact', before: 'Ruth Alderman', after: 'Daniel Voss' },
                { field: 'Email', before: 'ruth@acme.com', after: 'daniel@acme.com' }],
    },
    actions: [{ kind: 'approve' }, { kind: 'edit' }, { kind: 'discard' }],
  },
  {
    id: 'wb-d3',
    title: 'Send Daniel the signed copy',
    why: 'He asked for it twice and I have not sent it.',
    source: 'Gmail',
    urgency: 'now',
    raisedAt: '2026-08-23T08:02:00Z',
    groupKey: 'daniel',
    body: {
      kind: 'document',
      fields: [
        { label: 'To', value: 'daniel@acme.com' },
        { label: 'Subject', value: 'Signed agreement — Acme Q3' },
        { label: 'Attached', value: 'acme-q3-signed.pdf' },
      ],
      content: 'Attaching the countersigned copy. Thanks for moving quickly on this.',
    },
    actions: [{ kind: 'approve', label: 'Send it' }, { kind: 'edit' }, { kind: 'discard' }],
  },
  {
    id: 'wb-d4',
    title: 'Daniel asked about next year — I did not answer',
    why: 'Pricing is your call, not mine.',
    source: 'Gmail',
    urgency: 'whenever',
    raisedAt: '2026-08-23T08:04:00Z',
    groupKey: 'daniel',
    body: {
      kind: 'evidence',
      question: 'What should I tell him about 2027 pricing?',
      found: [
        { label: 'What he asked', long: true,
          value: 'Any sense of what 2027 looks like? Trying to get ahead of budget season.' },
        { label: 'This year', value: '$12,000 · flat since 2024' },
        { label: 'Your note in June', value: '"Raise Acme next cycle."' },
      ],
    },
    actions: [{ kind: 'answer' }, { kind: 'discard' }],
  },
]

/** The ones that actually need thinking about. */
const needsAttention: WorkBlock[] = [
  {
    id: 'wb-p1',
    title: "This week's payment numbers don't line up",
    why: 'Stripe and the old email receipts disagree, and one charge appears twice.',
    source: 'Stripe',
    urgency: 'now',
    raisedAt: '2026-08-23T06:40:00Z',
    body: {
      kind: 'evidence',
      question: 'Which figure should the report use?',
      found: [
        { label: 'Stripe, week of 17 Aug', value: '$38,400.00' },
        { label: 'Email receipts, same week', value: '$41,000.00' },
        { label: 'The gap', value: '$2,600.00' },
        { label: 'Duplicate found', long: true,
          value: 'Beacon Labs, $2,400.00, 14 March — charged twice, seven minutes apart. Neither has been refunded.' },
      ],
      options: ['Use Stripe', 'Use the receipts', 'Hold the report'],
    },
    actions: [{ kind: 'answer' }, { kind: 'discard' }],
  },
  {
    id: 'wb-p2',
    title: 'Meridian looks finished but nobody moved it',
    why: 'Every task is done and the invoice is paid. I will guess wrong if you say nothing.',
    source: 'Monday.com',
    urgency: 'whenever',
    raisedAt: '2026-08-23T07:10:00Z',
    body: {
      kind: 'diff',
      path: ['Projects', 'Meridian Health — brand refresh'],
      changes: [{ field: 'Status', before: 'In progress', after: 'Done' }],
    },
    actions: [{ kind: 'approve' }, { kind: 'edit' }, { kind: 'discard' }],
  },
  {
    id: 'wb-p3',
    title: 'Reply to Corvid about the invoice they queried',
    why: 'They think they were billed for two rounds. They were billed for three.',
    source: 'Gmail',
    urgency: 'today',
    raisedAt: '2026-08-23T07:20:00Z',
    body: {
      kind: 'document',
      fields: [
        { label: 'To', value: 'accounts@corvidstudio.com' },
        { label: 'Subject', value: 'Re: Invoice #1051' },
      ],
      content:
        'Thanks for flagging — the invoice covers three rounds of revisions, not two. I have attached the breakdown.',
      context: {
        label: 'What they sent',
        content: 'We only signed off two rounds — can you check this?',
      },
    },
    actions: [{ kind: 'approve', label: 'Send it' }, { kind: 'edit' }, { kind: 'discard' }],
  },
]

/**
 * DELIBERATELY UNREGISTERED.
 *
 * `kind: 'approval_chain'` has no renderer. The surface must still show the
 * title, the reason, where it came from and the actions — everything the
 * envelope carries — and simply not draw a body it does not understand.
 *
 * This is the scalability claim under test. If this row breaks the page, the
 * design failed the constraint it was built for.
 */
const unknownWork: WorkBlock = {
  id: 'wb-unknown-1',
  title: 'Northwind needs a second approver on the PO',
  why: 'Their finance system wants someone else to sign as well. I cannot be that person.',
  source: 'Coupa',
  urgency: 'today',
  raisedAt: '2026-08-23T07:45:00Z',
  body: {
    kind: 'approval_chain',
    data: { po: 'PO-88421', amount: '$18,000.00', approvers: ['you', 'unassigned'] },
  },
  actions: [{ kind: 'approve' }, { kind: 'discard' }],
}

/** Eight more record updates, to get the day to a realistic weight. */
const routineUpdates: WorkBlock[] = [
  ['Northwind', 'Stage', 'Proposal sent', 'Contract out'],
  ['Palegrove', 'Owner', 'Unassigned', 'You'],
  ['Quarry & Co', 'Renewal date', null, '1 Nov 2026'],
  ['Rothwell', 'Stage', 'Discovery', 'Proposal sent'],
  ['Saltmarsh', 'Invoice status', 'Sent', 'Paid'],
  ['Tenby Partners', 'Stage', 'Contract out', 'Closed won'],
  ['Umbral', 'Owner', 'Unassigned', 'You'],
  ['Vantage Rowe', 'Renewal date', null, '15 Dec 2026'],
].map(([client, field, before, after], i) => ({
  id: `wb-routine-${i + 1}`,
  title: `Update ${(field as string).toLowerCase()} for ${client}`,
  why: before === null
    ? 'This has been empty since the deal was created.'
    : 'The record is behind what actually happened.',
  source: 'Monday.com',
  urgency: 'whenever' as const,
  raisedAt: '2026-08-23T07:35:00Z',
  groupKey: 'pipeline-updates',
  body: {
    kind: 'diff' as const,
    path: ['Sales Pipeline', client as string],
    changes: [{ field: field as string, before: before as string | null, after: after as string }],
  },
  actions: [{ kind: 'approve' as const }, { kind: 'edit' as const }, { kind: 'discard' as const }],
}))

export const heavyDay: WorkBlock[] = [
  ...needsAttention,   //  3 — read one at a time
  ...danielThread,     //  4 — one person, one context
  ...revenueCells,     // 12 — one decision, twelve rows
  ...routineUpdates,   //  8 — same again
  unknownWork,         //  1 — no renderer exists
  ...lightDay,         //  3 — carried over from the light day
]
// 31 blocks; the twelve cells and eight updates collapse to two rows, so the
// person sees roughly eleven things, not thirty-one. That is the whole argument.

// ---------------------------------------------------------------------------

export const days = { light: lightDay, heavy: heavyDay }
