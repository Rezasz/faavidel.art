import assert from 'node:assert/strict'
import { reduceMusicState, initialMusicState } from '../context/MusicContext'

const s0 = initialMusicState()
assert.equal(s0.playing, false)

const s1 = reduceMusicState(s0, { type: 'play' })
assert.equal(s1.playing, true)

const s2 = reduceMusicState(s1, { type: 'pause' })
assert.equal(s2.playing, false)

const s3 = reduceMusicState(s2, { type: 'toggle' })
assert.equal(s3.playing, true)

const s4 = reduceMusicState(s3, { type: 'hydrate', playing: false })
assert.equal(s4.playing, false)

console.log('✓ music state reducer ok')
