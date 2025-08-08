// app/api/auth/[...nextauth]/route.ts
import NextAuth from "next-auth"
import type { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import bcrypt from "bcryptjs"
import prisma from "@/utils/db"
import { Session, User } from "next-auth";
import jwt from "jsonwebtoken";

declare module "next-auth" {
  interface User {
    token?: string;
  }
}

declare module "next-auth" {
  interface Session {
    token?: string;
  }
}

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
        // Generate JWT with user info
        const jwtToken = jwt.sign(
          { id: user.id, email: user.email },
          process.env.NEXTAUTH_SECRET!,
          { expiresIn: "1d" }
        );
        // 3) Return minimal user object
        return { id: user.id, email: user.email, token: jwtToken }
      },
    }),
  ],
  callbacks: {
    // // Example: allow all sign‑ins
    // async signIn({ user }) {
    //   return true
    // },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.email = user.email;
        token.jwt = user.token; // Store the JWT string
      }
      return token
    },
    async session({ session, token }) {
      session.token = typeof token.jwt === "string" ? token.jwt : undefined;
      return session
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
  },
}
export { authOptions }; 
const handler = NextAuth(authOptions)
export { handler as GET, handler as POST }
