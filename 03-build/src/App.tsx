import { useEffect, useMemo, useState } from 'react'
import { days } from './contract/fixtures'
import type { WorkBlock } from './contract/work-block'
import { useSurface } from './state'
import { Intro, Card, Stack, Bundle, Handoff, Composer, Empty, Skeleton } from './components'
import { isEvidence } from './guards'
import { greeting, introSub, todayLabel } from './time'

const q = new URLSearchParams(location.search)
const DAY = (q.get('day') === 'heavy' ? 'heavy' : 'light') as 'light' | 'heavy'
const FORCE_EMPTY = q.get('empty') === '1'

const HELLO = greeting()          // Morning · Afternoon · Evening
const COPY = {
  light: {
    sub: introSub(),
    greeting: `${HELLO}, Summer. Three things need you, one before Thursday.`,
    brief: `${HELLO}. Three things need you, one before Daniel's board meets Thursday.`,
    done: "That's everything for now.",
    next: "Nothing needs you. Next I'm drafting Friday's report.",
  },
  heavy: {
    sub: introSub('back from four days away'),
    greeting: "Welcome back, Summer. Thirty-one things came in, I've grouped them for you.",
    brief: "Welcome back. Thirty-one things came in while you were away. I've grouped what I could, twelve are the same gap in the March sheet, eight are routine pipeline updates. Four are about Daniel, and three I'd like you to look at properly.",
    done: "That's everything. I'll send the weekly report at 9.",
    next: "I'll send the weekly report at 9.",
  },
}

export default function App() {
  const initial = useMemo<WorkBlock[]>(() => FORCE_EMPTY ? [] : days[DAY], [])
  const api = useSurface(initial)
  const [ready, setReady] = useState(q.get('skipintro') === '1')
  const [loading, setLoading] = useState(q.get('loading') === '1')
  const c = COPY[DAY]
  const today = todayLabel()

  useEffect(() => { document.body.classList.add(DAY); document.body.classList.toggle('ready', ready) }, [ready])
  useEffect(() => { if (loading) { const t = setTimeout(() => setLoading(false), 900); return () => clearTimeout(t) } }, [loading])
  useEffect(() => {
    const set = () => document.body.classList.toggle('phone', window.innerWidth < 640)
    set(); window.addEventListener('resize', set); return () => window.removeEventListener('resize', set)
  }, [])

  const items = api.items
  const st = api.st
  const total = items.length
  const doneCount = items.filter(w => (st[w.id]?.state ?? 'waiting') !== 'waiting').length
  const allDone = total === 0 || doneCount === total
  const anyOpen = items.some(w => st[w.id]?.open && st[w.id]?.state === 'waiting')

  // keyboard: J/K move, Enter open, A approve, X discard, U undo, 1-9 answer
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement | null
      if (t?.matches?.('input,textarea,[contenteditable="true"]')) return
      const waiting = items.filter(w => (st[w.id]?.state ?? 'waiting') === 'waiting')
      const open = waiting.find(w => st[w.id]?.open)
      const focused = document.activeElement?.closest('.item')?.id
      const target = open ?? waiting.find(w => w.id === focused) ?? waiting[0]
      if (!target) return
      if (e.key === 'j' || e.key === 'k') { const els = [...document.querySelectorAll<HTMLElement>('.item[data-state="waiting"]')]; const i = els.findIndex(x => x === document.activeElement); els[Math.max(0, Math.min(els.length - 1, i + (e.key === 'j' ? 1 : -1)))]?.focus() }
      if (e.key === 'Escape') { if (open) api.toggle(open.id); else setReady(false); return }
      if (e.key === 'Enter') api.toggle(target.id)
      if (e.key === 'a') api.approve(target)
      if (e.key === 'e') api.edit(target.id)
      if (e.key === 'x') api.discard(target.id)
      if (e.key === 'u') { const d = items.find(w => st[w.id]?.state === 'done'); if (d) api.undo([d.id]) }
      if (/^[1-9]$/.test(e.key) && isEvidence(target.body) && target.body.options) { const o = target.body.options[+e.key - 1]; if (o) api.answer(target, o) }
    }
    window.addEventListener('keydown', onKey); return () => window.removeEventListener('keydown', onKey)
  })

  // Sections: the assistant's grouping, not a time axis (D-008)
  const sections = useMemo(() => {
    const byGroup = (k: string) => items.filter(w => w.groupKey === k)
    const carriedIds = new Set(days.light.map(w => w.id))
    if (DAY === 'light') return [{ key: 'all', n: total, title: '', nodes: items.map(w => <Card key={w.id} wb={w} api={api} />) }]
    const singles = items.filter(w => !w.groupKey && !carriedIds.has(w.id))
    const carried = items.filter(w => carriedIds.has(w.id))
    return [
      { key: 'look', n: singles.length, title: 'Needs you', hot: true, nodes: singles.map(w => <Card key={w.id} wb={w} api={api} />) },
      { key: 'daniel', n: byGroup('daniel').length, title: 'About Daniel', nodes: [<Bundle key="daniel" title="About Daniel" items={byGroup('daniel')} api={api} />] },
      { key: 'same', n: byGroup('march-revenue-cells').length + byGroup('pipeline-updates').length, title: 'Same pattern', nodes: [<Stack key="march" id="march" title="Filling March revenue" items={byGroup('march-revenue-cells')} api={api} />, <Stack key="pipe" id="pipe" title="Pipeline updates" items={byGroup('pipeline-updates')} api={api} />] },
      { key: 'carried', n: carried.length, title: 'From last week', nodes: carried.map(w => <Card key={w.id} wb={w} api={api} />) },
    ]
  }, [items, api])

  if (loading) return <Skeleton />

  return (
    <>
      {!ready && <Intro sub={c.sub} greeting={c.greeting} onBegin={() => setReady(true)} />}
      <main className="page">
        <div className="top"><h1>Today</h1><span className="date">{today.weekday} <b>· {today.date}</b></span></div>
        <p className="brief"><button className="spark" data-tip="Back to the start · esc" aria-label="Back to the start" onClick={() => setReady(false)}><svg viewBox="0 0 16 16" fill="currentColor"><path d="M8 1l1.6 4.4L14 7l-4.4 1.6L8 13l-1.6-4.4L2 7l4.4-1.6z" /></svg></button><span>{allDone ? c.done : c.brief}</span></p>
        {total === 0 ? null : DAY === 'light'
          ? <div className="progress"><div className="dots">{items.map((w, i) => <i key={w.id} className={i < doneCount ? '' : 'off'} />)}</div><span className="count">{doneCount} of {total} done</span></div>
          : <div className="bar"><div className="track"><i style={{ width: `${total ? doneCount / total * 100 : 0}%` }} /></div><span className="n"><b>{doneCount}</b> of {total}</span></div>}
        <Handoff api={api} />
        <div id="days">
          {sections.map(s => {
            const empty = s.nodes.length === 0 || s.nodes.every(n => { const id = (n as any).props?.wb?.id; return id ? st[id]?.state === 'gone' : false })
            return DAY === 'light'
              ? <section className="list" key={s.key}>{s.nodes}</section>
              : <section className="day" key={s.key} data-empty={empty}><div className={`date ${s.hot ? 'today' : ''}`}><b>{s.n}</b><span>{s.title}</span></div><div className="list">{s.nodes}</div></section>
          })}
        </div>
        <Empty show={allDone} next={c.next} />
      </main>
      <Composer onInstruct={api.instruct} hidden={anyOpen} />
    </>
  )
}
