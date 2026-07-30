import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";

import { prisma } from "@/lib/prisma";

export const { handlers, auth, signIn, signOut } = NextAuth({
  trustHost: true,

  secret: process.env.AUTH_SECRET,

  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID || "",
      clientSecret: process.env.AUTH_GOOGLE_SECRET || "",
    }),
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email or Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const emailOrUsername = (credentials?.email as string)?.trim();
        const password = (credentials?.password as string)?.trim();

        if (!emailOrUsername) return null;

        try {
          // Find user by email or username (case insensitive)
          let user = await prisma.user.findFirst({
            where: {
              OR: [
                { email: { equals: emailOrUsername, mode: "insensitive" } },
                { name: { equals: emailOrUsername, mode: "insensitive" } },
              ],
            },
          });

          // If user doesn't exist, return null so they are forced to register/sign-up first
          if (!user) {
            return null;
          }

          // If user exists and has a password, verify it
          if (user.password && password) {
            const isValid = await bcrypt.compare(password, user.password);
            if (!isValid) {
              return null;
            }
          } else if (!user.password && password) {
            // If legacy user had no password set, save this password for future logins
            const hashedPassword = await bcrypt.hash(password, 10);
            await prisma.user.update({
              where: { id: user.id },
              data: { password: hashedPassword },
            });
          }

          return user;
        } catch (error) {
          console.error("Authorize error:", error);
          return null;
        }
      },
    }),
  ],

  session: {
    strategy: "jwt",
  },

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        if (token.email) session.user.email = token.email as string;
        if (token.name) session.user.name = token.name as string;
      }
      return session;
    },
  },

  pages: {
    signIn: "/login",
    error: "/login",
  },
});