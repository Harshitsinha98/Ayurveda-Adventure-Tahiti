import type { Metadata } from 'next'
import { Suspense } from 'react'

import { AccountShell } from '@/components/account/AccountShell'
import { VerifyHandler } from '@/components/account/AccountForms'
import { getT } from '@/i18n/server'

export const dynamic = 'force-dynamic'

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getT()
  return { title: t.account.verifyWait, robots: { index: false, follow: false } }
}

export default async function VerifyPage() {
  const { t } = await getT()
  return (
    <AccountShell eyebrow={t.account.eyebrow} title={t.account.checkEmailTitle}>
      <Suspense>
        <VerifyHandler />
      </Suspense>
    </AccountShell>
  )
}
