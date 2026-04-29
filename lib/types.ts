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
  youtubeUrl?: string
  artworkUrl: string
  duration: string
  order: number
  createdAt: string
}

export type TrackSourceType = 'file' | 'youtube'

export interface MusicIndex {
  tracks: Track[]
}

export interface MusicSettings {
  soundcloudUrl: string
}

export interface Exhibition {
  order: number
  title: string
  dateLabel: string
  year: number
  venue: string
  city: string
  country: string
  organizer: string
  role: string
  description: string
  sourcePage: number
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

export interface Marketplace {
  title: string
  url: string
  domain: string
  description: string
  order: number
}

export interface MarketplacesIndex {
  marketplaces: Marketplace[]
}
