import type React from 'react'
/* Line icons, all 24-grid, stroke inherits currentColor. */
const S = { fill: 'none', stroke: 'currentColor', strokeWidth: 1.8, strokeLinecap: 'round', strokeLinejoin: 'round' } as const
const B = { ...S, strokeWidth: 2 } as const

export const Icon = {
  chev: () => <svg viewBox="0 0 16 16" {...B}><path d="M4 6l4 4 4-4" /></svg>,
  arr: () => <svg viewBox="0 0 16 16" {...S}><path d="M3 8h10M9 4l4 4-4 4" /></svg>,
  arrR: () => <svg viewBox="0 0 16 16" {...B} strokeWidth={2.2}><path d="M3 8h10M9 4l4 4-4 4" /></svg>,
  check: () => <svg viewBox="0 0 12 12" {...B} strokeWidth={2.2}><path d="M2 6.5l2.5 2.5L10 3.5" /></svg>,
  crumb: () => <svg viewBox="0 0 12 12" {...S} strokeWidth={1.6}><path d="M4.5 2.5L8 6l-3.5 3.5" /></svg>,
  up: () => <svg viewBox="0 0 16 16" {...B}><path d="M8 13V3M4 7l4-4 4 4" /></svg>,
  send: () => <svg viewBox="0 0 24 24" {...B}><path d="M21 3L10 14M21 3l-7 18-4-7-7-4z" /></svg>,
  pen: () => <svg viewBox="0 0 24 24" {...B}><path d="M4 20h4l10-10-4-4L4 16z" /><path d="M13 7l4 4" /></svg>,
  trash: () => <svg viewBox="0 0 24 24" {...B}><path d="M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13" /></svg>,
  reply: () => <svg viewBox="0 0 24 24" {...B}><path d="M4 12a8 8 0 1 1 3 6.2L4 20l1.4-3.5A8 8 0 0 1 4 12z" /></svg>,
  always: () => <svg viewBox="0 0 24 24" {...B}><path d="M17 2l4 4-4 4" /><path d="M3 11V9a4 4 0 0 1 4-4h14" /><path d="M7 22l-4-4 4-4" /><path d="M21 13v2a4 4 0 0 1-4 4H3" /></svg>,
  quote: () => <svg viewBox="0 0 24 24" fill="currentColor"><path d="M7 7h4v4H8v2H6V9a2 2 0 0 1 1-2zm8 0h4v4h-3v2h-2V9a2 2 0 0 1 1-2z" /></svg>,
  at: () => <svg viewBox="0 0 24 24" {...B}><circle cx="12" cy="12" r="4" /><path d="M16 12v1.5a2.5 2.5 0 0 0 5 0V12a9 9 0 1 0-3.5 7.1" /></svg>,
  tag: () => <svg viewBox="0 0 24 24" {...B}><path d="M3 12V4h8l9 9-8 8z" /><circle cx="7.5" cy="8.5" r="1.5" /></svg>,
  clock: () => <svg viewBox="0 0 24 24" {...S}><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></svg>,
  shield: () => <svg viewBox="0 0 24 24" {...S}><path d="M12 3l7 4v5c0 5-3.5 8-7 9-3.5-1-7-4-7-9V7z" /><path d="M9 12l2 2 4-4" /></svg>,
  mic: () => <svg viewBox="0 0 24 24" {...S}><rect x="9" y="3" width="6" height="11" rx="3" /><path d="M5 11a7 7 0 0 0 14 0M12 18v3" /></svg>,
}

/* Source icons — the dock tile per tool. Unknown sources fall back to the tag. */
const SRC: Record<string, () => React.JSX.Element> = {
  'Gmail': () => <svg viewBox="0 0 24 24" {...S}><rect x="3" y="5" width="18" height="14" rx="3" /><path d="M3 8l9 6 9-6" /></svg>,
  'Monday.com': () => <svg viewBox="0 0 24 24" {...S}><rect x="3" y="4" width="18" height="16" rx="3" /><path d="M3 10h18M9 10v10" /></svg>,
  'Google Calendar': () => <svg viewBox="0 0 24 24" {...S}><rect x="3" y="5" width="18" height="16" rx="3" /><path d="M3 10h18M8 3v4M16 3v4" /></svg>,
  'Calendar': () => <svg viewBox="0 0 24 24" {...S}><rect x="3" y="5" width="18" height="16" rx="3" /><path d="M3 10h18M8 3v4M16 3v4" /></svg>,
  'Stripe': () => <svg viewBox="0 0 24 24" {...S}><rect x="3" y="6" width="18" height="12" rx="3" /><path d="M3 10h18M7 14h3" /></svg>,
  'Coupa': () => <svg viewBox="0 0 24 24" {...S}><path d="M12 3l8 4.5v9L12 21l-8-4.5v-9z" /><path d="M12 12v9M4 7.5l8 4.5 8-4.5" /></svg>,
  'sheet': () => <svg viewBox="0 0 24 24" {...S}><rect x="3" y="4" width="18" height="16" rx="3" /><path d="M3 10h18M3 15h18M9 4v16" /></svg>,
}
export function SourceIcon({ source }: { source: string }) {
  const K = SRC[source] || (source.toLowerCase().includes('sheet') ? SRC.sheet : Icon.tag)
  return <K />
}

/* The assistant's mark — the reference blob, ambient. */
export function Blob() {
  const d0 = 'M23 50 C20 33 38 20 55 32 C71 43 82 60 67 79 C56 93 33 88 28 72 C25 64 25 58 23 50 Z'
  const d1 = 'M25 48 C24 30 44 20 58 30 C74 41 84 62 70 77 C58 90 36 90 29 74 C25 66 26 56 25 48 Z'
  const d2 = 'M22 52 C19 35 36 22 52 33 C68 44 80 58 66 80 C55 94 32 86 27 71 C23 63 24 60 22 52 Z'
  const vals = [d0, d1, d2, d0].join(';')
  const spl = '.4 0 .6 1;.4 0 .6 1;.4 0 .6 1'
  return (
    <span className="spark2"><svg viewBox="0 0 100 100" aria-hidden="true">
      <defs>
        <radialGradient id="gO" cx="35%" cy="32%" r="75%"><stop offset="0" stopColor="#ffb066" /><stop offset=".55" stopColor="#ee6a3e" /><stop offset="1" stopColor="#d8433d" /></radialGradient>
        <radialGradient id="gB" cx="38%" cy="35%" r="75%"><stop offset="0" stopColor="#6fb0ff" /><stop offset=".55" stopColor="#3f6ff2" /><stop offset="1" stopColor="#2a3fcc" /></radialGradient>
        <linearGradient id="gF" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#f2548f" /><stop offset=".48" stopColor="#b733cf" /><stop offset="1" stopColor="#5233d6" />
          <animateTransform attributeName="gradientTransform" type="rotate" values="0 .5 .5;25 .5 .5;0 .5 .5" dur="10.5s" repeatCount="indefinite" calcMode="spline" keySplines=".4 0 .6 1;.4 0 .6 1" /></linearGradient>
        <radialGradient id="gH" cx="30%" cy="25%" r="55%"><stop offset="0" stopColor="#fff" stopOpacity=".45" /><stop offset="1" stopColor="#fff" stopOpacity="0" /></radialGradient>
        <filter id="goo" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur in="SourceGraphic" stdDeviation="1.8" result="b" /><feColorMatrix in="b" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 22 -9" result="g" /><feComposite in="SourceGraphic" in2="g" operator="atop" /></filter>
        <filter id="glow" x="-60%" y="-60%" width="220%" height="220%"><feGaussianBlur stdDeviation="4.5" /></filter>
        <filter id="sh" x="-30%" y="-30%" width="160%" height="160%"><feDropShadow dx="0" dy="3" stdDeviation="3" floodColor="#2a1a4a" floodOpacity=".2" /></filter>
      </defs>
      <g className="aura" filter="url(#glow)" opacity=".3">
        <circle cx="35" cy="33" r="21" fill="#f08a4a" /><circle cx="69" cy="52" r="21" fill="#4f7cf5" /><path d={d0} fill="#b33fd0" />
      </g>
      <g filter="url(#sh)"><g filter="url(#goo)">
        <circle cx="35" cy="33" r="21" fill="url(#gO)">
          <animate attributeName="cx" values="35;38;33;35" dur="7.5s" repeatCount="indefinite" calcMode="spline" keySplines={spl} />
          <animate attributeName="cy" values="33;36;31;33" dur="9s" repeatCount="indefinite" calcMode="spline" keySplines={spl} />
          <animate attributeName="r" values="21;22.5;20;21" dur="6.5s" repeatCount="indefinite" calcMode="spline" keySplines={spl} />
        </circle>
        <circle cx="69" cy="52" r="21" fill="url(#gB)">
          <animate attributeName="cx" values="69;66;71;69" dur="8s" repeatCount="indefinite" calcMode="spline" keySplines={spl} />
          <animate attributeName="cy" values="52;49;55;52" dur="10s" repeatCount="indefinite" calcMode="spline" keySplines={spl} />
          <animate attributeName="r" values="21;20;22.5;21" dur="7.5s" repeatCount="indefinite" calcMode="spline" keySplines={spl} />
        </circle>
        <path fill="url(#gF)" d={d0}><animate attributeName="d" dur="11.5s" repeatCount="indefinite" calcMode="spline" keySplines={spl} values={vals} /></path>
        <path fill="url(#gH)" d={d0}><animate attributeName="d" dur="11.5s" repeatCount="indefinite" calcMode="spline" keySplines={spl} values={vals} /></path>
      </g></g>
    </svg></span>
  )
}
