import type { Body, DocumentBody, DiffBody, EvidenceBody } from './contract/work-block'
/* `UnknownBody.kind` is `string`, so `body.kind === 'document'` cannot narrow on its own. These can. */
export const isDoc = (b: Body): b is DocumentBody => b.kind === 'document'
export const isDiff = (b: Body): b is DiffBody => b.kind === 'diff'
export const isEvidence = (b: Body): b is EvidenceBody => b.kind === 'evidence'
