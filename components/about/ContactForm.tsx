'use client'
import { useState } from 'react'

export default function ContactForm() {
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle')

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setStatus('sending')
    const fd = new FormData(e.currentTarget)
    try {
      await fetch('/api/contact', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          name: fd.get('name'),
          email: fd.get('email'),
          message: fd.get('message'),
        }),
      })
      setStatus('sent')
      ;(e.target as HTMLFormElement).reset()
    } catch {
      setStatus('error')
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <input name="name" placeholder="Your name" required
        className="border border-gray-200 rounded px-4 py-3 font-sans text-sm focus:outline-none focus:border-seafoam transition-colors bg-off-white" />
      <input name="email" type="email" placeholder="Your email" required
        className="border border-gray-200 rounded px-4 py-3 font-sans text-sm focus:outline-none focus:border-seafoam transition-colors bg-off-white" />
      <textarea name="message" placeholder="Your message" rows={5} required
        className="border border-gray-200 rounded px-4 py-3 font-sans text-sm focus:outline-none focus:border-seafoam transition-colors bg-off-white resize-none" />
      <button type="submit" disabled={status === 'sending'}
        className="bg-burnt text-white font-sans text-xs tracking-wider uppercase py-3 rounded hover:bg-burnt/85 transition-colors disabled:opacity-60">
        {status === 'sending' ? 'Sending...' : status === 'sent' ? 'Message Sent ✓' : 'Send Message'}
      </button>
      {status === 'error' && <p className="font-sans text-xs text-burnt">Something went wrong. Please try again.</p>}
    </form>
  )
}
