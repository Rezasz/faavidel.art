'use client'
import { signIn } from 'next-auth/react'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function AdminLoginPage() {
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    const fd = new FormData(e.currentTarget)
    const result = await signIn('credentials', {
      username: fd.get('username'),
      password: fd.get('password'),
      redirect: false,
    })
    if (result?.error) {
      setError('Invalid credentials')
      setLoading(false)
    } else {
      router.push('/admin/dashboard')
    }
  }

  return (
    <div className="min-h-screen bg-ocean flex items-center justify-center px-4" style={{ marginTop: '-64px' }}>
      <div className="bg-white rounded-xl p-10 w-full max-w-sm shadow-2xl">
        <h1 className="font-serif text-2xl text-ocean mb-1">faavidel</h1>
        <p className="font-sans text-xs tracking-wider uppercase text-seafoam mb-8">Admin Panel</p>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            name="username"
            placeholder="Username"
            required
            autoComplete="username"
            className="border border-gray-200 rounded px-4 py-3 font-sans text-sm focus:outline-none focus:border-seafoam transition-colors"
          />
          <input
            name="password"
            type="password"
            placeholder="Password"
            required
            autoComplete="current-password"
            className="border border-gray-200 rounded px-4 py-3 font-sans text-sm focus:outline-none focus:border-seafoam transition-colors"
          />
          {error && <p className="font-sans text-xs text-burnt">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="bg-ocean text-white font-sans text-xs tracking-wider uppercase py-3 rounded hover:bg-ocean/85 transition-colors disabled:opacity-60"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  )
}
