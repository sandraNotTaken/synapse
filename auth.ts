import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import bcrypt from "bcryptjs";

import { prisma } from "@/lib/prisma";

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),

  trustHost: true,

  secret: process.env.AUTH_SECRET,

  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID!,
      clientSecret: process.env.AUTH_GOOGLE_SECRET!,
    }),
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const email = (credentials?.email as string)?.trim()?.toLowerCase();
        const password = credentials?.password as string;

        if (!email) return null;

        // Find user by email (case insensitive)
        let user = await prisma.user.findFirst({
          where: { email: { equals: email, mode: "insensitive" } },
        });

        // If user doesn't exist and no password provided (e.g. dev bypass), auto-create
        if (!user && !password) {
          user = await prisma.user.create({
            data: {
              email,
              name: email.split("@")[0],
            },
          });
          return user;
        }

        if (!user) {
          return null;
        }

        // If user has a hashed password, verify it
        if (user.password && password) {
          const isValid = await bcrypt.compare(password, user.password);
          if (!isValid) {
            return null;
          }
        }

        return user;
      },
    }),
  ],

  session: {
    strategy: "jwt",
  },

  callbacks: {
    async session({ session, token }) {
      if (session?.user?.email) {
        try {
          const dbUser = await prisma.user.findFirst({
            where: { email: { equals: session.user.email, mode: "insensitive" } },
            select: { name: true, image: true },
          });
          if (dbUser?.name) {
            session.user.name = dbUser.name;
          }
          if (dbUser?.image) {
            session.user.image = dbUser.image;
          }
        } catch (error) {
          // Silently handle database connection errors when offline to preserve session
        }
      }
      return session;
    },
  },

  pages: {
    signIn: "/login",
  },
});