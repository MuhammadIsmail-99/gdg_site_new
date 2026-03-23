import type { NextAuthConfig } from 'next-auth'

export const authConfig: NextAuthConfig = {
  pages: {
    signIn: '/login',
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user
      const role = (auth?.user as any)?.role || (auth as any)?.role
      
      console.log('MIDDLEWARE AUTHORIZED CHECK:', {
        pathname: nextUrl.pathname,
        isLoggedIn,
        role
      });

      const { pathname } = nextUrl
      const isOnDashboard = pathname.startsWith('/dashboard')
      const isOnCore      = pathname.startsWith('/core')
      const isOnAdmin     = pathname.startsWith('/admin')

      if (isOnAdmin) {
        if (!isLoggedIn) return false
        return role === 'admin'
      }
      if (isOnCore) {
        if (!isLoggedIn) return false
        return role === 'core' || role === 'admin'
      }
      if (isOnDashboard) {
        return isLoggedIn
      }
      return true
    },
    async jwt({ token, user }) {
      if (user) {
        token.id       = user.id
        // @ts-ignore
        token.role     = user.role
        // @ts-ignore
        token.slug     = user.slug
        // @ts-ignore
        token.imageUrl = user.imageUrl
      }
      return token
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id       = token.id       as string
        // @ts-ignore
        session.user.role     = token.role     as string
        // @ts-ignore
        session.user.slug     = token.slug     as string
        // @ts-ignore
        session.user.imageUrl = token.imageUrl as string
      }
      return session
    },
  },
  providers: [], // Add providers with an empty array for now
}
