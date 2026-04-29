'use client'
import { motion } from 'framer-motion'
import { VideoIndex } from '@/lib/types'
import PaintedFrame from '@/components/atmosphere/PaintedFrame'

export default function VideoGrid({ videos }: { videos: VideoIndex['videos'] }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
      {videos.map((video, i) => (
        <motion.div
          key={video.id}
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.5, delay: i * 0.08 }}
        >
          <PaintedFrame className="aspect-video bg-brand-night/30 overflow-hidden">
            <iframe
              src={video.embedUrl}
              title={video.title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="absolute inset-0 w-full h-full border-0"
            />
          </PaintedFrame>
          <h3 className="font-serif italic text-xl text-brand-cream mt-4">{video.title}</h3>
          {video.description && (
            <p className="font-mono text-[11px] tracking-widest uppercase text-brand-cream/60 mt-1">{video.description}</p>
          )}
        </motion.div>
      ))}
    </div>
  )
}
