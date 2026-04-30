// lib/blob.ts
import { put, del, list } from '@vercel/blob'

const CONTENT_PREFIX = 'content/'

/**
 * Read a JSON file from Vercel Blob.
 * Returns null if the file does not exist.
 */
export async function readJSON<T>(path: string): Promise<T | null> {
  try {
    const blobs = await list({ prefix: CONTENT_PREFIX + path })
    const match = blobs.blobs.find(b => b.pathname === CONTENT_PREFIX + path)
    if (!match) return null
    const res = await fetch(match.url, { cache: 'no-store' })
    if (!res.ok) return null
    return res.json() as Promise<T>
  } catch {
    return null
  }
}

/**
 * Write a JSON file to Vercel Blob (upsert — overwrites if exists).
 */
export async function writeJSON<T>(path: string, data: T): Promise<void> {
  const content = JSON.stringify(data, null, 2)
  await put(CONTENT_PREFIX + path, content, {
    access: 'public',
    contentType: 'application/json',
    addRandomSuffix: false,
    allowOverwrite: true,
  })
}

/**
 * Delete a file from Vercel Blob by pathname.
 */
export async function deleteBlob(path: string): Promise<void> {
  const blobs = await list({ prefix: CONTENT_PREFIX + path })
  const match = blobs.blobs.find(b => b.pathname === CONTENT_PREFIX + path)
  if (match) await del(match.url)
}

/**
 * Upload a media file to Vercel Blob.
 * Returns the public URL.
 */
export async function uploadMedia(
  file: File | Blob,
  pathname: string,
  contentType: string
): Promise<string> {
  const result = await put(`media/${pathname}`, file, {
    access: 'public',
    contentType,
    addRandomSuffix: false,
    allowOverwrite: true,
  })
  return result.url
}
