'use client'

import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

/** While a payment is pending, poll the booking status and refresh when it changes (webhook is the source of truth). */
export function StatusWatcher({ token, status }: { token: string; status: string }) {
  const router = useRouter()
  useEffect(() => {
    if (status !== 'pending') return
    let n = 0
    const t = setInterval(async () => {
      n++
      const r = await fetch(`/api/booking/status/${token}`, { cache: 'no-store' }).then((x) => x.json()).catch(() => null)
      if ((r && r.status !== 'pending') || n > 40) {
        clearInterval(t)
        router.refresh()
      }
    }, 3000)
    return () => clearInterval(t)
  }, [status, token, router])
  return null
}
