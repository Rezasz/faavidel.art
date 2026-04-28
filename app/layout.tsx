import type { Metadata } from 'next'
import { Cormorant_Garamond, IBM_Plex_Mono } from 'next/font/google'
import './globals.css'
import { CartProvider } from '@/context/CartContext'
import Nav from '@/components/layout/Nav'
import Footer from '@/components/layout/Footer'
import CustomCursor from '@/components/ui/CustomCursor'
import Loader from '@/components/ui/Loader'
import PageTransition from '@/components/layout/PageTransition'

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
      <body>
        <CartProvider>
          <Loader />
          <CustomCursor />
          <Nav />
          <PageTransition>
            {children}
          </PageTransition>
          <Footer />
        </CartProvider>
      </body>
    </html>
  )
}
