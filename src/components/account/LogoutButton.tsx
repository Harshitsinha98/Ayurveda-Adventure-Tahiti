'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'

import { useT } from '@/i18n/client'
import { account } from '@/lib/account-client'

export function LogoutButton() {
  const t = useT().account
  const router = useRouter()
  const [busy, setBusy] = useState(false)

  return (
    <button
      type="button"
      disabled={busy}
      onClick={async () => {
        setBusy(true)
        await account.logout()
        router.push('/')
        router.refresh()
      }}
      className="rounded-[2px] border border-plum-800/20 px-5 py-2.5 text-sm font-semibold text-plum-800 transition hover:bg-plum-800 hover:text-sand-50 disabled:opacity-60"
    >
      {t.logout}
    </button>
  )
}
