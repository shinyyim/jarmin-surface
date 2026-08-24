# Jarmin · the surface where a person and their AI employee meet

A web surface for one person and the AI employee working for them. Everything the AI needs
from the person, and everything the person wants to say back, happens here.

**Live:** see the deploy link in the repo description · **Explorations:** `/explorations/README.html` · **Phone + desktop side by side:** `/compare.html`

## Run

```
npm install
npm run dev        # http://localhost:5173
```

| URL | What you see |
|---|---|
| `/` | The light day, three things, after the assistant's greeting |
| `/?day=heavy` | The heavy day, thirty-one things, grouped |
| `/?skipintro=1` | Straight to the queue |
| `/?loading=1` | The loading skeleton first |
| `/?empty=1` | Nothing waiting |

Keyboard: `J`/`K` move · `Enter` open · `A` approve · `E` edit · `X` discard · `U` undo · `1–9` answer.

## How it is built

```
src/contract/work-block.ts   the Work Block, the one envelope every item shares  (copied unchanged from 02-design/system)
src/contract/fixtures.ts     both days, fake data shaped exactly like the contract (copied unchanged)
src/registry.tsx             kind → renderer. document, diff, evidence. Anything else → Fallback
src/state.ts                 one store: open/done/gone per item, threads, rewrites, hand-offs, undo timers
src/components.tsx           Intro, Card, Slide, Stack, Bundle, Handoff, Composer, Empty, Skeleton
src/App.tsx                  the two days, the assistant's grouping, keyboard
src/styles.css               tokens and every state, ported from the final prototype
```

**Adding a kind of work is one entry in `registry.tsx`.** The heavy day deliberately carries a
block whose kind (`approval_chain`) has no renderer; it renders through `Fallback` with the
envelope, the data it came with, and working actions. That is the scalability claim under test.

Nothing here knows what role the AI employee has. Swap `fixtures.ts` for a support-desk day and
nothing else changes.

## What is fake
Everything. No backend, no login, no integrations. Replies and rewrites are scripted. The
composer produces one scripted draft. This is the front end of the surface, as the brief asked.

## Tools
Claude Code (design and build, with the author directing), React, TypeScript, Vite, Vercel.
