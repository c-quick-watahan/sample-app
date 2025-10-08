import { prisma } from "@/lib/db/prisma";
import NextAuth, { Session, User } from "next-auth";
import { JWT } from "next-auth/jwt";
import GithubProvider from "next-auth/providers/github";

declare module "next-auth" {
  interface Session {
    userId?: string;
    user?: {
      name?: string | null;
      email?: string | null;
      image?: string | null;
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    userId?: string;
  }
}
export const authOptions = {
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID ?? "",
      clientSecret: process.env.GITHUB_SECRET ?? "",
    }),
  ],
  callbacks: {
    async jwt({ token, user }: { token: JWT; user?: User }) {
      // Persist the OAuth access_token to the token right after signin
      if (user) {
        // Do DB work in jwt callback itself. On first call when user exists, query/create your DB user,
        // then add that id to the token you return.
        try {
          const dbUser = await prisma.user.upsert({
            where: { email: user.email! },
            update: {}, // Don't update anything if they exist
            create: {
              email: user.email!,
              name: user.name || "Anonymous",
            },
          });
          token.userId = dbUser.id;
        } catch (error) {
          throw error;
        }
      }
      return token;
    },
    async session({ session, token }: { session: Session; token: JWT }) {
      if (token.userId) {
        session.userId = token.userId;
      }
      return session;
    },
  },
};

export const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
