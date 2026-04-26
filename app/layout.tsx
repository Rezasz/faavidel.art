import type { Metadata } from 'next'
import './globals.css'
import { CartProvider } from '@/context/CartContext'
import Nav from '@/components/layout/Nav'
import Footer from '@/components/layout/Footer'
import CustomCursor from '@/components/ui/CustomCursor'
import Loader from '@/components/ui/Loader'
import PageTransition from '@/components/layout/PageTransition'

export const metadata: Metadata = {
  title: 'faavidel — Art, Photography, Music & Writing',
  description: 'A multidisciplinary creative portfolio',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
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
