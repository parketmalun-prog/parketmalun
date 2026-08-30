/**
 * One fixed, full-viewport paper-grain overlay. Makes cream read as paper and
 * espresso as stained timber. Mounted once in Layout; never add more texture.
 *
 * Hidden below `md` on purpose. A fixed, full-screen `mix-blend-mode` layer
 * forces the browser to re-composite the whole viewport on every scroll frame,
 * which is one of the more expensive things you can do to an old phone. At
 * phone size the grain is invisible anyway, so the cost buys nothing.
 */
export function GrainOverlay() {
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-[70] hidden opacity-[0.35] mix-blend-overlay md:block"
      style={{
        backgroundImage:
          "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='140' height='140'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.11'/%3E%3C/svg%3E\")",
      }}
    />
  )
}
