---
created: "2026-08-23"
categories:
  - references
tags: [jarmin, product-design]
author: "Jarmin"
genre: "brief"
---

# Brief analysis

## What is being asked
A web surface — the single place where a person and the AI employee working for them meet.
Three jobs happen there: approving work, talking to each other, and the employee asking for
something (the AI opens the conversation, not the person).

## Where the difficulty actually is
The brief names it: *"Each kind of work needs to be shown a different way, and new kinds will
keep appearing. Handling that is most of the design problem."* Paired with *"can leverage UI
primitives/components to render what it needs"* — the deliverable is a rendering system, not a
set of screens.

## The six constraints, read as requirements
| Constraint | What it demands |
|---|---|
| Person is not technical | No agent internals — no tool calls, steps, confidence scores |
| Some days 3 items, some days 40 | Triage, grouping, bulk action; density that survives both |
| Email approval vs. blank-cell question are different jobs | The brief's own hardest call — take a position |
| Trust should grow, review effort should shrink | Needs a trust mechanism; a static screen can't satisfy this |
| Every interrupt costs the person | Batching and a real urgency distinction |
| Must survive a different role and a different toolset | No domain hardcoding; the EA example is material, not spec |

## Work types named, and their natural shape
- Drafted email → **document** (recipient, subject, full body, the message being replied to)
- Monday.com item change → **diff** (board, item, column, value today, value proposed)
- Spreadsheet cell change → **diff** (sheet, row, column, value today, value proposed)
- Question with no work attached → **evidence** (everything already found, so no other tool is needed)

Two shapes cover four cases. That is the seed of the primitive set.

## Deliverables
1. The design — *including directions tried and thrown out*
2. The front end, as code or a screen recording
3. Short notes: who I pictured, hardest call, what I left out
4. Tools used

## Out of scope
No backend, fake data, no login, no settings, no navigation, no real integrations, no need to
resemble the existing product.

## Graded on
Product sense · Showing the work · Craft (including easy-to-skip states) · Scalability ·
Build matching design · Explaining the reasoning.
Explicitly *not* graded on volume built or proximity to their existing product.

## Standing instruction from the brief
> "If something is unclear, make a call, write down what you assumed, and keep going."

## Connections
- Related: [[PLAN]], [[DECISIONS]]
