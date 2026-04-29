import Link from 'next/link'
import PaintedDivider from '@/components/atmosphere/PaintedDivider'

interface Marketplace {
  title: string
  url: string
  domain: string
  description: string
}

const marketplaces: Marketplace[] = [
  {
    title: 'Wallet Bubbles',
    url: 'https://walletbubbles.com/faavidel/55df5f8e-14e8-4bcc-a451-057a1da816ff',
    domain: 'walletbubbles.com',
    description: 'A curated portfolio space — a visual gallery of Faavidel’s digital works across the wallets she has minted to.',
  },
  {
    title: 'hug.art',
    url: 'https://hug.art/artists/Faavidel',
    domain: 'hug.art',
    description: 'Web3 art platform spotlighting emerging artists. Discover and collect Faavidel’s editions on Ethereum.',
  },
  {
    title: 'Drip.haus',
    url: 'https://drip.haus/FAAVIDEL',
    domain: 'drip.haus',
    description: 'Solana-based platform for free NFT drops — pieces sent directly to collectors’ wallets, no fees.',
  },
  {
    title: 'Manifold',
    url: 'https://studio.manifold.xyz/auth/login',
    domain: 'studio.manifold.xyz',
    description: 'Independent creator-owned smart contracts. Used for self-published collections — sign in to view current releases.',
  },
  {
    title: 'Objkt',
    url: 'https://objkt.com/users/tz1XWjwZAJti79N6ATrHwNozh9FAUSadn6cf',
    domain: 'objkt.com',
    description: 'Tezos NFT marketplace — Faavidel’s 1/1 paintings and editions, available to bid, buy, or trade.',
  },
]

export const metadata = { title: 'Shop · faavidel' }

export default function ShopPage() {
  return (
    <main className="relative min-h-screen px-6 md:px-12 py-24 max-w-4xl mx-auto">
      <div className="reading-panel p-6 md:p-10 mb-10 inline-block">
        <p className="font-mono text-[11px] tracking-widest uppercase text-brand-amber/80">Collect</p>
        <h1 className="font-serif italic text-brand-cream text-4xl md:text-5xl mt-2">Marketplaces</h1>
        <div className="w-12 h-px bg-brand-amber/60 mt-3" />
      </div>

      <p className="reading-panel p-6 md:p-8 mb-10 font-serif text-brand-cream/85 text-lg leading-relaxed">
        Faavidel’s digital works live across several Web3 platforms. Each space offers a different way to view, mint, or collect — visit any of them below.
      </p>

      <div className="flex flex-col gap-6">
        {marketplaces.map((m) => (
          <Link
            key={m.title}
            href={m.url}
            target="_blank"
            rel="noopener noreferrer"
            className="reading-panel group block p-6 md:p-8 transition-colors hover:bg-brand-night/75"
          >
            <div className="flex items-baseline justify-between gap-4">
              <h2 className="font-serif italic text-brand-cream text-2xl md:text-3xl">{m.title}</h2>
              <span className="font-mono text-[10px] tracking-widest uppercase text-brand-cream/55 group-hover:text-brand-amber transition-colors shrink-0">
                {m.domain} ↗
              </span>
            </div>
            <PaintedDivider color="#E8B86F" width="80px" className="!my-4" />
            <p className="font-serif text-brand-cream/80 leading-relaxed">{m.description}</p>
          </Link>
        ))}
      </div>
    </main>
  )
}
