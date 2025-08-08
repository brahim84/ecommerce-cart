// auth/authOptions.ts
import type { NextAuthOptions, Session, User } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import prisma from "@/utils/db";
import jwt from "jsonwebtoken";


declare module "next-auth" {
  interface Session {
    token?: string;
    user: {
      id?: string;
      email?: string;
      role?: string;
    }
  }
  interface User {
    id: string;
    email: string;
    role?: string;
    token?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
    email?: string;
    role?: string;
    jwt?: string;
  }
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials.password) {
          return null;
        }
        const user = await prisma.user.findFirst({
          where: { email: credentials.email },
        });
        if (!user || !user.password) {
          return null;
        }
        const isValid = await bcrypt.compare(credentials.password, user.password);
        if (!isValid) {
          return null;
        }
        // Generate JWT token to forward to backend if needed
        const jwtToken = jwt.sign(
          { id: user.id, email: user.email, role: user.role },
          process.env.NEXTAUTH_SECRET!,
          { expiresIn: "1d" }
        );
        return { id: user.id, email: user.email, role: user.role ?? undefined, token: jwtToken };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.role = user.role;
        token.jwt = user.token; // Store the custom JWT
      }
      return token;
    },
    async session({ session, token }) {
      // Attach the JWT as token, and add role to session user
      session.token = typeof token.jwt === "string" ? token.jwt : undefined;
      session.user.id = token.id;
      session.user.email = token.email;
      session.user.role = token.role;
      return session;
    },
  },
  session: { strategy: "jwt" },
  secret: process.env.NEXTAUTH_SECRET,
};
