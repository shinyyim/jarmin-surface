---
status: final
---

# Notes on the thinking

## Who I pictured using this
Summer, who owns an eleven-person consultancy and is not technical. The AI employee runs the
client admin: enquiry → proposal → contract → kickoff → invoice → payment → renewal, across all
eleven clients, in Gmail, Monday.com and a revenue sheet. Summer checks the surface with coffee
at 8:40 on a laptop, and from a phone between meetings. Two mornings decided the design: a
Wednesday with three things waiting, and a Tuesday back from four days away with thirty-one.
If a visit takes more than a few minutes, or asks them to understand how the assistant works, they
stop opening it.

## The hardest call I had to make
Whether approving a drafted email and answering a question about a blank cell belong in the
same place. They are different jobs. I put them in one queue anyway, but only because the
conversation is attached to the work: the reply box sits inside the card, under the draft, so
"make this warmer" needs no antecedent and the answer to "which client?" lands next to the
evidence. The cost is real: there is no room for a conversation that is not about a specific
piece of work, so I added one standing composer at the bottom for instructions, and made it
produce a normal card rather than a chat thread. A close second was the heavy day: I tried
grouping by date and threw it out, because the assistant had already grouped the work in its
own words and a second axis turned a backlog into guilt.

## What I left out
Settings, an autonomy slider, confidence scores, reasoning traces and tool logs (the person is
not technical), a separate chat panel, search and archive (nothing here is old enough to need
finding), integrations and login, and a full mobile app. The phone gets the same column, not a
redesign. Trust is handled by one button with its scope in the label ("Always · emails to
Daniel") and one line at the top that can be switched off, not by a settings page.

## Tools
Claude Code for design exploration and the build, directed throughout; React, TypeScript, Vite;
Vercel for hosting. Every rejected direction is a live page under `/explorations`.
