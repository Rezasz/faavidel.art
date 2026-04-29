import PaintedDivider from '@/components/atmosphere/PaintedDivider'

export const metadata = { title: 'Disclaimer · faavidel' }

export default function DisclaimerPage() {
  return (
    <main className="relative min-h-screen px-6 md:px-12 py-24 max-w-2xl mx-auto">
      <article className="reading-panel p-8 md:p-12 text-brand-cream">
        <p className="font-mono text-[11px] tracking-widest uppercase text-brand-amber/80">Legal</p>
        <h1 className="font-serif italic text-3xl md:text-4xl mt-2">Disclaimer</h1>
        <PaintedDivider color="#E8B86F" width="100px" className="!my-6" />

        <div className="font-serif text-brand-cream/85 text-base md:text-lg leading-relaxed space-y-5">
          <p>
            All artworks, photographs, writing, audio, and video presented on faavidel.art are the original work of Faezeh Ghavidel (“Faavidel”) unless otherwise noted, and are protected by copyright. Reproduction, redistribution, or commercial use without prior written permission is not permitted.
          </p>
          <p>
            Information on this site is provided for general informational and artistic purposes only. While the artist makes a reasonable effort to keep the site current, no warranty is made — express or implied — about the accuracy, completeness, or availability of any information, image, or external link.
          </p>
          <p>
            External marketplaces, social platforms, and third-party services linked from this site are operated by their respective owners. Faavidel is not responsible for the policies, content, or practices of those external sites.
          </p>
          <p>
            By using this site you accept that the artist is not liable for any loss, damage, or inconvenience arising from its use.
          </p>
          <p className="font-mono text-[11px] tracking-widest uppercase text-brand-cream/55">
            Last updated: April 2026
          </p>
        </div>
      </article>
    </main>
  )
}
