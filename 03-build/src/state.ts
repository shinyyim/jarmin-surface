/**
 * Surface state — one store, plain functions. Every item's UI state lives here;
 * the Work Block itself never changes (except `content` overrides after a rewrite).
 */
import { useCallback, useRef, useState } from 'react'
import type { WorkBlock } from './contract/work-block'
import { isDoc, isDiff } from './guards'

export type ItemState = {
  open: boolean
  state: 'waiting' | 'done' | 'gone'
  edit: boolean
  thinking: boolean
  thread: { who: 'me' | 'ai'; text: string }[]
  content?: string          // rewritten document content
  doneMsg?: string
  doneNote?: string
}
const fresh = (): ItemState => ({ open: false, state: 'waiting', edit: false, thinking: false, thread: [] })

export const doneMessage = (wb: WorkBlock, answer?: string) => {
  if (answer) return `Told it: ${answer}`
  const to = isDoc(wb.body) ? wb.body.fields.find(f => f.label === 'To')?.value : undefined
  const name = to ? to.split('@')[0].replace(/^\w/, c => c.toUpperCase()) : undefined
  if (wb.body.kind === 'document') return name ? `Sent to ${name}` : 'Sent'
  if (isDiff(wb.body)) return wb.body.path[0]?.toLowerCase().includes('revenue') ? 'Filled the cell' : 'Updated the record'
  if (wb.body.kind === 'evidence') return 'Told it'
  return 'Approved'
}

const REWRITES: Record<string, string> = {
  'wb-001': "Hi Daniel,\n\nGreat news, happy to move ahead on the terms you set out. Same scope as last year, Net 30, starting 1 October, and the revised schedule is attached.\n\nGive me a shout if the board needs anything else before Thursday.",
}

export function useSurface(initial: WorkBlock[]) {
  const [items, setItems] = useState<WorkBlock[]>(initial)
  const [st, setSt] = useState<Record<string, ItemState>>(() => Object.fromEntries(initial.map(w => [w.id, fresh()])))
  const [handoffs, setHandoffs] = useState<{ scope: string; on: boolean }[]>([])
  const timers = useRef(new Map<string, number>())

  const patch = useCallback((id: string, p: Partial<ItemState>) => setSt(s => ({ ...s, [id]: { ...(s[id] ?? fresh()), ...p } })), [])
  const get = (id: string) => st[id] ?? fresh()

  const finish = useCallback((id: string, msg: string, note?: string) => {
    patch(id, { open: false, state: 'done', edit: false, doneMsg: msg, doneNote: note })
    clearTimeout(timers.current.get(id))
    timers.current.set(id, window.setTimeout(() => patch(id, { state: 'gone' }), 6000))
  }, [patch])

  const api = {
    items, st, handoffs, get,
    toggle: (id: string) => patch(id, { open: !get(id).open }),
    open: (id: string) => patch(id, { open: true }),
    edit: (id: string) => patch(id, { open: true, edit: true }),
    approve: (wb: WorkBlock) => finish(wb.id, doneMessage(wb)),
    approveAll: (ids: string[], msg: string) => ids.forEach((id, i) => { const last = i === ids.length - 1; patch(id, { state: 'done', open: false, doneMsg: msg }); clearTimeout(timers.current.get(id)); timers.current.set(id, window.setTimeout(() => patch(id, { state: 'gone' }), 6000)); void last }),
    approveAlways: (wb: WorkBlock, scope: string) => { finish(wb.id, doneMessage(wb)); setTimeout(() => setHandoffs(h => h.some(x => x.scope === scope) ? h : [...h, { scope, on: true }]), 700) },
    toggleHandoff: (scope: string) => setHandoffs(h => h.map(x => x.scope === scope ? { ...x, on: !x.on } : x)),
    discard: (id: string) => finish(id, 'Thrown away'),
    answer: (wb: WorkBlock, o: string) => finish(wb.id, doneMessage(wb, o)),
    undo: (ids: string[]) => ids.forEach(id => { clearTimeout(timers.current.get(id)); patch(id, { state: 'waiting', doneMsg: undefined, doneNote: undefined }) }),
    reply: (wb: WorkBlock, text: string) => {
      const id = wb.id
      setSt(s => ({ ...s, [id]: { ...s[id], thread: [...s[id].thread, { who: 'me', text }] } }))
      const doc = isDoc(wb.body)
      setTimeout(() => {
        patch(id, { thinking: true })
        setTimeout(() => {
          setSt(s => ({ ...s, [id]: { ...s[id], thinking: false, thread: [...s[id].thread, { who: 'ai', text: doc ? "Done, here's the warmer version. It now mentions Thursday." : "Got it. I'll take that into account." }] } }))
          if (isDoc(wb.body)) patch(id, { content: REWRITES[id] ?? (wb.body.content + "\n\nP.S. Let me know if you'd like any changes.") })
        }, 1100)
      }, 850)
    },
    instruct: (text: string) => {
      const id = 'wb-new-1'
      if (items.some(w => w.id === id)) return
      const card: WorkBlock = {
        id, title: 'Reply to Daniel, kickoff moves to the 9th',
        why: `Drafted from what you just told me: "${text}". Have a look before it goes.`,
        source: 'Gmail', urgency: 'today', raisedAt: new Date().toISOString(),
        body: { kind: 'document', fields: [{ label: 'To', value: 'daniel@acme.com' }, { label: 'Subject', value: 'Kickoff, moving to the 9th' }],
          content: "Hi Daniel,\n\nQuick update, we're moving kickoff to the 9th. Same agenda, same time. I'll send a fresh invite in a minute.\n\nShout if that causes any trouble on your side." },
        actions: [{ kind: 'approve', label: 'Send it' }, { kind: 'edit' }, { kind: 'discard' }],
      }
      setItems(i => [card, ...i]); patch(id, fresh())
    },
  }
  return api
}
export type SurfaceApi = ReturnType<typeof useSurface>
