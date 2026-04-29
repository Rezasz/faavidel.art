'use client'

interface Props {
  value: string
  onChange: (val: string) => void
  placeholder?: string
}

export default function RichTextEditor({ value, onChange, placeholder }: Props) {
  return (
    <textarea
      value={value}
      onChange={e => onChange(e.target.value)}
      placeholder={placeholder ?? 'Write in Markdown...'}
      rows={16}
      className="w-full border border-brand-night/20 px-4 py-3 font-mono text-sm focus:outline-none focus:border-brand-iris transition-colors resize-y bg-brand-parchment"
    />
  )
}
