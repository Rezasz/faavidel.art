'use client'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Minus, Plus, ShoppingBag } from 'lucide-react'
import { useCart } from '@/context/CartContext'
import Image from 'next/image'
import { useState } from 'react'
import PaintedDivider from '@/components/atmosphere/PaintedDivider'
import BrushButton from '@/components/atmosphere/BrushButton'

interface Props { open: boolean; onClose: () => void }

export default function CartDrawer({ open, onClose }: Props) {
  const { items, removeItem, updateQuantity, total } = useCart()
  const [loading, setLoading] = useState(false)

  const checkout = async () => {
    setLoading(true)
    const res = await fetch('/api/checkout', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ items }),
    })
    const { url } = await res.json()
    if (url) window.location.href = url
    setLoading(false)
  }

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-brand-night/60 z-[9990]"
            onClick={onClose}
          />
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-brand-parchment z-[9991] flex flex-col shadow-2xl"
          >
            <div className="flex items-center justify-between p-6">
              <div className="flex items-center gap-2">
                <ShoppingBag size={18} className="text-brand-night" />
                <h2 className="font-serif italic text-2xl text-brand-night">Cart</h2>
              </div>
              <button onClick={onClose} className="text-brand-night/50 hover:text-brand-night"><X size={20} /></button>
            </div>
            <PaintedDivider color="#6B5BA8" width="80%" className="!my-0" />

            <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-5">
              {items.length === 0 ? (
                <p className="font-serif italic text-brand-night/50 text-center mt-12">Your cart is empty</p>
              ) : (
                items.map(item => (
                  <div key={item.productSlug} className="flex gap-4 items-start">
                    <div className="relative w-16 h-16 shrink-0 overflow-hidden">
                      {item.imageUrl && <Image src={item.imageUrl} alt={item.title} fill className="object-cover" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-serif italic text-brand-night truncate">{item.title}</p>
                      <p className="font-mono text-[11px] tracking-widest uppercase text-brand-night/70 mt-0.5">${item.price.toFixed(2)}</p>
                      <div className="flex items-center gap-3 mt-2">
                        <button onClick={() => updateQuantity(item.productSlug, item.quantity - 1)} className="text-brand-night/60 hover:text-brand-night"><Minus size={12} /></button>
                        <span className="font-mono text-sm text-brand-night">{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.productSlug, item.quantity + 1)} className="text-brand-night/60 hover:text-brand-night"><Plus size={12} /></button>
                      </div>
                    </div>
                    <button onClick={() => removeItem(item.productSlug)} className="text-brand-night/30 hover:text-brand-rose mt-1"><X size={14} /></button>
                  </div>
                ))
              )}
            </div>

            {items.length > 0 && (
              <div className="p-6">
                <PaintedDivider color="#6B5BA8" width="100%" className="!my-2" />
                <div className="flex justify-between font-serif italic text-2xl mb-5 text-brand-night">
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>
                <BrushButton onClick={checkout} disabled={loading} className="w-full">
                  {loading ? 'Redirecting…' : 'Checkout →'}
                </BrushButton>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
