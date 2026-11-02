import type { Metadata } from 'next'
import { Suspense } from 'react'

import { AccountShell } from '@/components/account/AccountShell'
import { ForgotForm } from '@/components/account/AccountForms'
import { getT } from '@/i18n/server'

export const dynamic = 'force-dynamic'

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getT()
  return { title: t.account.forgotTitle, robots: { index: false, follow: false } }
}

export default async function ForgotPage() {
  const { t } = await getT()
  return (
    <AccountShell eyebrow={t.account.eyebrow} title={t.account.forgotTitle} subtitle={t.account.forgotSubtitle}>
      <Suspense>
        <ForgotForm />
      </Suspense>
    </AccountShell>
  )
}
