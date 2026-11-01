import { formatInTimeZone, fromZonedTime, toZonedTime } from 'date-fns-tz'

/** Eliane works in Tahiti time (UTC−10, no daylight saving). */
export const TZ = 'Pacific/Tahiti'

export const tahitiDateKey = (d: Date) => formatInTimeZone(d, TZ, 'yyyy-MM-dd')

/** Build a UTC Date from a Tahiti calendar day and "HH:mm". */
export const atTahiti = (dateKey: string, hhmm: string) => fromZonedTime(`${dateKey}T${hhmm}:00`, TZ)

export const tahitiWeekday = (d: Date) => toZonedTime(d, TZ).getDay() // 0 = Sunday

export const fmtTahiti = (d: Date | string, pattern = "EEEE d MMMM yyyy 'à' HH'h'mm") =>
  formatInTimeZone(new Date(d), TZ, pattern, { locale: undefined })

export const fmtLong = (d: Date | string, tz = TZ) =>
  new Date(d).toLocaleString('fr-FR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    timeZone: tz,
  })

export const fmtDay = (d: Date | string, tz = TZ) =>
  new Date(d).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric', timeZone: tz })

/** Calendar dates stored without a time (day pickers): format in UTC to avoid shifting the day. */
export const fmtDateOnly = (d: Date | string) =>
  new Date(d).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' })

export const fmtTime = (d: Date | string, tz = TZ) =>
  new Date(d).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit', timeZone: tz })
