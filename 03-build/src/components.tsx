import { useEffect, useRef, useState } from 'react'
import type { WorkBlock, Action } from './contract/work-block'
import { Icon, SourceIcon, Blob } from './icons'
import { renderBody, isRegistered } from './registry'
import type { SurfaceApi } from './state'
import { isDiff } from './guards'

/* ---------- helpers ---------- */
import { when } from './time'
const label = (a: Action) => a.kind === 'approve' ? (a.label || 'Approve') : a.kind === 'approveAlways' ? `Always · ${a.scope}` : a.kind === 'edit' ? 'Edit' : a.kind === 'discard' ? 'Discard' : 'Answer'
const tip = (a: Action) => a.kind === 'approve' ? `${a.label || 'Approve'} · A` : a.kind === 'approveAlways' ? `Hand off ${a.scope}` : a.kind === 'edit' ? 'Edit first · E' : 'Throw away · X'
const icon = (a: Action) => a.kind === 'approve' ? <Icon.send /> : a.kind === 'approveAlways' ? <Icon.always /> : a.kind === 'edit' ? <Icon.pen /> : <Icon.trash />

/* ---------- Intro — the assistant speaks first ---------- */
export function Intro({ sub, greeting, onBegin }: { sub: string; greeting: string; onBegin: () => void }) {
  const slide = useRef<HTMLDivElement>(null), knob = useRef<HTMLDivElement>(null)
  const onDown = (e: React.PointerEvent) => {
    const s = slide.current!, k = knob.current!, max = s.offsetWidth - k.offsetWidth - 8, x0 = e.clientX; let x = 0
    s.classList.remove('snap'); k.setPointerCapture(e.pointerId)
    const move = (ev: PointerEvent) => { x = Math.max(0, Math.min(max, ev.clientX - x0)); k.style.left = 4 + x + 'px'; (s.querySelector('.hint') as HTMLElement).style.opacity = String(1 - x / max) }
    const up = () => {
      k.removeEventListener('pointermove', move); k.removeEventListener('pointerup', up); k.removeEventListener('pointercancel', up)
      s.classList.add('snap')
      if (x >= max * 0.8 || x < 4) { s.classList.add('is-done'); k.style.left = 4 + max + 'px'; setTimeout(onBegin, 260) }
      else { k.style.left = ''; (s.querySelector('.hint') as HTMLElement).style.opacity = '' }
    }
    k.addEventListener('pointermove', move); k.addEventListener('pointerup', up); k.addEventListener('pointercancel', up)
  }
  return (
    <div className="intro" id="intro"><div className="intro-in">
      <Blob />
      <h2><small>{sub}</small>{greeting}</h2>
      <div className="islide" ref={slide} role="button" aria-label="Slide to begin" tabIndex={0} onKeyDown={e => (e.key === 'Enter' || e.key === ' ') && onBegin()}>
        <span className="hint"><Icon.arr /></span>
        <div className="knob" ref={knob} onPointerDown={onDown}><i>‖</i>Slide to begin</div>
      </div>
    </div></div>
  )
}

/* ---------- Slide to confirm — the one deliberate gesture ---------- */
export function Slide({ text, doneText, onConfirm }: { text: string; doneText: string; onConfirm: () => void }) {
  const slide = useRef<HTMLDivElement>(null), knob = useRef<HTMLDivElement>(null)
  const onDown = (e: React.PointerEvent) => {
    const s = slide.current!, k = knob.current!, kw = k.offsetWidth, max = s.offsetWidth - kw - 8, x0 = e.clientX; let x = 0
    const fill = s.querySelector('.fill') as HTMLElement, txt = s.querySelector('.txt') as HTMLElement
    s.classList.remove('snap'); k.setPointerCapture(e.pointerId)
    const move = (ev: PointerEvent) => { x = Math.max(0, Math.min(max, ev.clientX - x0)); k.style.left = 4 + x + 'px'; fill.style.width = x + kw + 8 + 'px'; txt.style.opacity = String(1 - x / max) }
    const reset = () => { k.style.left = ''; fill.style.width = ''; txt.style.opacity = '' }
    const up = () => {
      k.removeEventListener('pointermove', move); k.removeEventListener('pointerup', up); k.removeEventListener('pointercancel', up)
      if (x >= max * 0.85 || x < 4) { s.classList.add('is-done'); reset(); setTimeout(onConfirm, 520) }
      else { s.classList.add('snap'); reset() }
    }
    k.addEventListener('pointermove', move); k.addEventListener('pointerup', up); k.addEventListener('pointercancel', up)
  }
  return (
    <div className="slide" ref={slide} role="button" aria-label={text} tabIndex={0} onKeyDown={e => e.key === 'Enter' && onConfirm()}>
      <div className="fill" /><div className="txt">{text}</div><div className="txt on">{doneText} ✓</div>
      <div className="knob" ref={knob} onPointerDown={onDown}><Icon.arrR /></div>
    </div>
  )
}

/* ---------- Card — one Work Block ---------- */
export function Card({ wb, api, nested }: { wb: WorkBlock; api: SurfaceApi; nested?: boolean }) {
  const s = api.get(wb.id)
  const isQ = wb.body.kind === 'evidence'
  const contentRef = useRef<HTMLDivElement>(null)
  const [typed, setTyped] = useState<string | null>(null)
  const replyRef = useRef<HTMLInputElement>(null)

  // Rewrite arrives → type it in place
  useEffect(() => {
    if (!s.content || !contentRef.current) return
    const node = contentRef.current, text = s.content
    node.classList.add('rewriting'); let i = 0; let alive = true
    const tick = () => { if (!alive) return; i += 2 + Math.floor(Math.random() * 3); setTyped(text.slice(0, i)); if (i < text.length) setTimeout(tick, 12); else setTimeout(() => node.classList.remove('rewriting'), 900) }
    tick()
    return () => { alive = false }
  }, [s.content])

  useEffect(() => { if (s.edit && contentRef.current) contentRef.current.focus() }, [s.edit])

  const quick = isQ
    ? <button className="d primary" data-tip="Answer · ↵" onClick={e => { e.stopPropagation(); api.open(wb.id) }}><Icon.reply />Answer</button>
    : wb.actions.filter(a => a.kind === 'approve' || a.kind === 'edit').map(a => (
      <button key={a.kind} className={`d ${a.kind === 'approve' ? 'primary' : ''}`} data-tip={tip(a)} onClick={e => { e.stopPropagation(); if (a.kind === 'approve') api.approve(wb); else api.edit(wb.id) }}>{icon(a)}{label(a)}</button>
    ))

  const approve = wb.actions.find(a => a.kind === 'approve')
  const approveLabel = approve?.kind === 'approve' ? (approve.label || 'Approve') : 'Approve'
  const slideText = `Slide to ${approveLabel.toLowerCase().replace(' it', '')}${s.edit ? ' edited' : ''}`

  return (
    <article className={`item ${isRegistered(wb.body) ? '' : 'attn'} ${nested ? 'nested' : ''}`} id={wb.id} data-urgency={wb.urgency} data-open={s.open} data-state={s.state} data-edit={s.edit} data-thinking={s.thinking} tabIndex={0}>
      <div className="head" onClick={() => api.toggle(wb.id)}>
        <span className="ico"><SourceIcon source={wb.source} /></span>
        <div className="row1"><span className="src">{wb.source}</span><span className="dot" /><span>{when(wb.raisedAt)}</span>{wb.urgency === 'now' && <span className="chip">Now</span>}</div>
        <span className="chev"><Icon.chev /></span>
        <div className="title">{wb.title}</div><div className="why">{wb.why}</div>
        <div className="dock">{quick}</div>
      </div>
      <div className="body"><div>
        {renderBody(wb.body, { editing: s.edit, contentRef, contentOverride: typed ?? s.content, onAnswer: o => api.answer(wb, o) })}
        <div className="editing-note">Editing, tap the highlighted text, then slide to send.</div>
        <div className="thinking"><i /><i /><i /><span>rewriting…</span></div>
        <div className="actions"><div className="dock">
          {wb.actions.filter(a => a.kind !== 'answer').map(a =>
            a.kind === 'approve' ? <Slide key="slide" text={slideText} doneText={approveLabel} onConfirm={() => api.approve(wb)} />
            : a.kind === 'discard' ? <button key="discard" className="d icon danger" data-tip={tip(a)} onClick={() => api.discard(wb.id)}><Icon.trash /></button>
            : a.kind === 'edit' ? <button key="edit" className="d icon" data-tip={tip(a)} onClick={() => api.edit(wb.id)}><Icon.pen /></button>
            : <button key="always" className="d" data-tip={tip(a)} onClick={() => api.approveAlways(wb, a.scope)}>{icon(a)}{label(a)}</button>
          )}
        </div></div>
        {s.thread.length > 0 && <div className="thread">{s.thread.map((t, i) => <div key={i} className={t.who}>{t.text}</div>)}</div>}
        <form className="reply" onSubmit={e => { e.preventDefault(); const v = replyRef.current!.value.trim(); if (!v) return; replyRef.current!.value = ''; api.reply(wb, v) }}>
          <input ref={replyRef} placeholder="Tell it something about this…" aria-label="Reply" />
          <button type="submit" aria-label="Send"><Icon.up /></button>
        </form>
      </div></div>
      <div className="done"><span className="check"><Icon.check /></span><span className="done-msg">{s.doneMsg}</span>{s.doneNote && <span className="n">{s.doneNote}</span>}<button className="undo" onClick={() => api.undo([wb.id])}>Undo</button></div>
    </article>
  )
}

/* ---------- Stack — many of the same thing, one decision ---------- */
export function Stack({ id, title, items, api }: { id: string; title: string; items: WorkBlock[]; api: SurfaceApi }) {
  const [open, setOpen] = useState(false)
  const [busy, setBusy] = useState<'idle' | 'busy' | 'ok'>('idle')
  const [gone, setGone] = useState(false)
  const done = items.filter(w => api.get(w.id).state !== 'waiting')
  const allDone = done.length === items.length
  const n = items.length
  const labelOf = (w: WorkBlock) => isDiff(w.body) ? (w.body.path[0].toLowerCase().includes('revenue') ? w.title.replace(/^Fill March revenue for /, '') : w.body.path[1]) : w.title
  const change = (w: WorkBlock) => isDiff(w.body) ? w.body.changes[0] : null
  const msg = id === 'march' ? 'Filled 12 cells' : 'Updated 8 records'

  useEffect(() => {
    if (allDone && !gone) { const t = setTimeout(() => setGone(true), 6000); return () => clearTimeout(t) }
    if (!allDone) setGone(false)
  }, [allDone, gone])

  const approveAll = () => {
    setBusy('busy')
    const rest = items.filter(w => api.get(w.id).state === 'waiting')
    rest.forEach((w, i) => setTimeout(() => api.approveAll([w.id], msg), 80 * i))
    setTimeout(() => setBusy('ok'), 1150)
  }
  const undo = () => { api.undo(items.map(w => w.id)); setBusy('idle'); setGone(false) }
  const first = items[0]

  return (
    <article className="item stack" data-open={open && !allDone} data-state={gone ? 'gone' : allDone ? 'done' : 'waiting'}>
      <div className="head" onClick={() => setOpen(o => !o)}>
        <span className="ico"><SourceIcon source={first.source} /></span>
        <div className="row1"><span className="src">{first.source}</span><span className="dot" /><span>{n} · same pattern</span></div>
        <span className="chev"><Icon.chev /></span>
        <div className="title">{title}</div><div className="why">{first.why}</div>
        <div className="meta"><div className="track"><i style={{ width: `${done.length / n * 100}%` }} /></div><span className="n"><span className="k">{done.length}</span> of {n}</span></div>
        <div className="sample">
          {items.slice(0, 2).map(w => { const c = change(w)!; return <div key={w.id}><b>{labelOf(w)}</b><span className={`pill before ${c.before === null ? 'is-empty' : ''}`}>{c.before ?? 'empty'}</span><span className="arr"><Icon.arr /></span><span className="pill after">{c.after}</span></div> })}
          <span className="more">and {n - 2} more like these</span>
        </div>
        <div className="dock">
          <button className={`d primary batch ${busy}`} data-tip={`Approve all ${n} · ⇧A`} onClick={e => { e.stopPropagation(); approveAll() }}><i className="p" /><Icon.send /><span>{busy === 'ok' ? 'Done' : `Approve all ${n}`}</span></button>
          <button className="d" data-tip="See every row" onClick={e => { e.stopPropagation(); setOpen(true) }}><Icon.pen />Look</button>
        </div>
      </div>
      <div className="body"><div>
        <div className="rows">
          {items.map(w => { const c = change(w)!, d = api.get(w.id).state !== 'waiting'; return (
            <div className="row" key={w.id} data-done={d}>
              <span className="cb" data-tip="Approve this one" onClick={() => d ? api.undo([w.id]) : api.approveAll([w.id], msg)}><Icon.check /></span>
              <span className="t">{labelOf(w)} <span className={`pill before ${c.before === null ? 'is-empty' : ''}`}>{c.before ?? 'empty'}</span><span className="arr"><Icon.arr /></span><span className="pill after">{c.after}</span></span>
              <span className="go"><Icon.crumb /></span>
            </div>) })}
        </div>
        <div className="actions"><div className="dock">
          <button className={`d primary batch ${busy}`} onClick={approveAll}><i className="p" /><Icon.send /><span>Approve the rest</span></button>
          <button className="d icon danger" data-tip="Throw all away" onClick={() => items.forEach(w => api.discard(w.id))}><Icon.trash /></button>
        </div></div>
      </div></div>
      <div className="done"><span className="check"><Icon.check /></span><span className="done-msg">{msg}</span><span className="n">one undo for all of them</span><button className="undo" onClick={undo}>Undo</button></div>
    </article>
  )
}

/* ---------- Bundle — one conversation, read together ---------- */
export function Bundle({ title, items, api }: { title: string; items: WorkBlock[]; api: SurfaceApi }) {
  const [open, setOpen] = useState(false)
  const allDone = items.every(w => api.get(w.id).state !== 'waiting')
  const allGone = items.every(w => api.get(w.id).state === 'gone')
  const kinds = [...new Set(items.map(w => w.body.kind))].join(' · ')
  return (
    <article className="item bundle" data-open={open} data-state={allGone ? 'gone' : 'waiting'}>
      <div className="head" onClick={() => setOpen(o => !o)}>
        <span className="ico"><SourceIcon source="Gmail" /></span>
        <div className="row1"><span className="src">Gmail · Monday.com</span><span className="dot" /><span>{items.length} things</span>{items.some(w => w.urgency === 'now') && <span className="chip">One needs you</span>}</div>
        <span className="chev"><Icon.chev /></span>
        <div className="title">{title}</div><div className="why">{allDone ? 'All handled.' : "Read these together, they're one conversation."}</div>
        <div className="faces"><span className="av"><i><Icon.at /></i><i><Icon.tag /></i><i><Icon.reply /></i><i><Icon.pen /></i></span><span className="n">{kinds}</span></div>
        <div className="dock"><button className="d primary" data-tip="Open all four" onClick={e => { e.stopPropagation(); setOpen(true) }}><Icon.reply />Read</button></div>
      </div>
      <div className="body"><div><div className="rows">{items.map(w => <Card key={w.id} wb={w} api={api} nested />)}</div></div></div>
      <div className="done" />
    </article>
  )
}

/* ---------- Hand-off line ---------- */
export function Handoff({ api }: { api: SurfaceApi }) {
  const h = api.handoffs
  if (!h.length) return <div className="handoff" />
  return (
    <div className="handoff show">
      <Icon.shield />
      <span>Handling on its own: {h.map((x, i) => <b key={x.scope} style={{ textDecoration: x.on ? 'none' : 'line-through', color: x.on ? undefined : 'var(--ink-3)' }}>{i > 0 && ', '}{x.scope}</b>)}</span>
      {h.map(x => <span key={x.scope} className={`off ${x.on ? '' : 'is-off'}`} role="switch" aria-checked={x.on} data-tip={x.on ? 'Stop handling these' : 'Hand these back'} onClick={() => api.toggleHandoff(x.scope)} style={x.on ? undefined : { background: 'rgba(0,0,0,.15)' }} />)}
    </div>
  )
}

/* ---------- Composer — the dock ---------- */
export function Composer({ onInstruct, hidden }: { onInstruct: (t: string) => void; hidden: boolean }) {
  const ref = useRef<HTMLInputElement>(null)
  const [ph, setPh] = useState('Tell it something…')
  return (
    <div className="composer" style={hidden ? { opacity: 0, pointerEvents: 'none', transform: 'translate(-50%, 14px) scale(.98)' } : undefined}>
      <form onSubmit={e => { e.preventDefault(); const v = ref.current!.value.trim(); if (!v) return; ref.current!.value = ''; setPh('On it…'); setTimeout(() => { onInstruct(v); setPh("Drafted it, it's at the top."); setTimeout(() => setPh('Tell it something…'), 3000) }, 1400) }}>
        <button type="button" className="di" data-tip="What it's doing"><Icon.clock /></button>
        <button type="button" className="di opt" data-tip="Handled on its own"><Icon.shield /></button>
        <span className="sep" />
        <input ref={ref} placeholder={ph} aria-label="Instruction" />
        <kbd>enter</kbd>
        <button type="button" className="di opt" data-tip="Speak"><Icon.mic /></button>
        <button type="submit" className="send" data-tip="Send"><Icon.up /></button>
      </form>
    </div>
  )
}

export function Empty({ show, next }: { show: boolean; next: string }) {
  return (
    <div className={`empty ${show ? 'show' : ''}`}>
      <div className="ghost"><i /><i /><i /></div>
      <h2>It's pretty quiet around here</h2>
      <p>{next}</p>
    </div>
  )
}

/* ---------- Day switch — three things or thirty-one ---------- */
export function DaySwitch({ day }: { day: 'light' | 'heavy' }) {
  const q = new URLSearchParams(location.search)
  const href = (d: string) => { const n = new URLSearchParams(q); n.set('day', d); n.delete('skipintro'); return '?' + n.toString() }
  return (
    <nav className="dayswitch" aria-label="Which day">
      <a href={href('light')} className={day === 'light' ? 'on' : ''} data-tip="A light day, three things" aria-current={day === 'light'}>3</a>
      <a href={href('heavy')} className={day === 'heavy' ? 'on' : ''} data-tip="A heavy day, thirty-one things" aria-current={day === 'heavy'}>31</a>
    </nav>
  )
}

export function Skeleton() {
  return <div className="skeleton" aria-busy="true" aria-label="Loading"><i /><i /><i /></div>
}
