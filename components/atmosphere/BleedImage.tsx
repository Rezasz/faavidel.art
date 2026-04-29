'use client'
import Image from 'next/image'

interface BleedImageProps {
  src: string
  alt: string
  width?: number
  height?: number
  fill?: boolean
  className?: string
  priority?: boolean
  sizes?: string
}

export default function BleedImage({
  src, alt, width, height, fill, className = '', priority, sizes,
}: BleedImageProps) {
  if (fill) {
    return (
      <Image
        src={src}
        alt={alt}
        fill
        priority={priority}
        sizes={sizes ?? '100vw'}
        className={`object-cover ${className}`}
      />
    )
  }
  return (
    <Image
      src={src}
      alt={alt}
      width={width!}
      height={height!}
      priority={priority}
      className={`w-full h-auto ${className}`}
    />
  )
}
