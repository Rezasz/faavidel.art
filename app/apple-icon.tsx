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
          fontFamily: 'Georgia, serif',
          fontStyle: 'italic',
          fontSize: 130,
          fontWeight: 500,
          color: '#E8B86F',
          lineHeight: 1,
        }}
      >
        f
      </div>
    ),
    size,
  )
}
