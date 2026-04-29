import type { Metadata } from 'next'
import { Cormorant_Garamond, IBM_Plex_Mono } from 'next/font/google'
import Script from 'next/script'
import './globals.css'
import Nav from '@/components/layout/Nav'
import Footer from '@/components/layout/Footer'
import CustomCursor from '@/components/ui/CustomCursor'
import Loader from '@/components/ui/Loader'
import PageTransition from '@/components/layout/PageTransition'
import AtmosphericLayer from '@/components/atmosphere/AtmosphericLayer'
import { MusicProvider } from '@/context/MusicContext'
import BackgroundMusic from '@/components/ui/BackgroundMusic'

const GA_ID = 'G-VZF34SJW3H'

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  style: ['normal', 'italic'],
  variable: '--font-cormorant',
  display: 'swap',
})

const plexMono = IBM_Plex_Mono({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-plex-mono',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'faavidel — paintings, photography, writing, music',
  description: 'Multidisciplinary work by Faezeh Ghavidel — paintings, photography, writing, video and music.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${cormorant.variable} ${plexMono.variable}`}>
      <head>
        <Script
          id="ga-loader"
          strategy="afterInteractive"
          src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
        />
        <Script id="ga-init" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_ID}');
          `}
        </Script>
      </head>
      <body>
        <MusicProvider>
          <Loader />
          <CustomCursor />
          <AtmosphericLayer />
          <Nav />
          <PageTransition>
            {children}
          </PageTransition>
          <Footer />
          <BackgroundMusic />
        </MusicProvider>
      </body>
    </html>
  )
}
