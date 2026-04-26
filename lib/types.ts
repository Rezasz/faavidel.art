// lib/types.ts

export interface Artwork {
  slug: string
  title: string
  description: string
  tags: string[]
  imageUrl: string
  year: number
  order: number
  createdAt: string
}

export interface GalleryIndex {
  artworks: Pick<Artwork, 'slug' | 'title' | 'imageUrl' | 'tags' | 'order'>[]
}

export interface PhotoSeries {
  slug: string
  title: string
  description: string
  coverUrl: string
  order: number
  createdAt: string
}

export interface Photo {
  id: string
  url: string
  caption: string
  order: number
}

export interface PhotoSeriesDetail extends PhotoSeries {
  photos: Photo[]
}

export interface PhotographyIndex {
  series: Pick<PhotoSeries, 'slug' | 'title' | 'coverUrl' | 'order'>[]
}

export interface Post {
  slug: string
  title: string
  excerpt: string
  content: string
  date: string
  status: 'published' | 'draft'
  tags: string[]
  createdAt: string
}

export interface PostIndex {
  posts: Pick<Post, 'slug' | 'title' | 'excerpt' | 'date' | 'status' | 'tags'>[]
}

export interface VideoItem {
  id: string
  title: string
  description: string
  embedUrl: string
  thumbnailUrl: string
  order: number
  createdAt: string
}

export interface VideoIndex {
  videos: VideoItem[]
}

export interface Track {
  id: string
  title: string
  fileUrl: string
  artworkUrl: string
  duration: string
  order: number
  createdAt: string
}

export interface MusicIndex {
  tracks: Track[]
}

export interface Product {
  slug: string
  title: string
  description: string
  price: number
  images: string[]
  stock: number
  status: 'active' | 'archived'
  createdAt: string
}

export interface ProductIndex {
  products: Pick<Product, 'slug' | 'title' | 'price' | 'images' | 'stock' | 'status'>[]
}

export interface OrderItem {
  productSlug: string
  productTitle: string
  price: number
  quantity: number
  imageUrl: string
}

export interface Order {
  id: string
  items: OrderItem[]
  customerEmail: string
  customerName: string
  shippingAddress: {
    line1: string
    line2?: string
    city: string
    state: string
    postalCode: string
    country: string
  }
  total: number
  status: 'pending' | 'paid' | 'shipped' | 'delivered'
  stripeSessionId: string
  createdAt: string
}

export interface OrderIndex {
  orders: Pick<Order, 'id' | 'customerEmail' | 'total' | 'status' | 'createdAt'>[]
}

export interface HomepageContent {
  heroTitle: string
  heroSubtitle: string
  heroButtonText: string
  featuredArtworkSlugs: string[]
  bioSnippet: string
}

export interface AboutContent {
  fullBio: string
  profilePhotoUrl: string
  instagram: string
  email: string
  whatsapp?: string
  linktree?: string
  twitter?: string
}

export interface SiteSettings {
  siteTitle: string
  siteDescription: string
  contactEmail: string
  metaImage: string
}

export interface CartItem {
  productSlug: string
  title: string
  price: number
  quantity: number
  imageUrl: string
}
