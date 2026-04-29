'use client'
import { useEffect, useState } from 'react'

const QUOTES = [
  `The world always surrounds you with the things that bubble up from within you.
Our life's bubble is filled with our own breath.`,
  `It was as if it wasn't a wall, but a mirror,
And the image upon it
Wasn't a shadow;
It was her, there where she lived.
Just like when you weren't looking at her, she existed,
In all her colors.`,
  `Waiting for the light's gravity
To carry her away to the unseen.
To the nothingness of a world, where was all.
There, where only the birds flew,
And every word withered away in the air of their wings, except for flight.`,
  `In the shell of matter and soul,
Here, where she was,
A lifetime was passing.
And there where another, just a minute.
Centuries passed,
Eventually, both came to an end.
And in a point between,
Where there was neither space nor time,
That always existed and was unseen,
In the volumes of nothingness and formlessness,
Where there was one and the sum of all,
They descended.`,
]

const HOLD_MS = 12000
const FADE_MS = 800

export default function HeroQuoteRotator() {
  const [idx, setIdx] = useState(0)
  const [shown, setShown] = useState(true)

  useEffect(() => {
    const t = setInterval(() => {
      setShown(false)
      const next = setTimeout(() => {
        setIdx(i => (i + 1) % QUOTES.length)
        setShown(true)
      }, FADE_MS)
      return () => clearTimeout(next)
    }, HOLD_MS)
    return () => clearInterval(t)
  }, [])

  return (
    <p
      className={`font-serif italic text-brand-cream whitespace-pre-line transition-opacity duration-700 ${shown ? 'opacity-100' : 'opacity-0'}`}
      style={{ fontSize: 'clamp(1.05rem, 1.9vw, 1.55rem)', lineHeight: 1.5 }}
    >
      {QUOTES[idx]}
    </p>
  )
}
