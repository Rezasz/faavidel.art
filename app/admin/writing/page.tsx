'use client'
import { useEffect, useState } from 'react'
import { PostIndex, Post } from '@/lib/types'
import RichTextEditor from '@/components/admin/RichTextEditor'
import BrushButton from '@/components/atmosphere/BrushButton'
import { Trash2 } from 'lucide-react'

type PostForm = Partial<Post> & { tagsInput: string }

const emptyPost = (): PostForm => ({
  title: '', excerpt: '', content: '', tags: [], status: 'draft',
  date: new Date().toISOString().split('T')[0],
  tagsInput: '',
})

export default function AdminWritingPage() {
  const [posts, setPosts] = useState<PostIndex['posts']>([])
  const [form, setForm] = useState<PostForm>(emptyPost())
  const [editing, setEditing] = useState(false)
  const [saving, setSaving] = useState(false)

  const load = () =>
    fetch('/api/content/writing/index').then(r => r.ok ? r.json() : null).then(d => setPosts(d?.posts ?? []))

  useEffect(() => { load() }, [])

  const save = async () => {
    setSaving(true)
    try {
      const slug = (form.slug ?? form.title!.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')) || 'untitled'
      const post: Post = {
        slug,
        title: form.title!,
        excerpt: form.excerpt ?? '',
        content: form.content ?? '',
        date: form.date ?? new Date().toISOString().split('T')[0],
        status: (form.status as 'published' | 'draft') ?? 'draft',
        tags: form.tagsInput.split(',').map(t => t.trim()).filter(Boolean),
        createdAt: form.createdAt ?? new Date().toISOString(),
      }
      await fetch(`/api/content/writing/${slug}`, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(post),
      })
      const existing = posts.find(p => p.slug === slug)
      const updated: PostIndex = {
        posts: existing
          ? posts.map(p => p.slug === slug ? { slug, title: post.title, excerpt: post.excerpt, date: post.date, status: post.status, tags: post.tags } : p)
          : [...posts, { slug, title: post.title, excerpt: post.excerpt, date: post.date, status: post.status, tags: post.tags }]
      }
      updated.posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      await fetch('/api/content/writing/index', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(updated),
      })
      await load()
      setForm(emptyPost())
      setEditing(false)
    } catch (err) {
      console.error('Save error:', err)
    } finally {
      setSaving(false)
    }
  }

  const remove = async (slug: string) => {
    if (!confirm('Delete this post?')) return
    try {
      await fetch(`/api/content/writing/${slug}`, { method: 'DELETE' })
      await fetch('/api/content/writing/index', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ posts: posts.filter(p => p.slug !== slug) }),
      })
      await load()
    } catch (err) {
      console.error('Remove error:', err)
    }
  }

  const edit = async (slug: string) => {
    const res = await fetch(`/api/content/writing/${slug}`)
    if (!res.ok) return
    const post = await res.json()
    setForm({ ...post, tagsInput: (post.tags ?? []).join(', ') })
    setEditing(true)
  }

  return (
    <div>
      <div className="flex items-start justify-between mb-8">
        <div>
          <p className="font-mono text-[10px] tracking-widest uppercase text-brand-night/55">Journal</p>
          <h1 className="font-serif italic text-3xl text-brand-night mt-1 mb-2">Writing</h1>
          <div className="w-12 h-px bg-brand-amber/60" />
        </div>
        <BrushButton onClick={() => { setForm(emptyPost()); setEditing(true) }}>
          + New Post
        </BrushButton>
      </div>

      {editing && (
        <div className="bg-white border border-brand-night/10 p-6 mb-6">
          <div className="grid md:grid-cols-2 gap-4 mb-4">
            <input placeholder="Title" value={form.title ?? ''} onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
              className="bg-transparent border-b border-brand-night/30 font-serif text-brand-night focus:outline-none focus:border-brand-iris transition-colors py-2" />
            <input placeholder="Date (YYYY-MM-DD)" value={form.date ?? ''} onChange={e => setForm(f => ({ ...f, date: e.target.value }))}
              className="bg-transparent border-b border-brand-night/30 font-serif text-brand-night focus:outline-none focus:border-brand-iris transition-colors py-2" />
            <input placeholder="Excerpt" value={form.excerpt ?? ''} onChange={e => setForm(f => ({ ...f, excerpt: e.target.value }))}
              className="bg-transparent border-b border-brand-night/30 font-serif text-brand-night focus:outline-none focus:border-brand-iris transition-colors py-2" />
            <select value={form.status ?? 'draft'} onChange={e => setForm(f => ({ ...f, status: e.target.value as 'published' | 'draft' }))}
              className="bg-transparent border-b border-brand-night/30 font-serif text-brand-night focus:outline-none focus:border-brand-iris transition-colors py-2">
              <option value="draft">Draft</option>
              <option value="published">Published</option>
            </select>
            <input
              placeholder="Tags (comma separated)"
              value={form.tagsInput}
              onChange={e => setForm(f => ({ ...f, tagsInput: e.target.value }))}
              className="bg-transparent border-b border-brand-night/30 font-serif text-brand-night focus:outline-none focus:border-brand-iris transition-colors py-2" />
          </div>
          <RichTextEditor value={form.content ?? ''} onChange={content => setForm(f => ({ ...f, content }))} />
          <div className="flex gap-3 mt-4 items-center">
            <BrushButton onClick={save} disabled={saving || !form.title}>
              {saving ? 'Saving…' : 'Save'}
            </BrushButton>
            <button onClick={() => { setEditing(false); setForm(emptyPost()) }}
              className="font-mono text-[10px] uppercase tracking-widest text-brand-night/55 hover:text-brand-night transition-colors">
              Cancel
            </button>
          </div>
        </div>
      )}

      <div className="bg-white border border-brand-night/10 divide-y divide-brand-night/10">
        {posts.length === 0 && <p className="p-6 font-serif text-sm text-brand-night/40">No posts yet.</p>}
        {posts.map(post => (
          <div key={post.slug} className="flex items-center justify-between px-5 py-3">
            <div>
              <p className="font-serif text-sm text-brand-night">{post.title}</p>
              <p className="font-mono text-[10px] tracking-widest uppercase text-brand-night/40 mt-0.5">{post.date}</p>
            </div>
            <div className="flex items-center gap-3">
              <span className={`font-mono text-[10px] uppercase tracking-widest px-2 py-0.5
                ${post.status === 'published' ? 'bg-brand-amber text-brand-night' : 'bg-brand-night/10 text-brand-night/55'}`}>
                {post.status}
              </span>
              <button onClick={() => edit(post.slug)} className="font-mono text-[10px] uppercase tracking-widest text-brand-iris hover:text-brand-night transition-colors">Edit</button>
              <button onClick={() => remove(post.slug)} className="font-mono text-[10px] uppercase tracking-widest text-brand-rose hover:text-brand-night transition-colors">
                <Trash2 size={14} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
