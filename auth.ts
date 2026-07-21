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
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const email = (credentials?.email as string)?.trim()?.toLowerCase();
        const password = (credentials?.password as string)?.trim();

        if (!email) return null;

        try {
          // Find user by email (case insensitive)
          let user = await prisma.user.findFirst({
            where: { email: { equals: email, mode: "insensitive" } },
          });

          // If user doesn't exist yet, automatically create their account
          if (!user) {
            const hashedPassword = password ? await bcrypt.hash(password, 10) : null;
            user = await prisma.user.create({
              data: {
                email,
                name: email.split("@")[0],
                password: hashedPassword,
              },
            });
            return user;
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