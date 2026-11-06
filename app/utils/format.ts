// Feste Zeitzone, damit Server und Browser denselben Text erzeugen.
const dayFormatter = new Intl.DateTimeFormat('de-AT', {
  weekday: 'short',
  day: '2-digit',
  month: '2-digit',
  timeZone: 'UTC',
})

export function formatDay(day: string): string {
  return dayFormatter.format(new Date(`${day}T00:00:00Z`))
}

export function formatTimeRange(item: { startTime: string, endTime: string }): string {
  return `${item.startTime}–${item.endTime}`
}
