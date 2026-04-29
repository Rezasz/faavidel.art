import AdminNav from '@/components/admin/AdminNav'
import { auth } from '@/lib/auth'

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth()

  // Login page (and any unauthenticated request) renders standalone, no shell.
  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-brand-night">
        {children}
      </div>
    )
  }

  return (
    <div className="min-h-screen flex bg-brand-parchment text-brand-night">
      <AdminNav />
      <main className="flex-1 ml-56 p-8 overflow-y-auto relative">
        {/* low-opacity painting ghost */}
        <div
          aria-hidden
          className="absolute inset-0 pointer-events-none mix-blend-multiply opacity-[0.07] bg-cover bg-center"
          style={{ backgroundImage: "url('https://d1l8km4g5s76x5.cloudfront.net/Production/art_zone_image/2049/47601/main_artwork_2049_47601_46724_1770985530.jpg')" }}
        />
        <div
          aria-hidden
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `
              radial-gradient(ellipse 60% 55% at 22% 38%, rgba(107,91,168,0.16), transparent 70%),
              radial-gradient(ellipse 55% 50% at 75% 32%, rgba(216,110,120,0.13), transparent 70%),
              radial-gradient(ellipse 70% 50% at 50% 78%, rgba(232,184,111,0.16), transparent 70%)
            `,
          }}
        />
        <div className="relative">{children}</div>
      </main>
    </div>
  )
}
