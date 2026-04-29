'use client'
import { useState } from 'react'
import BrushButton from '@/components/atmosphere/BrushButton'

const WHATSAPP_NUMBER = '971555895441'

export default function ContactForm() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const text = `Hello, I'm ${name} (${email}).\n\n${message}`
    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`
    window.open(url, '_blank', 'noopener,noreferrer')
  }

  const inputClass =
    "block w-full bg-transparent border-b border-brand-cream/40 py-3 font-serif text-brand-cream placeholder:text-brand-cream/40 focus:outline-none focus:border-brand-amber transition-colors"

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      <label className="block">
        <span className="block font-mono text-[10px] tracking-widest uppercase text-brand-cream/65 mb-2">Name</span>
        <input value={name} onChange={e => setName(e.target.value)} required className={inputClass} placeholder="Your name" />
      </label>
      <label className="block">
        <span className="block font-mono text-[10px] tracking-widest uppercase text-brand-cream/65 mb-2">Email</span>
        <input type="email" value={email} onChange={e => setEmail(e.target.value)} required className={inputClass} placeholder="you@example.com" />
      </label>
      <label className="block">
        <span className="block font-mono text-[10px] tracking-widest uppercase text-brand-cream/65 mb-2">Message</span>
        <textarea value={message} onChange={e => setMessage(e.target.value)} rows={5} required className={inputClass + " resize-none"} placeholder="Hello…" />
      </label>
      <div className="mt-2">
        <BrushButton type="submit">Send via WhatsApp</BrushButton>
      </div>
      <p className="font-mono text-[10px] tracking-widest uppercase text-brand-cream/45">
        Opens WhatsApp with your message pre-filled
      </p>
    </form>
  )
}
