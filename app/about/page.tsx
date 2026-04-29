import { readJSON } from '@/lib/blob'
import { AboutContent } from '@/lib/types'
import ContactForm from '@/components/about/ContactForm'
import BleedImage from '@/components/atmosphere/BleedImage'
import PaintedDivider from '@/components/atmosphere/PaintedDivider'

export const revalidate = 60

const defaultAbout: AboutContent = {
  fullBio: 'A multidisciplinary artist working across painting, photography, music, and writing.',
  profilePhotoUrl: '',
  instagram: 'https://www.instagram.com/faa.videl',
  email: 'info@faavidel.art',
  whatsapp: '+971555895441',
  linktree: 'https://linktr.ee/faavidel',
}

export default async function AboutPage() {
  const about = (await readJSON<AboutContent>('about.json')) ?? defaultAbout

  return (
    <main className="relative min-h-screen px-6 md:px-12 py-24">
      <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-16 items-start">
        <div>
          {about.profilePhotoUrl ? (
            <div className="relative aspect-[4/5] max-w-sm overflow-hidden">
              <BleedImage fill src={about.profilePhotoUrl} alt="Faezeh Ghavidel" sizes="(max-width:768px) 100vw, 400px" />
            </div>
          ) : (
            <div className="aspect-[4/5] max-w-sm bg-gradient-to-br from-brand-iris to-brand-rose" />
          )}
        </div>

        <div className="text-brand-cream">
          <p className="font-mono text-[11px] tracking-widest uppercase text-brand-amber/80">The artist</p>
          <h1 className="font-serif italic text-4xl md:text-5xl mt-2">Faezeh Ghavidel</h1>
          <PaintedDivider color="#E8B86F" width="120px" className="!my-6" />
          <div className="font-serif text-brand-cream/90 text-lg leading-relaxed whitespace-pre-line mb-8">
            {about.fullBio}
          </div>
          <div className="flex flex-wrap gap-5 mt-2 font-mono text-[11px] tracking-widest uppercase">
            {about.instagram && (
              <a href={about.instagram} target="_blank" rel="noopener noreferrer" className="text-brand-amber hover:text-brand-cream border-b border-brand-amber/40 pb-0.5 transition-colors">Instagram</a>
            )}
            {about.whatsapp && (
              <a href={`https://wa.me/${about.whatsapp.replace(/\D/g, '')}`} target="_blank" rel="noopener noreferrer" className="text-brand-amber hover:text-brand-cream border-b border-brand-amber/40 pb-0.5 transition-colors">WhatsApp</a>
            )}
            {about.linktree && (
              <a href={about.linktree} target="_blank" rel="noopener noreferrer" className="text-brand-amber hover:text-brand-cream border-b border-brand-amber/40 pb-0.5 transition-colors">Linktree</a>
            )}
            {about.email && (
              <a href={`mailto:${about.email}`} className="text-brand-amber hover:text-brand-cream border-b border-brand-amber/40 pb-0.5 transition-colors">Email</a>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto mt-24">
        <p className="font-mono text-[11px] tracking-widest uppercase text-brand-amber/80">Get in touch</p>
        <h2 className="font-serif italic text-3xl text-brand-cream mt-2">Contact</h2>
        <PaintedDivider color="#E8B86F" width="120px" className="!my-6" />
        <ContactForm />
      </div>
    </main>
  )
}
