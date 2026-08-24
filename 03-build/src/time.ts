/**
 * The fixtures are written against one fixed morning. Rather than freeze the
 * surface there, the whole day is shifted so it lands on now: the gaps between
 * items stay exactly as written ("2h ago", "Thu"), but the clock is the reader's.
 */
const ANCHOR = Date.parse('2026-08-23T10:20:00Z')
export const NOW = Date.now()
const OFFSET = NOW - ANCHOR

export const shift = (iso: string) => new Date(Date.parse(iso) + OFFSET)

/** Relative for today, weekday for anything older. Never a raw date. */
export function when(iso: string) {
  const d = shift(iso)
  const h = (NOW - d.getTime()) / 36e5
  if (h < 1) return 'Just now'
  if (h < 24) return `${Math.round(h)}h ago`
  if (h < 48) return 'Yesterday'
  return d.toLocaleDateString('en-GB', { weekday: 'short' })
}

/** `?hour=21` forces a time of day, for demos and for seeing the greeting change. */
const FORCED = Number(new URLSearchParams(location.search).get('hour'))
const now = () => {
  const d = new Date(NOW)
  if (!Number.isNaN(FORCED) && FORCED >= 0 && FORCED <= 23) d.setHours(FORCED)
  return d
}

/** "Sun · 15 Feb" for the header. */
export const todayLabel = () => ({
  weekday: now().toLocaleDateString('en-GB', { weekday: 'short' }),
  date: now().toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }),
})

/** The assistant says the time of day, not the hour. */
export const greeting = () => {
  const h = now().getHours()
  if (h < 5) return 'Late one'
  if (h < 12) return 'Morning'
  if (h < 18) return 'Afternoon'
  if (h < 22) return 'Evening'
  return 'Late one'
}

/** "SUNDAY · 14:32" above the greeting, plus anything the day wants to add. */
export const introSub = (extra?: string) =>
  [now().toLocaleDateString('en-GB', { weekday: 'long' }),
   now().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }),
   extra].filter(Boolean).join(' · ')
