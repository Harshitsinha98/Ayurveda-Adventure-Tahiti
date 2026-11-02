'use client'

import { useEffect } from 'react'

/**
 * Admin provider that disables automatic browser translation (Google Translate,
 * Chrome's built-in translator, etc.) for the whole back office.
 *
 * Why this exists: automatic translators rewrite the page's text nodes in place.
 * Payload's admin is a large React 19 client app, and when React later re-renders
 * a list or table whose DOM a translator has mutated, it can throw a
 * `NotFoundError: Failed to execute 'removeChild'/'insertBefore' on 'Node'`,
 * which bubbles up to Next.js' error boundary and shows "This page couldn't load".
 *
 * Setting `translate="no"` on <html> (plus the `notranslate` class) tells the
 * browser to leave the admin alone. The admin already has its own FR/EN switch,
 * so no functionality is lost.
 */
export function NoTranslate({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const el = document.documentElement
    el.setAttribute('translate', 'no')
    el.classList.add('notranslate')
    // Chrome also respects this meta hint.
    if (!document.querySelector('meta[name="google"][content="notranslate"]')) {
      const meta = document.createElement('meta')
      meta.name = 'google'
      meta.content = 'notranslate'
      document.head.appendChild(meta)
    }
  }, [])

  return <>{children}</>
}
