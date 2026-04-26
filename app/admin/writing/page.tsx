'use client'
import { useEffect, useState } from 'react'
import { PostIndex, Post } from '@/lib/types'
import RichTextEditor from '@/components/admin/RichTextEditor'
import { Plus, Trash2 } from 'lucide-react'

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
    setSaving(false)
  }

  const remove = async (slug: string) => {
    if (!confirm('Delete this post?')) return
    await fetch('/api/content/writing/index', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ posts: posts.filter(p => p.slug !== slug) }),
    })
    await load()
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
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-serif text-2xl text-charcoal">Writing</h1>
        <button onClick={() => { setForm(emptyPost()); setEditing(true) }}
          className="flex items-center gap-2 bg-ocean text-white font-sans text-xs tracking-wider uppercase px-4 py-2 rounded">
          <Plus size={14} /> New Post
        </button>
      </div>

      {editing && (
        <div className="bg-white rounded-lg border border-gray-100 p-6 mb-6">
          <div className="grid md:grid-cols-2 gap-4 mb-4">
            <input placeholder="Title" value={form.title ?? ''} onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
              className="border border-gray-200 rounded px-3 py-2 font-sans text-sm focus:outline-none focus:border-seafoam" />
            <input placeholder="Date (YYYY-MM-DD)" value={form.date ?? ''} onChange={e => setForm(f => ({ ...f, date: e.target.value }))}
              className="border border-gray-200 rounded px-3 py-2 font-sans text-sm focus:outline-none focus:border-seafoam" />
            <input placeholder="Excerpt" value={form.excerpt ?? ''} onChange={e => setForm(f => ({ ...f, excerpt: e.target.value }))}
              className="border border-gray-200 rounded px-3 py-2 font-sans text-sm focus:outline-none focus:border-seafoam" />
            <select value={form.status ?? 'draft'} onChange={e => setForm(f => ({ ...f, status: e.target.value as 'published' | 'draft' }))}
              className="border border-gray-200 rounded px-3 py-2 font-sans text-sm focus:outline-none focus:border-seafoam bg-white">
              <option value="draft">Draft</option>
              <option value="published">Published</option>
            </select>
            <input
              placeholder="Tags (comma separated)"
              value={form.tagsInput}
              onChange={e => setForm(f => ({ ...f, tagsInput: e.target.value }))}
              className="border border-gray-200 rounded px-3 py-2 font-sans text-sm focus:outline-none focus:border-seafoam transition-colors" />
          </div>
          <RichTextEditor value={form.content ?? ''} onChange={content => setForm(f => ({ ...f, content }))} />
          <div className="flex gap-3 mt-4">
            <button onClick={save} disabled={saving || !form.title}
              className="bg-burnt text-white font-sans text-xs tracking-wider uppercase px-5 py-2 rounded disabled:opacity-50">
              {saving ? 'Saving...' : 'Save'}
            </button>
            <button onClick={() => { setEditing(false); setForm(emptyPost()) }}
              className="border border-gray-200 text-charcoal/60 font-sans text-xs px-5 py-2 rounded">
              Cancel
            </button>
          </div>
        </div>
      )}

      <div className="bg-white rounded-lg border border-gray-100 divide-y divide-gray-50">
        {posts.length === 0 && <p className="p-6 font-sans text-sm text-charcoal/40">No posts yet.</p>}
        {posts.map(post => (
          <div key={post.slug} className="flex items-center justify-between px-5 py-3">
            <div>
              <p className="font-sans text-sm text-charcoal">{post.title}</p>
              <p className="font-sans text-xs text-charcoal/40 mt-0.5">{post.date}</p>
            </div>
            <div className="flex items-center gap-3">
              <span className={`font-sans text-xs uppercase tracking-wider px-2 py-0.5 rounded-full
                ${post.status === 'published' ? 'bg-seafoam/10 text-seafoam' : 'bg-gray-100 text-gray-400'}`}>
                {post.status}
              </span>
              <button onClick={() => edit(post.slug)} className="font-sans text-xs text-ocean hover:underline">Edit</button>
              <button onClick={() => remove(post.slug)} className="text-charcoal/30 hover:text-burnt"><Trash2 size={14} /></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
