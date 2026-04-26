import AdminNav from '@/components/admin/AdminNav'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-off-white flex" style={{ marginTop: '-64px', minHeight: '100vh' }}>
      <AdminNav />
      <main className="flex-1 p-8 overflow-y-auto ml-56 mt-0">{children}</main>
    </div>
  )
}
