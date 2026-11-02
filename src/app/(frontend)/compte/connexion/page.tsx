import type { Metadata } from 'next'
import { Suspense } from 'react'

import { AccountShell } from '@/components/account/AccountShell'
import { LoginForm } from '@/components/account/AccountForms'
import { getT } from '@/i18n/server'

export const dynamic = 'force-dynamic'

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getT()
  return { title: t.account.login, robots: { index: false, follow: false } }
}

export default async function LoginPage() {
  const { t } = await getT()
  return (
    <AccountShell eyebrow={t.account.eyebrow} title={t.account.loginTitle} subtitle={t.account.loginSubtitle}>
      <Suspense>
        <LoginForm />
      </Suspense>
    </AccountShell>
  )
}
