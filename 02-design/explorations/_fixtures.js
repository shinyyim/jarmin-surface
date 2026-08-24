/* Shared fixtures + behaviour for the S1 explorations. Each direction owns its own markup and CSS. */
window.LIGHT_DAY = [
  {
    id: 'wb-001',
    title: 'Reply to Daniel about the Q3 renewal',
    why: "He asked for the revised terms this morning. I'd like a look before it goes.",
    source: 'Gmail', urgency: 'now', raisedAt: '2h ago',
    body: {
      kind: 'document',
      fields: [ { label: 'To', value: 'daniel@acme.com' }, { label: 'Subject', value: 'Re: Q3 renewal terms' } ],
      content: "Hi Daniel,\n\nHappy to proceed on the terms you outlined. To confirm: same scope as last year, Net 30, starting 1 October. I have attached the revised schedule.\n\nAnything else you need from me before we sign?",
      context: { label: 'What Daniel sent', content: 'Morning, can you send over the revised terms? Board meets Thursday.' },
    },
    actions: [ { kind: 'approve', label: 'Send it' }, { kind: 'approveAlways', scope: 'emails to Daniel', after: 5 }, { kind: 'edit' }, { kind: 'discard' } ],
    done: 'Sent to Daniel',
  },
  {
    id: 'wb-002',
    title: 'Move the Acme deal to Closed won',
    why: 'Daniel signed this morning, so the board is out of date.',
    source: 'Monday.com', urgency: 'today', raisedAt: '1h ago',
    body: { kind: 'diff', path: ['Sales Pipeline', 'Acme Corp, Q3 renewal'],
      changes: [ { field: 'Status', before: 'Negotiating', after: 'Closed won' }, { field: 'Close date', before: null, after: '23 Aug 2026' } ] },
    actions: [ { kind: 'approve', label: 'Update it' }, { kind: 'edit' }, { kind: 'discard' } ],
    done: 'Updated the board',
  },
  {
    id: 'wb-003',
    title: "I can't tell which client Tuesday's meeting was with",
    why: "Three places say three different things. I won't file it until you say.",
    source: 'Calendar', urgency: 'whenever', raisedAt: '3h ago',
    body: { kind: 'evidence', question: 'Which client was this meeting with?',
      found: [
        { label: 'Calendar title', value: '"Sync, Northwind"' },
        { label: 'Invite body', value: 'Mentions Meridian twice, Northwind never' },
        { label: 'Transcript', value: '"…as we discussed with the Meridian team last Thursday, the rollout moves to Q4…"', long: true },
      ],
      options: ['Northwind', 'Meridian', 'Neither'] },
    actions: [ { kind: 'answer' }, { kind: 'discard' } ],
    done: 'Told it',
  },
];

window.esc = s => String(s).replace(/[&<>"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));

/* Generic wiring: expects .item[data-state] with [data-act], [data-answer], .undo, and a done slot .done-msg */
window.wire = function ({ stack, brief, briefDone, floor, onFinish }) {
  const timers = new Map();
  const items = () => [...stack.querySelectorAll('.item')];
  function finish(el, msg) {
    el.dataset.open = 'false'; el.dataset.state = 'done';
    el.querySelector('.done-msg').textContent = msg;
    onFinish && onFinish(el);
    timers.set(el.id, setTimeout(() => { el.dataset.state = 'gone'; setTimeout(checkEmpty, 500); }, 6000));
  }
  function checkEmpty() {
    if (items().some(c => c.dataset.state === 'waiting')) return;
    brief.classList.add('fade');
    setTimeout(() => { brief.innerHTML = briefDone; brief.classList.remove('fade'); floor && floor.classList.add('show'); }, 400);
  }
  stack.addEventListener('click', e => {
    const el = e.target.closest('.item'); if (!el) return;
    const wb = LIGHT_DAY.find(w => w.id === el.id);
    const act = e.target.closest('[data-act]')?.dataset.act;
    const answer = e.target.closest('[data-answer]')?.dataset.answer;
    if (e.target.closest('.undo')) { clearTimeout(timers.get(el.id)); el.dataset.state = 'waiting'; return; }
    if (answer) return finish(el, `${wb.done}: ${answer}`);
    if (act === 'approve' || act === 'approveAlways') return finish(el, wb.done);
    if (act === 'discard') return finish(el, 'Thrown away');
    if (act === 'edit' || act === 'open') { el.dataset.open = 'true'; return; }
    if (e.target.closest('.head') && !e.target.closest('button,a')) el.dataset.open = el.dataset.open !== 'true';
  });
  stack.addEventListener('submit', e => {
    e.preventDefault();
    const input = e.target.querySelector('input'); const t = input.value.trim(); if (!t) return;
    const thread = e.target.closest('.item').querySelector('.thread'); thread.hidden = false;
    thread.insertAdjacentHTML('beforeend', `<div class="me">${esc(t)}</div>`); input.value = '';
    setTimeout(() => thread.insertAdjacentHTML('beforeend', `<div class="ai">Sure, I've adjusted it above. Send when you're happy.</div>`), 800);
  });
  document.addEventListener('keydown', e => {
    if (e.target.matches('input,textarea')) return;
    const open = items().find(i => i.dataset.open === 'true' && i.dataset.state === 'waiting');
    const first = items().find(i => i.dataset.state === 'waiting');
    const target = open || first; if (!target) return;
    if (e.key === 'a') target.querySelector('[data-act="approve"]')?.click();
    if (e.key === 'x') target.querySelector('[data-act="discard"]')?.click();
    if (e.key === 'Enter') target.dataset.open = target.dataset.open !== 'true';
    if (e.key === 'u') stack.querySelector('.item[data-state="done"] .undo')?.click();
  });
  const p = new URLSearchParams(location.search);
  if (p.get('phone')) document.body.classList.add('phone');
};
