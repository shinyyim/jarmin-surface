/**
 * WORK BLOCK — the shape of one thing waiting for the person.
 *
 * Everything on this surface is a Work Block, whatever tool it came from.
 * The envelope never changes; only `body` does. That is what lets a CRM, an
 * invoicing system, or a tool nobody has connected yet appear here without a
 * new screen being designed for it.
 *
 * This file is the contract between the design and the build. The build
 * imports it unchanged.
 */

// ---------------------------------------------------------------------------
// The envelope — identical for every kind of work
// ---------------------------------------------------------------------------

export type WorkBlock = {
  id: string

  /** One line, in the person's own words. Never the name of a tool call. */
  title: string

  /**
   * Why this needs a person — not how the AI arrived here. "I can't tell which
   * client this meeting was with", never "entity resolution returned 2 candidates".
   */
  why: string

  /** Where the work lives, named as a place: "Gmail", "the March revenue sheet". */
  source: string

  /**
   * Drives ordering and whether this is worth interrupting for. Every
   * interruption costs the person something, so most things are 'whenever'.
   */
  urgency: Urgency

  /** ISO timestamp. Shown relatively ("2h ago"), never as a raw date. */
  raisedAt: string

  /**
   * Items sharing a groupKey collapse into one row on a heavy day and can be
   * approved together. Absent means the item stands alone.
   */
  groupKey?: string

  /** The part that changes per kind of work. */
  body: Body

  /** What the person can do. Order is the order they are shown in. */
  actions: Action[]
}

export type Urgency = 'now' | 'today' | 'whenever'

// ---------------------------------------------------------------------------
// The primitives — three shapes cover every kind of work we have found
// ---------------------------------------------------------------------------

export type Body = DocumentBody | DiffBody | EvidenceBody | UnknownBody

/**
 * DOCUMENT — the AI produced an artefact and the person has to judge it before
 * it goes out. Drafted email, report, message, support reply, contract redline.
 */
export type DocumentBody = {
  kind: 'document'

  /** Header pairs shown above the content: To, Subject, Channel, Recipient… */
  fields: Field[]

  /** The artefact in full. Never truncated — a summary can't be approved. */
  content: string

  /** What this responds to, so the person doesn't open another tool. */
  context?: {
    label: string
    content: string
  }
}

/**
 * DIFF — the AI wants to change a record. Monday item, spreadsheet cell, CRM
 * field, invoice line, ticket priority. One primitive, every record system.
 *
 * `changes` is a list because the brief is explicit that a change may be simple
 * or complex — several columns moving at once is still one decision.
 */
export type DiffBody = {
  kind: 'diff'

  /** Where this lives, outermost first: ["Sales Pipeline", "Acme Corp"]. */
  path: string[]

  changes: Change[]
}

export type Change = {
  /** The column, cell or field name as the person sees it in that tool. */
  field: string

  /** null means the value is currently empty — render as "empty", not "null". */
  before: string | null

  after: string
}

/**
 * EVIDENCE — no work attached. The AI is stuck and needs an answer. Everything
 * it already found goes here so the person never has to go looking themselves.
 */
export type EvidenceBody = {
  kind: 'evidence'

  /** The question, asked plainly. */
  question: string

  /** Everything already found. This is the whole point of the primitive. */
  found: Field[]

  /**
   * Candidates the AI has narrowed to, rendered as answer buttons. Omit when
   * the answer is open-ended — the reply box is always there anyway.
   */
  options?: string[]
}

/**
 * UNKNOWN — a body type this build has never seen. The surface must still be
 * useful: title, why, source, evidence-free actions. It degrades, it does not
 * break. Proven in the fixtures with a deliberately unregistered kind.
 */
export type UnknownBody = {
  kind: string
  data: unknown
}

// ---------------------------------------------------------------------------
// Field — shared by Document headers and Evidence findings
// ---------------------------------------------------------------------------

export type Field = {
  label: string
  value: string

  /**
   * Long values render as a block rather than an inline row. Added after the
   * coverage test: a contract-clause question needs to quote a paragraph
   * inside its evidence, and forcing that into a one-line row broke it.
   */
  long?: boolean
}

// ---------------------------------------------------------------------------
// Actions
// ---------------------------------------------------------------------------

/**
 * Two actions are shown collapsed — one positive, one negative. Everything else
 * appears only once the card is expanded.
 *
 * There is no `reply` action because replying is not an action: a reply box sits
 * inside every card. Conversation lives with the work it is about, so the person
 * never has to say which email they meant.
 */
export type Action =
  /** Approve exactly this, once. The label says so out loud. */
  | { kind: 'approve'; label?: string }

  /**
   * Approve this and stop asking about things like it. `scope` names what is
   * being handed over in the person's own words — "emails to Daniel", "shipping
   * questions" — because "yes, always" with no named scope is not consent.
   *
   * Only offered once a run of approvals has earned it. Always reversible.
   */
  | { kind: 'approveAlways'; scope: string; after: number }

  /** Open the artefact or values for editing, then approve. */
  | { kind: 'edit' }

  /** Throw the work away. */
  | { kind: 'discard' }

  /** Answer a question. Options come from EvidenceBody.options. */
  | { kind: 'answer' }

// ---------------------------------------------------------------------------
// Renderer registry — the whole scalability claim, in one object
// ---------------------------------------------------------------------------

/**
 * Adding a new kind of work means adding one entry here. No new screen, no new
 * layout, no change to the envelope. Anything missing falls through to the
 * fallback renderer rather than failing.
 *
 * The build fills this in with components; it is declared here so the contract
 * is visible in the design, not buried in the app.
 */
export type BodyKind = Body['kind']
