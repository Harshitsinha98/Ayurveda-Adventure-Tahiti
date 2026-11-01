'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { ArrowLeft, ArrowRight, CalendarDays, Check, CreditCard, Landmark, Loader2, Ticket } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'

import { EASE } from '@/components/motion/primitives'

export type WidgetOccurrence = {
  id: number | string
  startsAt: string
  endsAt?: string | null
  seatsLeft: number
  priceOverride?: number | null
  location?: string | null
  scheduleCount?: number
}

export type WidgetOffering = {
  slug: string
  kind: string
  title: string
  price?: number | null
  priceOptions?: { label: string; price: number }[]
  extras?: { label: string; price: number; description?: string | null }[]
  maxPerBooking?: number | null
  depositPercent?: number | null
  bookingMode: string
  creditEligible?: boolean | null
  durationMinutes?: number | null
  cancellationPolicy?: string | null
}

type Slot = { start: string; end: string }

const TAHITI = 'Pacific/Tahiti'
const nf = new Intl.NumberFormat('fr-FR')
const xpf = (n: number) => `${nf.format(n)} XPF`

const fmt = (iso: string, opts: Intl.DateTimeFormatOptions, tz = TAHITI) => new Date(iso).toLocaleString('fr-FR', { ...opts, timeZone: tz })

function useBrowserTz() {
  const [tz, setTz] = useState<string>(TAHITI)
  useEffect(() => setTz(Intl.DateTimeFormat().resolvedOptions().timeZone || TAHITI), [])
  return tz
}

export function BookingWidget({ offering, occurrences = [] }: { offering: WidgetOffering; occurrences?: WidgetOccurrence[] }) {
  const tz = useBrowserTz()
  const isSeance = offering.kind === 'seance'
  const isTrip = offering.kind === 'voyage'
  const free = offering.bookingMode === 'free' || offering.price === 0

  const [step, setStep] = useState(0)
  const [slots, setSlots] = useState<Record<string, Slot[]> | null>(null)
  const [day, setDay] = useState<string | null>(null)
  const [slot, setSlot] = useState<Slot | null>(null)
  const [occ, setOcc] = useState<WidgetOccurrence | null>(occurrences.length === 1 ? occurrences[0] : null)
  const [priceOption, setPriceOption] = useState<number | null>(null)
  const [extras, setExtras] = useState<number[]>([])
  const [qty, setQty] = useState(1)
  const [participants, setParticipants] = useState<string[]>([])
  const [payment, setPayment] = useState<'card' | 'transfer' | 'credit'>('card')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [contact, setContact] = useState({ firstName: '', lastName: '', email: '', phone: '', country: 'Polynésie française', message: '' })
  const bind = (k: keyof typeof contact) => ({
    name: k,
    value: contact[k],
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setContact((c) => ({ ...c, [k]: e.target.value })),
  })
  const [idem] = useState(() => (typeof crypto !== 'undefined' && 'randomUUID' in crypto ? crypto.randomUUID() : undefined))

  useEffect(() => {
    if (!isSeance) return
    fetch(`/api/booking/slots?offering=${encodeURIComponent(offering.slug)}`, { cache: 'no-store' })
      .then((r) => r.json())
      .then((d) => {
        setSlots(d.slots ?? {})
        const first = Object.keys(d.slots ?? {})[0]
        if (first) setDay(first)
      })
      .catch(() => setSlots({}))
  }, [isSeance, offering.slug])

  const max = Math.max(1, offering.maxPerBooking ?? 1, 1)
  const maxQty = Math.min(max, occ ? occ.seatsLeft : max)
  const unit = priceOption != null ? offering.priceOptions![priceOption].price : (occ?.priceOverride ?? offering.price ?? 0)
  const total = useMemo(
    () => unit * qty + extras.reduce((s, i) => s + (offering.extras?.[i]?.price ?? 0) * qty, 0),
    [unit, qty, extras, offering.extras],
  )
  const deposit = offering.depositPercent && offering.depositPercent < 100 ? Math.round((total * offering.depositPercent) / 100) : total

  const hasOptions = (offering.priceOptions?.length ?? 0) > 0 || (offering.extras?.length ?? 0) > 0 || max > 1
  const steps = ['Date', ...(hasOptions ? ['Options'] : []), 'Coordonnées', 'Confirmation']
  const stepName = steps[step]
  const canNext = stepName === 'Date' ? Boolean(isSeance ? slot : occ) : true

  async function submit(form: HTMLFormElement) {
    const f = new FormData(form)
    setSubmitting(true)
    setError(null)
    const res = await fetch('/api/booking/checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        type: 'offering',
        offering: offering.slug,
        occurrence: occ?.id,
        slotStart: slot?.start,
        priceOption,
        extras,
        quantity: qty,
        participants: participants.filter(Boolean),
        payment: free ? 'free' : payment,
        timezone: tz,
        message: contact.message || undefined,
        acceptTerms: f.get('terms') === 'on' ? true : false,
        newsletter: f.get('newsletter') === 'on',
        customer: {
          firstName: contact.firstName,
          lastName: contact.lastName,
          email: contact.email,
          phone: contact.phone || undefined,
          country: contact.country || undefined,
        },
        idempotencyKey: idem,
      }),
    }).catch(() => null)
    const data = await res?.json().catch(() => null)
    if (res?.ok && data?.redirectUrl) {
      window.location.assign(data.redirectUrl)
      return
    }
    setError(data?.error || 'Impossible de finaliser la réservation. Vérifiez votre connexion et réessayez.')
    setSubmitting(false)
    if (res?.status === 409 && isSeance) {
      setSlot(null)
      setStep(0)
      fetch(`/api/booking/slots?offering=${encodeURIComponent(offering.slug)}`, { cache: 'no-store' }).then((r) => r.json()).then((d) => setSlots(d.slots ?? {}))
    }
  }

  const dayKeys = slots ? Object.keys(slots) : []

  return (
    <div className="min-w-0 overflow-hidden rounded-[28px] border border-plum-800/10 bg-sand-50 shadow-[0_40px_80px_-50px_rgba(42,11,28,0.5)]">
      <div className="flex items-center justify-between gap-4 border-b border-plum-800/10 px-6 py-5 sm:px-8">
        <div>
          <p className="eyebrow text-[0.65rem] text-saffron-600">Réserver</p>
          <p className="font-display text-2xl text-plum-800">{offering.title}</p>
        </div>
        <ol className="hidden items-center gap-2 sm:flex" aria-label="Étapes">
          {steps.map((s, i) => (
            <li key={s} className="flex items-center gap-2" aria-current={i === step ? 'step' : undefined}>
              <span className={`grid h-7 w-7 place-items-center rounded-full text-xs font-semibold transition ${i < step ? 'bg-sage-500 text-sand-50' : i === step ? 'bg-plum-800 text-sand-50' : 'bg-sand-200 text-ink-soft'}`}>
                {i < step ? <Check size={14} /> : i + 1}
              </span>
              <span className="sr-only">{s}</span>
            </li>
          ))}
        </ol>
      </div>

      <form
        className="px-6 py-7 sm:px-8"
        onSubmit={(e) => {
          e.preventDefault()
          if (stepName === 'Confirmation') submit(e.currentTarget)
          else if (canNext) setStep((s) => s + 1)
        }}
      >
        <AnimatePresence mode="wait" initial={false}>
          <motion.div key={stepName} initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -24 }} transition={{ duration: 0.4, ease: EASE }}>
            {stepName === 'Date' && isSeance && (
              <fieldset className="min-w-0">
                <legend className="mb-4 flex items-center gap-2 text-sm font-semibold text-ink-soft">
                  <CalendarDays size={16} /> Choisissez un jour puis un horaire
                </legend>
                {!slots && <p className="flex items-center gap-2 text-ink-soft"><Loader2 className="animate-spin" size={16} /> Chargement des disponibilités…</p>}
                {slots && dayKeys.length === 0 && <p className="text-ink-soft">Aucun créneau disponible pour le moment. Écrivez-moi et nous trouverons un moment ensemble.</p>}
                {dayKeys.length > 0 && (
                  <>
                    <div className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-3 [scrollbar-width:thin]" role="listbox" aria-label="Jours disponibles">
                      {dayKeys.map((k) => {
                        const d = new Date(`${k}T12:00:00-10:00`)
                        const on = k === day
                        return (
                          <button
                            type="button"
                            key={k}
                            role="option"
                            aria-selected={on}
                            onClick={() => {
                              setDay(k)
                              setSlot(null)
                            }}
                            className={`flex min-w-[68px] flex-col items-center rounded-2xl border px-3 py-3 transition ${on ? 'border-plum-800 bg-plum-800 text-sand-50' : 'border-plum-800/12 bg-sand-100 text-plum-800 hover:border-plum-800/40'}`}
                          >
                            <span className="text-[0.68rem] uppercase tracking-[0.12em] opacity-80">{fmt(d.toISOString(), { weekday: 'short' })}</span>
                            <span className="font-display text-2xl leading-tight">{fmt(d.toISOString(), { day: 'numeric' })}</span>
                            <span className="text-[0.68rem] opacity-80">{fmt(d.toISOString(), { month: 'short' })}</span>
                          </button>
                        )
                      })}
                    </div>
                    <div className="mt-3 grid grid-cols-3 gap-2 sm:grid-cols-4" role="listbox" aria-label="Horaires">
                      {(day ? slots![day] : []).map((s) => {
                        const on = slot?.start === s.start
                        return (
                          <button
                            type="button"
                            key={s.start}
                            role="option"
                            aria-selected={on}
                            onClick={() => setSlot(s)}
                            className={`rounded-xl border px-2 py-2.5 text-sm font-semibold transition ${on ? 'border-saffron-500 bg-saffron-100 text-plum-900' : 'border-plum-800/12 text-plum-800 hover:border-plum-800/40'}`}
                          >
                            {fmt(s.start, { hour: '2-digit', minute: '2-digit' })}
                          </button>
                        )
                      })}
                    </div>
                    <p className="mt-4 text-xs text-ink-soft">
                      Heures de Tahiti.
                      {slot && tz !== TAHITI && (
                        <> Chez vous ({tz.split('/').pop()?.replace('_', ' ')}) : <strong>{fmt(slot.start, { weekday: 'long', day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit' }, tz)}</strong>.</>
                      )}
                    </p>
                  </>
                )}
              </fieldset>
            )}

            {stepName === 'Date' && !isSeance && (
              <fieldset className="min-w-0">
                <legend className="mb-4 text-sm font-semibold text-ink-soft">{isTrip ? 'Départ' : 'Choisissez une date'}</legend>
                {occurrences.length === 0 && <p className="text-ink-soft">Les prochaines dates seront bientôt annoncées. Inscrivez-vous à la newsletter ou écrivez-moi pour être prévenu·e.</p>}
                <div className="space-y-2">
                  {occurrences.map((o) => {
                    const on = occ?.id === o.id
                    const full = o.seatsLeft <= 0
                    return (
                      <button
                        type="button"
                        key={o.id}
                        disabled={full}
                        onClick={() => {
                          setOcc(o)
                          setQty(1)
                        }}
                        aria-pressed={on}
                        className={`flex w-full items-center justify-between gap-4 rounded-2xl border px-5 py-4 text-left transition disabled:cursor-not-allowed disabled:opacity-50 ${on ? 'border-plum-800 bg-plum-100' : 'border-plum-800/12 hover:border-plum-800/40'}`}
                      >
                        <span>
                          <span className="font-display block text-xl text-plum-800">
                            {fmt(o.startsAt, { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                          </span>
                          <span className="text-sm text-ink-soft">
                            {o.endsAt && isTrip ? `Retour le ${fmt(o.endsAt, { day: 'numeric', month: 'long' })}` : fmt(o.startsAt, { hour: '2-digit', minute: '2-digit' })}
                            {o.scheduleCount ? ` · ${o.scheduleCount} séances` : ''}
                            {o.location ? ` · ${o.location}` : ''}
                          </span>
                        </span>
                        <span className={`whitespace-nowrap text-sm font-semibold ${full ? 'text-ink-soft' : o.seatsLeft <= 3 ? 'text-saffron-600' : 'text-sage-700'}`}>
                          {full ? 'Complet' : `${o.seatsLeft} place${o.seatsLeft > 1 ? 's' : ''}`}
                        </span>
                      </button>
                    )
                  })}
                </div>
              </fieldset>
            )}

            {stepName === 'Options' && (
              <div className="space-y-7">
                {(offering.priceOptions?.length ?? 0) > 0 && (
                  <fieldset className="min-w-0">
                    <legend className="label">Tarif</legend>
                    <div className="space-y-2">
                      {[{ label: 'Tarif normal', price: occ?.priceOverride ?? offering.price ?? 0 }, ...offering.priceOptions!].map((p, i) => {
                        const v = i === 0 ? null : i - 1
                        return (
                          <label key={p.label} className={`flex items-center justify-between rounded-2xl border px-4 py-3 ${priceOption === v ? 'border-plum-800 bg-plum-100' : 'border-plum-800/12'}`}>
                            <span className="flex items-center gap-3">
                              <input type="radio" name="price" checked={priceOption === v} onChange={() => setPriceOption(v)} className="accent-plum-800" />
                              {p.label}
                            </span>
                            <span className="font-semibold text-plum-800">{xpf(p.price)}</span>
                          </label>
                        )
                      })}
                    </div>
                  </fieldset>
                )}
                {(offering.extras?.length ?? 0) > 0 && (
                  <fieldset className="min-w-0">
                    <legend className="label">Options</legend>
                    <div className="space-y-2">
                      {offering.extras!.map((x, i) => (
                        <label key={x.label} className={`flex items-center justify-between gap-4 rounded-2xl border px-4 py-3 ${extras.includes(i) ? 'border-plum-800 bg-plum-100' : 'border-plum-800/12'}`}>
                          <span className="flex items-center gap-3">
                            <input type="checkbox" checked={extras.includes(i)} onChange={(e) => setExtras((v) => (e.target.checked ? [...v, i] : v.filter((k) => k !== i)))} className="accent-plum-800" />
                            <span>
                              {x.label}
                              {x.description && <span className="block text-xs text-ink-soft">{x.description}</span>}
                            </span>
                          </span>
                          <span className="whitespace-nowrap font-semibold text-plum-800">+ {xpf(x.price)}</span>
                        </label>
                      ))}
                    </div>
                  </fieldset>
                )}
                {max > 1 && (
                  <fieldset className="min-w-0">
                    <legend className="label">Nombre de participants</legend>
                    <div className="flex items-center gap-3">
                      <button type="button" aria-label="Moins" onClick={() => setQty((q) => Math.max(1, q - 1))} className="h-11 w-11 rounded-full border border-plum-800/20 text-xl text-plum-800">−</button>
                      <span className="font-display w-10 text-center text-3xl text-plum-800" aria-live="polite">{qty}</span>
                      <button type="button" aria-label="Plus" onClick={() => setQty((q) => Math.min(maxQty, q + 1))} className="h-11 w-11 rounded-full border border-plum-800/20 text-xl text-plum-800">+</button>
                    </div>
                    {qty > 1 && (
                      <div className="mt-4 space-y-2">
                        {Array.from({ length: qty - 1 }).map((_, i) => (
                          <input key={i} className="field" placeholder={`Nom du participant ${i + 2}`} value={participants[i] ?? ''} onChange={(e) => setParticipants((p) => Object.assign([...p], { [i]: e.target.value }))} />
                        ))}
                      </div>
                    )}
                  </fieldset>
                )}
              </div>
            )}

            {stepName === 'Coordonnées' && (
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="label" htmlFor="bw-first">Prénom *</label>
                  <input id="bw-first" {...bind('firstName')} required autoComplete="given-name" className="field" />
                </div>
                <div>
                  <label className="label" htmlFor="bw-last">Nom *</label>
                  <input id="bw-last" {...bind('lastName')} required autoComplete="family-name" className="field" />
                </div>
                <div>
                  <label className="label" htmlFor="bw-email">E-mail *</label>
                  <input id="bw-email" {...bind('email')} type="email" required autoComplete="email" className="field" />
                </div>
                <div>
                  <label className="label" htmlFor="bw-phone">Téléphone</label>
                  <input id="bw-phone" {...bind('phone')} type="tel" autoComplete="tel" className="field" placeholder="+689 …" />
                </div>
                <div className="sm:col-span-2">
                  <label className="label" htmlFor="bw-country">Pays de résidence</label>
                  <input id="bw-country" {...bind('country')} autoComplete="country-name" className="field" />
                </div>
                <div className="sm:col-span-2">
                  <label className="label" htmlFor="bw-msg">Un mot pour Eliane (facultatif)</label>
                  <textarea id="bw-msg" {...bind('message')} rows={3} className="field" placeholder="Ce que vous recherchez, une question…" />
                </div>
              </div>
            )}

            {stepName === 'Confirmation' && (
              <div className="space-y-6">
                <div className="rounded-2xl bg-sand-100 p-5 text-sm">
                  <p className="font-display text-xl text-plum-800">{offering.title}</p>
                  <p className="mt-1 text-ink-soft">
                    {slot ? fmt(slot.start, { weekday: 'long', day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit' }) : occ ? fmt(occ.startsAt, { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }) : ''}
                    {qty > 1 ? ` · ${qty} participants` : ''}
                  </p>
                  {!free && (
                    <dl className="mt-4 space-y-1 border-t border-plum-800/10 pt-4">
                      <div className="flex justify-between"><dt>Total</dt><dd className="font-semibold text-plum-800">{xpf(total)}</dd></div>
                      {deposit < total && payment === 'card' && (
                        <div className="flex justify-between text-saffron-600"><dt>Acompte à régler maintenant ({offering.depositPercent} %)</dt><dd className="font-semibold">{xpf(deposit)}</dd></div>
                      )}
                    </dl>
                  )}
                </div>

                {!free && (
                  <fieldset className="min-w-0">
                    <legend className="label">Paiement</legend>
                    <div className="grid gap-2">
                      <PayOption icon={<CreditCard size={18} />} on={payment === 'card'} onSelect={() => setPayment('card')} title="Carte bancaire en ligne" text="Visa, Mastercard · paiement sécurisé 3-D Secure en XPF" />
                      {isTrip && <PayOption icon={<Landmark size={18} />} on={payment === 'transfer'} onSelect={() => setPayment('transfer')} title="Virement bancaire" text="Votre place est réservée ; Eliane vous envoie les coordonnées bancaires." />}
                      {offering.creditEligible && <PayOption icon={<Ticket size={18} />} on={payment === 'credit'} onSelect={() => setPayment('credit')} title="J’ai un carnet de séances" text="Une séance est déduite de votre carnet (même e-mail que l’achat)." />}
                    </div>
                  </fieldset>
                )}

                <div className="space-y-3 text-sm text-ink-soft">
                  {offering.cancellationPolicy && <p className="text-xs">{offering.cancellationPolicy}</p>}
                  <label className="flex items-start gap-3">
                    <input type="checkbox" name="terms" required className="mt-1 accent-plum-800" />
                    <span>J’accepte les <a href="/cgv" target="_blank" className="underline">conditions générales de vente</a> et la <a href="/confidentialite" target="_blank" className="underline">politique de confidentialité</a>. *</span>
                  </label>
                  <label className="flex items-start gap-3">
                    <input type="checkbox" name="newsletter" className="mt-1 accent-plum-800" />
                    <span>Je souhaite recevoir la newsletter (désinscription possible à tout moment).</span>
                  </label>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {error && (
          <p role="alert" className="mt-6 rounded-2xl bg-plum-100 px-4 py-3 text-sm text-plum-800">
            {error}
          </p>
        )}

        <div className="mt-8 flex items-center justify-between gap-4">
          {step > 0 ? (
            <button type="button" onClick={() => setStep((s) => s - 1)} className="inline-flex items-center gap-2 text-sm font-semibold text-ink-soft hover:text-plum-800">
              <ArrowLeft size={16} /> Retour
            </button>
          ) : (
            <span />
          )}
          <button
            type="submit"
            disabled={!canNext || submitting || (stepName === 'Date' && !isSeance && occurrences.length === 0)}
            className="inline-flex items-center gap-3 rounded-full bg-plum-800 px-7 py-3.5 text-sm font-semibold text-sand-50 transition hover:bg-plum-700 disabled:cursor-not-allowed disabled:opacity-40"
          >
            {submitting && <Loader2 size={16} className="animate-spin" />}
            {stepName === 'Confirmation'
              ? free
                ? 'Confirmer la réservation'
                : payment === 'card'
                  ? `Payer ${xpf(deposit < total ? deposit : total)}`
                  : 'Confirmer la réservation'
              : 'Continuer'}
            {!submitting && <ArrowRight size={16} />}
          </button>
        </div>
      </form>
    </div>
  )
}

function PayOption({ icon, title, text, on, onSelect }: { icon: React.ReactNode; title: string; text: string; on: boolean; onSelect: () => void }) {
  return (
    <label className={`flex cursor-pointer items-start gap-4 rounded-2xl border px-4 py-4 transition ${on ? 'border-plum-800 bg-plum-100' : 'border-plum-800/12 hover:border-plum-800/40'}`}>
      <input type="radio" name="payment" checked={on} onChange={onSelect} className="sr-only" />
      <span className={`grid h-9 w-9 shrink-0 place-items-center rounded-full ${on ? 'bg-plum-800 text-sand-50' : 'bg-sand-200 text-plum-800'}`}>{icon}</span>
      <span>
        <span className="block font-semibold text-plum-800">{title}</span>
        <span className="text-xs text-ink-soft">{text}</span>
      </span>
    </label>
  )
}
