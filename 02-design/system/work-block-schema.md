---
status: settled
---

# Work Block — the shared envelope

Every item on the surface is a Work Block, whatever tool it came from. The envelope is constant;
only the body changes. This is what lets a CRM, an invoicing system, or a tool nobody has connected
yet show up on this surface without a new screen.

## Envelope (constant)
| Field | Purpose | Non-technical wording |
|---|---|---|
| `id` | | |
| `kind` | approval · question · notice | what the person is being asked to do |
| `title` | | one line, in the person's language |
| `why` | | why the AI needs this person, not the mechanics of how it works |
| `source` | which tool this touches | shown as a place, not an integration |
| `urgency` | drives batching, not colour alone | |
| `body` | the swappable part | |
| `actions` | approve · edit · discard · answer · reply | |
| `evidence` | what the AI already found | so the person never opens another tool |

## Body types (the primitives)
See `work-block.ts` for the typed contract and `coverage-test.md` for the proof. Anything the envelope can't carry is a signal the envelope is wrong.

## Fallback
An unrecognised body type must still render usefully — title, why, evidence, actions.
The surface degrades; it does not break. Prove this in the build with an unregistered fixture.
