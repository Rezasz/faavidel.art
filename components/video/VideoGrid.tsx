import { VideoIndex } from '@/lib/types'
import AnimatedSection from '@/components/ui/AnimatedSection'

export default function VideoGrid({ videos }: { videos: VideoIndex['videos'] }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      {videos.map((video, i) => (
        <AnimatedSection key={video.id} delay={i * 0.1}>
          <div className="aspect-video rounded overflow-hidden bg-charcoal relative">
            <iframe
              src={video.embedUrl}
              title={video.title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="absolute inset-0 w-full h-full border-0"
            />
          </div>
          <h3 className="font-serif text-lg text-charcoal mt-3">{video.title}</h3>
          {video.description && (
            <p className="font-sans text-sm text-charcoal/60 mt-1">{video.description}</p>
          )}
        </AnimatedSection>
      ))}
    </div>
  )
}
