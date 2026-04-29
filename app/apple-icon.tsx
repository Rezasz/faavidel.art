import { ImageResponse } from 'next/og'

export const size = { width: 180, height: 180 }
export const contentType = 'image/png'

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          background: '#0E0A1C',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
        }}
      >
        <div
          style={{
            position: 'absolute',
            width: 78,
            height: 78,
            borderRadius: '50%',
            background:
              'radial-gradient(circle, #FFE5A8 0%, #E8B86F 35%, rgba(232,184,111,0.35) 80%, transparent 100%)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            width: 124,
            height: 124,
            borderRadius: '50%',
            border: '2px solid rgba(251,231,208,0.55)',
          }}
        />
      </div>
    ),
    size,
  )
}
