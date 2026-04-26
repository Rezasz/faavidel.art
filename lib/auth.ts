// lib/auth.ts
import NextAuth from 'next-auth'
import Credentials from 'next-auth/providers/credentials'

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Credentials({
      name: 'Admin',
      credentials: {
        username: { label: 'Username', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        const validUser = credentials?.username === process.env.ADMIN_USER
        const validPass = credentials?.password === process.env.ADMIN_PASS
        if (validUser && validPass) {
          return { id: '1', name: 'Admin', email: 'admin@faavidel.art' }
        }
        return null
      },
    }),
  ],
  pages: {
    signIn: '/admin',
  },
  session: { strategy: 'jwt', maxAge: 24 * 60 * 60 },
  secret: process.env.NEXTAUTH_SECRET,
})
