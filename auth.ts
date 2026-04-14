import NextAuth, { type NextAuthConfig } from 'next-auth'
import Google from 'next-auth/providers/google'

const adminEmails = (process.env.ADMIN_EMAILS || '').split(',').map((e) => e.trim()).filter(Boolean)

export const authConfig = {
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
    }),
  ],
  session: { strategy: 'jwt' },
  callbacks: {
    async jwt({ token, profile }) {
      if (profile && 'email' in profile && typeof profile.email === 'string') {
        token.email = profile.email
        token.role = adminEmails.includes(profile.email) ? 'owner' : 'editor'
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        // @ts-expect-error augment
        session.user.role = token.role || 'editor'
      }
      return session
    },
  },
  // Make it clear when secrets are missing
  trustHost: true,
  debug: process.env.NODE_ENV !== 'production' && (!process.env.NEXTAUTH_SECRET || !process.env.GOOGLE_CLIENT_ID),
} satisfies NextAuthConfig

export const { handlers, auth, signIn, signOut } = NextAuth(authConfig)
