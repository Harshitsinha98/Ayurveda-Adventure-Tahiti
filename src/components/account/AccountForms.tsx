'use client'

import { Loader2 } from 'lucide-react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'

import { GoogleButton } from '@/components/account/GoogleButton'
import { useT } from '@/i18n/client'
import { account } from '@/lib/account-client'

type State = 'idle' | 'busy' | 'done' | 'error'

function Field(props: React.InputHTMLAttributes<HTMLInputElement> & { label: string; hint?: string }) {
  const { label, hint, id, ...rest } = props
  return (
    <div>
      <label className="label" htmlFor={id}>
        {label}
        {rest.required ? ' *' : ''}
      </label>
      <input id={id} className="field" {...rest} />
      {hint && <p className="mt-1 text-xs text-ink-soft">{hint}</p>}
    </div>
  )
}

function Submit({ busy, label, busyLabel }: { busy: boolean; label: string; busyLabel: string }) {
  return (
    <button
      type="submit"
      disabled={busy}
      className="inline-flex w-full items-center justify-center gap-2 rounded-[2px] bg-plum-800 px-7 py-3.5 text-sm font-semibold text-sand-50 transition hover:bg-plum-700 disabled:opacity-60"
    >
      {busy && <Loader2 size={16} className="animate-spin" />}
      {busy ? busyLabel : label}
    </button>
  )
}

/* ------------------------------------------------------------------ LOGIN */
export function LoginForm() {
  const t = useT().account
  const router = useRouter()
  const sp = useSearchParams()
  const [state, setState] = useState<State>('idle')
  const [err, setErr] = useState('')

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const f = Object.fromEntries(new FormData(e.currentTarget)) as Record<string, string>
    setState('busy')
    setErr('')
    const r = await account.login(f.email, f.password)
    if (r.ok) {
      router.push(sp.get('redirect') || '/compte')
      router.refresh()
      return
    }
    setErr(/verif/i.test(r.error || '') ? t.errUnverified : t.errInvalid)
    setState('error')
  }

  return (
    <div className="grid gap-5">
      <GoogleButton label={t.google} />
      <div className="flex items-center gap-3 text-xs uppercase tracking-widest text-ink-soft">
        <span className="h-px flex-1 bg-plum-800/15" />
        {t.or}
        <span className="h-px flex-1 bg-plum-800/15" />
      </div>
      <form onSubmit={onSubmit} className="grid gap-4">
        <Field id="lg-email" name="email" type="email" required autoComplete="email" label={t.email} />
        <Field id="lg-pass" name="password" type="password" required autoComplete="current-password" label={t.password} />
        <Submit busy={state === 'busy'} label={t.login} busyLabel={t.loggingIn} />
        {state === 'error' && (
          <p role="alert" className="text-sm text-plum-700">
            {err}
          </p>
        )}
      </form>
      <div className="flex flex-wrap justify-between gap-2 text-sm text-ink-soft">
        <Link href="/compte/mot-de-passe-oublie" className="underline hover:text-plum-800">
          {t.forgot}
        </Link>
        <span>
          {t.noAccount}{' '}
          <Link href="/compte/inscription" className="underline hover:text-plum-800">
            {t.register}
          </Link>
        </span>
      </div>
    </div>
  )
}

/* --------------------------------------------------------------- REGISTER */
export function RegisterForm() {
  const t = useT().account
  const [state, setState] = useState<State>('idle')
  const [err, setErr] = useState('')

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const f = Object.fromEntries(new FormData(e.currentTarget)) as Record<string, string>
    setState('busy')
    setErr('')
    const r = await account.register({
      firstName: f.firstName,
      lastName: f.lastName,
      email: f.email,
      password: f.password,
      newsletter: f.newsletter === 'on',
    })
    if (r.ok) {
      setState('done')
      return
    }
    setErr(r.error === 'exists' ? t.errExists : t.errGeneric)
    setState('error')
  }

  if (state === 'done') {
    return (
      <div className="rounded-[3px] bg-sage-200/60 p-8" role="status">
        <p className="font-display text-3xl text-plum-800">{t.checkEmailTitle}</p>
        <p className="mt-2 text-ink-soft">{t.checkEmailText}</p>
      </div>
    )
  }

  return (
    <div className="grid gap-5">
      <GoogleButton label={t.google} />
      <div className="flex items-center gap-3 text-xs uppercase tracking-widest text-ink-soft">
        <span className="h-px flex-1 bg-plum-800/15" />
        {t.or}
        <span className="h-px flex-1 bg-plum-800/15" />
      </div>
      <form onSubmit={onSubmit} className="grid gap-4 sm:grid-cols-2">
        <Field id="rg-first" name="firstName" required autoComplete="given-name" label={t.firstName} />
        <Field id="rg-last" name="lastName" required autoComplete="family-name" label={t.lastName} />
        <div className="sm:col-span-2">
          <Field id="rg-email" name="email" type="email" required autoComplete="email" label={t.email} />
        </div>
        <div className="sm:col-span-2">
          <Field
            id="rg-pass"
            name="password"
            type="password"
            required
            minLength={8}
            autoComplete="new-password"
            label={t.password}
            hint={t.passwordHint}
          />
        </div>
        <label className="flex items-start gap-2 text-sm text-ink-soft sm:col-span-2">
          <input type="checkbox" name="newsletter" className="mt-1" />
          {t.consent}
        </label>
        <div className="sm:col-span-2">
          <Submit busy={state === 'busy'} label={t.register} busyLabel={t.registering} />
        </div>
        {state === 'error' && (
          <p role="alert" className="text-sm text-plum-700 sm:col-span-2">
            {err}
          </p>
        )}
        <p className="text-xs text-ink-soft sm:col-span-2">{t.terms}</p>
      </form>
      <p className="text-sm text-ink-soft">
        {t.haveAccount}{' '}
        <Link href="/compte/connexion" className="underline hover:text-plum-800">
          {t.login}
        </Link>
      </p>
    </div>
  )
}

/* ----------------------------------------------------------------- FORGOT */
export function ForgotForm() {
  const t = useT().account
  const [state, setState] = useState<State>('idle')

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const f = Object.fromEntries(new FormData(e.currentTarget)) as Record<string, string>
    setState('busy')
    await account.forgotPassword(f.email)
    // Always report success (don't reveal whether the email exists).
    setState('done')
  }

  if (state === 'done') {
    return (
      <div className="rounded-[3px] bg-sage-200/60 p-8" role="status">
        <p className="text-ink-soft">{t.forgotDone}</p>
      </div>
    )
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-4">
      <Field id="fg-email" name="email" type="email" required autoComplete="email" label={t.email} />
      <Submit busy={state === 'busy'} label={t.sendLink} busyLabel={t.loggingIn} />
      <p className="text-sm text-ink-soft">
        <Link href="/compte/connexion" className="underline hover:text-plum-800">
          {t.login}
        </Link>
      </p>
    </form>
  )
}

/* ------------------------------------------------------------------ RESET */
export function ResetForm() {
  const t = useT().account
  const sp = useSearchParams()
  const token = sp.get('token') || ''
  const [state, setState] = useState<State>('idle')
  const [err, setErr] = useState('')

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const f = Object.fromEntries(new FormData(e.currentTarget)) as Record<string, string>
    setState('busy')
    setErr('')
    const r = await account.resetPassword(token, f.password)
    if (r.ok) {
      setState('done')
      return
    }
    setErr(t.resetBadToken)
    setState('error')
  }

  if (!token) {
    return <p className="text-sm text-plum-700">{t.resetBadToken}</p>
  }

  if (state === 'done') {
    return (
      <div className="grid gap-4 rounded-[3px] bg-sage-200/60 p-8" role="status">
        <p className="text-ink-soft">{t.resetDone}</p>
        <Link href="/compte/connexion" className="font-semibold text-plum-800 underline">
          {t.login}
        </Link>
      </div>
    )
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-4">
      <Field
        id="rs-pass"
        name="password"
        type="password"
        required
        minLength={8}
        autoComplete="new-password"
        label={t.newPassword}
        hint={t.passwordHint}
      />
      <Submit busy={state === 'busy'} label={t.resetSubmit} busyLabel={t.loggingIn} />
      {state === 'error' && (
        <p role="alert" className="text-sm text-plum-700">
          {err}
        </p>
      )}
    </form>
  )
}

/* ----------------------------------------------------------------- VERIFY */
export function VerifyHandler() {
  const t = useT().account
  const sp = useSearchParams()
  const token = sp.get('token') || ''
  const [state, setState] = useState<State>('busy')

  useEffect(() => {
    if (!token) {
      setState('error')
      return
    }
    account.verifyEmail(token).then((r) => setState(r.ok ? 'done' : 'error'))
  }, [token])

  return (
    <div className="grid gap-4" role="status" aria-live="polite">
      {state === 'busy' && (
        <p className="inline-flex items-center gap-2 text-ink-soft">
          <Loader2 size={16} className="animate-spin" />
          {t.verifyWait}
        </p>
      )}
      {state === 'done' && (
        <div className="grid gap-4 rounded-[3px] bg-sage-200/60 p-8">
          <p className="text-ink-soft">{t.verifyDone}</p>
          <Link href="/compte/connexion" className="font-semibold text-plum-800 underline">
            {t.login}
          </Link>
        </div>
      )}
      {state === 'error' && <p className="text-sm text-plum-700">{t.verifyFail}</p>}
    </div>
  )
}
