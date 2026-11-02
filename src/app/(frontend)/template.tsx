/**
 * Page change: a plum curtain lifts off the new page (pure CSS, so it never waits for JavaScript).
 * Hidden on the first visit, when the intro already covers the page.
 */
export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <>
      <div aria-hidden className="page-curtain pointer-events-none fixed inset-0 z-[120] bg-plum-950" />
      {children}
    </>
  )
}
