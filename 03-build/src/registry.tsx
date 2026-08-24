import type React from 'react'
/**
 * Renderer registry — the whole scalability claim in one object.
 *
 * `kind → component`. Adding a kind of work means adding one entry here.
 * Anything not registered falls through to <Fallback>, which still shows
 * the envelope, whatever data came with the body, and the actions.
 */
import type { Body, DocumentBody, DiffBody, EvidenceBody, UnknownBody } from './contract/work-block'
import { Icon } from './icons'

type BodyProps<B> = { body: B; editing?: boolean; contentRef?: React.RefObject<HTMLDivElement | null>; onAnswer?: (o: string) => void; contentOverride?: string }

export function Document({ body, editing, contentRef, contentOverride }: BodyProps<DocumentBody>) {
  return (
    <div className="work">
      <div className="fields">
        {body.fields.map(f => <div key={f.label}>{f.label === 'To' ? <Icon.at /> : <Icon.tag />}<b>{f.label}</b>{f.value}</div>)}
      </div>
      <div className="content" ref={contentRef} contentEditable={editing || undefined} suppressContentEditableWarning>{contentOverride ?? body.content}</div>
      {body.context && <div className="context"><Icon.quote /><span className="label">{body.context.label}</span>{body.context.content}</div>}
    </div>
  )
}

export function Diff({ body, editing }: BodyProps<DiffBody>) {
  return (
    <div className="work">
      <div className="path">{body.path.map((p, i) => <span key={i} style={{ display: 'contents' }}>{i > 0 && <Icon.crumb />}{p}</span>)}</div>
      {body.changes.map(c => (
        <div className="change" key={c.field}>
          <span className="f">{c.field}</span>
          <span className="vals">
            <span className={`pill before ${c.before === null ? 'is-empty' : ''}`}>{c.before === null ? 'empty' : c.before}</span>
            <span className="arr"><Icon.arr /></span>
            <span className="pill after" contentEditable={editing || undefined} suppressContentEditableWarning>{c.after}</span>
          </span>
        </div>
      ))}
    </div>
  )
}

export function Evidence({ body, onAnswer }: BodyProps<EvidenceBody>) {
  return (
    <div className="work">
      <div className="question">{body.question}</div>
      <div className="found">
        {body.found.map(f => <div key={f.label}><span className="k">{f.label}</span><span className={`v ${f.long ? 'long' : ''}`}>{f.value}</span></div>)}
      </div>
      {body.options && (
        <div className="seg" role="group" aria-label="Answers">
          {body.options.map((o, i) => <button key={o} onClick={() => onAnswer?.(o)} data-tip={`${o} · ${i + 1}`}>{o}</button>)}
        </div>
      )}
    </div>
  )
}

/** A kind this build has never seen. Plain words, the data it came with, and the actions still work. */
export function Fallback({ body }: BodyProps<UnknownBody>) {
  const data = (body.data && typeof body.data === 'object') ? body.data as Record<string, unknown> : {}
  return (
    <div className="work">
      <div className="fallback"><span>⚠︎</span><div>
        <b>I can't show this kind of work here yet.</b>Here is what came with it:
        <div className="kv">{Object.entries(data).map(([k, v]) => <span key={k}><b>{k}</b> {Array.isArray(v) ? v.join(', ') : String(v)}</span>)}</div>
      </div></div>
    </div>
  )
}

export const registry: Record<string, (p: BodyProps<any>) => React.JSX.Element> = {
  document: Document,
  diff: Diff,
  evidence: Evidence,
}

export function renderBody(body: Body, props: Omit<BodyProps<any>, 'body'>) {
  const R = registry[body.kind] ?? Fallback
  return <R body={body} {...props} />
}

export const isRegistered = (body: Body) => body.kind in registry
