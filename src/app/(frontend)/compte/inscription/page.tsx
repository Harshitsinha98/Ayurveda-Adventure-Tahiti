import type { Metadata } from 'next'
import { Suspense } from 'react'

import { AccountShell } from '@/components/account/AccountShell'
import { RegisterForm } from '@/components/account/AccountForms'
import { getT } from '@/i18n/server'

export const dynamic = 'force-dynamic'

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getT()
  return { title: t.account.register, robots: { index: false, follow: false } }
}

export default async function RegisterPage() {
  const { t } = await getT()
  return (
    <AccountShell eyebrow={t.account.eyebrow} title={t.account.registerTitle} subtitle={t.account.registerSubtitle} wide>
      <Suspense>
        <RegisterForm />
      </Suspense>
    </AccountShell>
  )
}
