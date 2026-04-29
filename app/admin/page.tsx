'use client'
import { signIn } from 'next-auth/react'
import { useState } from 'react'
import BrushButton from '@/components/atmosphere/BrushButton'

export default function AdminLoginPage() {
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

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
      window.location.href = '/admin/dashboard'
    }
  }

  return (
    <div className="bg-brand-parchment p-10 w-full max-w-sm shadow-2xl">
      <h1 className="font-serif italic text-2xl text-brand-night">faavidel</h1>
      <p className="font-mono text-[10px] tracking-widest uppercase text-brand-night/55 mt-0.5 mb-8">Admin Panel</p>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          name="username"
          placeholder="Username"
          required
          autoComplete="username"
          className="bg-transparent border-b border-brand-night/30 font-serif text-brand-night focus:outline-none focus:border-brand-iris transition-colors py-3"
        />
        <input
          name="password"
          type="password"
          placeholder="Password"
          required
          autoComplete="current-password"
          className="bg-transparent border-b border-brand-night/30 font-serif text-brand-night focus:outline-none focus:border-brand-iris transition-colors py-3"
        />
        {error && <p className="font-mono text-[10px] tracking-widest uppercase text-brand-rose">{error}</p>}
        <BrushButton type="submit" disabled={loading}>
          {loading ? 'Signing in…' : 'Sign In'}
        </BrushButton>
      </form>
    </div>
  )
}
