'use client'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Minus, Plus, ShoppingBag } from 'lucide-react'
import { useCart } from '@/context/CartContext'
import Image from 'next/image'
import { useState } from 'react'

interface Props {
  open: boolean
  onClose: () => void
}

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
            className="fixed inset-0 bg-black/40 z-[9990]"
            onClick={onClose}
          />
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-white z-[9991] flex flex-col shadow-2xl"
          >
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <ShoppingBag size={20} className="text-ocean" />
                <h2 className="font-serif text-xl text-ocean">Cart</h2>
              </div>
              <button onClick={onClose} className="text-charcoal/50 hover:text-charcoal"><X size={20} /></button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-5">
              {items.length === 0 ? (
                <p className="font-serif text-charcoal/50 text-center mt-12">Your cart is empty</p>
              ) : (
                items.map(item => (
                  <div key={item.productSlug} className="flex gap-4 items-start">
                    <div className="w-16 h-16 rounded bg-off-white relative shrink-0 overflow-hidden">
                      {item.imageUrl && <Image src={item.imageUrl} alt={item.title} fill className="object-cover" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-serif text-sm text-charcoal truncate">{item.title}</p>
                      <p className="font-sans text-xs text-burnt mt-0.5">${item.price.toFixed(2)}</p>
                      <div className="flex items-center gap-3 mt-2">
                        <button onClick={() => updateQuantity(item.productSlug, item.quantity - 1)}><Minus size={12} /></button>
                        <span className="font-sans text-sm">{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.productSlug, item.quantity + 1)}><Plus size={12} /></button>
                      </div>
                    </div>
                    <button onClick={() => removeItem(item.productSlug)} className="text-charcoal/30 hover:text-burnt mt-1"><X size={14} /></button>
                  </div>
                ))
              )}
            </div>

            {items.length > 0 && (
              <div className="p-6 border-t border-gray-100">
                <div className="flex justify-between font-serif text-lg mb-5">
                  <span>Total</span>
                  <span className="text-burnt">${total.toFixed(2)}</span>
                </div>
                <button
                  onClick={checkout}
                  disabled={loading}
                  className="w-full bg-burnt text-white font-sans text-xs tracking-wider uppercase py-3.5 rounded hover:bg-burnt/85 transition-colors disabled:opacity-60"
                >
                  {loading ? 'Redirecting...' : 'Checkout →'}
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
