# Jarmin

A web surface where a person and the AI employee working for them get things done together.
Everything the AI employee needs from that person, and everything that person wants to say back,
happens here.

**Live:** https://jarmin-surface.vercel.app · [the light day](https://jarmin-surface.vercel.app/) · [the heavy day](https://jarmin-surface.vercel.app/?day=heavy) · [directions tried](https://jarmin-surface.vercel.app/explorations/README.html) · [phone and desktop](https://jarmin-surface.vercel.app/compare.html)

**Start here:** [`04-writeup/notes.md`](04-writeup/notes.md) — who this is for, the hardest call, what was left out, tools used.

| Path | What's in it |
|---|---|
| `01-research/` | Brief analysis, visual references |
| `02-design/system/` | The Work Block contract, the primitives, the coverage test |
| `02-design/` | The person and seven scenarios, the UX structure, what gets built |
| `02-design/explorations/` | The directions tried, and why each was dropped. The pages themselves are served from the build |
| `02-design/final/screens/` | Screens of the chosen design |
| `03-build/` | The front end. React + TypeScript + Vite. `npm install && npm run dev` |
| `04-writeup/` | The short notes, and the recording script |
| `PLAN.md` · `DECISIONS.md` | The plan, and every call made with its cost |

## The shape of it
One envelope, `WorkBlock`, carries every kind of work: *what · why you're needed · where it came
from · when · what you can do about it*. Only the body changes, and the renderer registry maps
`kind → component`. Adding a kind of work is one entry; anything unregistered still renders, in
plain words, with its actions live. That is the whole scalability claim, and the heavy day carries
an unregistered kind to prove it.
