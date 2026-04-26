import { readJSON } from '@/lib/blob'
import { AboutContent } from '@/lib/types'
import AnimatedSection from '@/components/ui/AnimatedSection'
import ContactForm from '@/components/about/ContactForm'
import Image from 'next/image'

export const revalidate = 60

const defaultAbout: AboutContent = {
  fullBio: 'A multidisciplinary artist working across painting, photography, music, and writing.',
  profilePhotoUrl: '',
  instagram: '',
  email: 'hello@faavidel.art',
}

export default async function AboutPage() {
  const about = (await readJSON<AboutContent>('about.json')) ?? defaultAbout

  return (
    <main className="min-h-screen py-20 px-8">
      <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-16 items-start">
        <AnimatedSection>
          {about.profilePhotoUrl ? (
            <div className="relative aspect-square rounded-2xl overflow-hidden bg-off-white max-w-sm">
              <Image src={about.profilePhotoUrl} alt="Faavidel" fill className="object-cover" />
            </div>
          ) : (
            <div className="aspect-square rounded-2xl bg-gradient-to-br from-ocean to-seafoam max-w-sm" />
          )}
        </AnimatedSection>

        <AnimatedSection delay={0.15} direction="left">
          <p className="section-label">The Artist</p>
          <h1 className="section-title">Faavidel</h1>
          <div className="section-rule" />
          <div className="font-serif text-charcoal/80 leading-relaxed whitespace-pre-line mb-8 text-lg">
            {about.fullBio}
          </div>
          <div className="flex gap-5">
            {about.instagram && (
              <a href={`https://instagram.com/${about.instagram.replace('@', '')}`} target="_blank" rel="noopener noreferrer"
                className="font-sans text-xs tracking-wider uppercase text-seafoam hover:text-ocean border-b border-seafoam/40 pb-0.5 transition-colors">
                Instagram
              </a>
            )}
            {about.email && (
              <a href={`mailto:${about.email}`}
                className="font-sans text-xs tracking-wider uppercase text-seafoam hover:text-ocean border-b border-seafoam/40 pb-0.5 transition-colors">
                Email
              </a>
            )}
          </div>
        </AnimatedSection>
      </div>

      <div className="max-w-2xl mx-auto mt-24">
        <AnimatedSection>
          <p className="section-label">Get in Touch</p>
          <h2 className="section-title">Contact</h2>
          <div className="section-rule" />
        </AnimatedSection>
        <AnimatedSection delay={0.1}>
          <ContactForm />
        </AnimatedSection>
      </div>
    </main>
  )
}
