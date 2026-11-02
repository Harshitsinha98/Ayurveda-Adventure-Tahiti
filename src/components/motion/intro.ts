/** Shared by the server layout (inline script) and client components. */
export const INTRO_KEY = 'at-intro'
/** Seconds the first-visit intro covers the page; hero animations wait for it. */
export const INTRO_SECONDS = 2.1

export function introDelay() {
  if (typeof document === 'undefined') return 0
  return document.documentElement.classList.contains('intro-seen') ? 0 : INTRO_SECONDS
}

/** Inline script run before paint: skip the intro for the rest of the session once seen. */
export const introScript = `try{if(sessionStorage.getItem('${INTRO_KEY}')||matchMedia('(prefers-reduced-motion: reduce)').matches)document.documentElement.classList.add('intro-seen')}catch(e){}`
