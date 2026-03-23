import NextAuth from 'next-auth'
import Credentials from 'next-auth/providers/credentials'
import * as bcrypt from 'bcryptjs'
import { prisma } from '@/lib/prisma'
import { authConfig } from './auth.config'
import { z } from 'zod'

async function getMember(email: string) {
  return prisma.member.findUnique({ where: { email } })
}

export const { auth, signIn, signOut, handlers } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      async authorize(credentials) {
        const parsed = z.object({
          email: z.string().email(),
          password: z.string().min(6),
        }).safeParse(credentials)

        if (!parsed.success) return null

        const member = await getMember(parsed.data.email)
        if (!member) return null

        const passwordMatch = await bcrypt.compare(
          parsed.data.password,
          member.passwordHash
        )
        if (!passwordMatch) return null

        return {
          id:       member.id,
          name:     member.name,
          email:    member.email,
          role:     member.role,
          slug:     member.slug,
          imageUrl: member.imageUrl,
        }
      },
    }),
  ],
})
