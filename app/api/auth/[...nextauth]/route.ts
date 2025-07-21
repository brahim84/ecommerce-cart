// app/api/auth/[...nextauth]/route.ts
import NextAuth from "next-auth"
import type { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import bcrypt from "bcryptjs"
import prisma from "@/utils/db"

const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      // Note: authorize only takes one param here
      async authorize(credentials) {
        if (!credentials?.email || !credentials.password) {
          return null
        }

        // 1) Lookup user
        const user = await prisma.user.findFirst({
          where: { email: credentials.email },
        })
        if (!user || !user.password) {
          return null
        }

        // 2) Verify password
        const isValid = await bcrypt.compare(
          credentials.password,
          user.password
        )
        if (!isValid) {
          return null
        }

        // 3) Return minimal user object
        return { id: user.id, email: user.email }
      },
    }),
  ],
  callbacks: {
    // Example: allow all sign‑ins
    async signIn({ user }) {
      return true
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
  },
}

const handler = NextAuth(authOptions)
export { handler as GET, handler as POST }
