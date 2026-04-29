import PaintedDivider from '@/components/atmosphere/PaintedDivider'

export const metadata = { title: 'Cookies · faavidel' }

export default function CookiesPage() {
  return (
    <main className="relative min-h-screen px-6 md:px-12 py-24 max-w-2xl mx-auto">
      <article className="reading-panel p-8 md:p-12 text-brand-cream">
        <p className="font-mono text-[11px] tracking-widest uppercase text-brand-amber/80">Legal</p>
        <h1 className="font-serif italic text-3xl md:text-4xl mt-2">Cookie Policy</h1>
        <PaintedDivider color="#E8B86F" width="100px" className="!my-6" />

        <div className="font-serif text-brand-cream/85 text-base md:text-lg leading-relaxed space-y-5">
          <p>
            faavidel.art uses a small number of cookies and similar local-storage values to remember preferences across visits — for example, whether you have enabled the ambient background music. These values stay in your browser on your device and are not shared with third parties.
          </p>
          <p>
            We do not use advertising or marketing cookies. We do not track you across other sites.
          </p>
          <h2 className="font-serif italic text-xl mt-6 mb-2 text-brand-cream">What we store</h2>
          <ul className="list-disc pl-5 space-y-2">
            <li><span className="font-mono text-[12px] uppercase tracking-widest text-brand-amber">faavidel.music</span> — “on” or “off” to remember whether you’ve enabled ambient music.</li>
            <li>Anonymous, aggregate usage statistics may be collected by our hosting provider (Vercel) to keep the site fast and stable. These do not identify you.</li>
          </ul>
          <h2 className="font-serif italic text-xl mt-6 mb-2 text-brand-cream">Your control</h2>
          <p>
            You can clear local-storage values at any time from your browser settings. Doing so will reset your music preference to the default (off).
          </p>
          <p className="font-mono text-[11px] tracking-widest uppercase text-brand-cream/55">
            Last updated: April 2026
          </p>
        </div>
      </article>
    </main>
  )
}
