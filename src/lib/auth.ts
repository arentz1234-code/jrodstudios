import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";

// Hardcoded admin for demo (password: admin123)
const DEMO_ADMIN = {
  id: "admin-1",
  email: "admin@jrodstudios.com",
  name: "Admin",
  // bcrypt hash of "admin123"
  password: "$2a$10$K7L1OJ45/4Y2nIvhRVpCe.FSmhDdWoXehVzJptJ/op0lSsvqNu/1u",
};

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        // Check against demo admin
        if (credentials.email !== DEMO_ADMIN.email) {
          return null;
        }

        const isValid = await bcrypt.compare(
          credentials.password,
          DEMO_ADMIN.password
        );

        if (!isValid) {
          return null;
        }

        return {
          id: DEMO_ADMIN.id,
          email: DEMO_ADMIN.email,
          name: DEMO_ADMIN.name,
        };
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/admin/login",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET || "jrod-studios-secret-key",
};
