import { prisma } from "@/lib/db/prisma";
import NextAuth from "next-auth";
import GithubProvider from "next-auth/providers/github";

export const authOptions = {
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID ?? "",
      clientSecret: process.env.GITHUB_SECRET ?? "",
    }),
  ],
  callbacks: {
    async jwt({ token, user }: { token: any; user: any }) {
      // Persist the OAuth access_token to the token right after signin
      if (user) {
        // Do DB work in jwt callback itself. On first call when user exists, query/create your DB user,
        // then add that id to the token you return.
        try {
          const dbUser = await prisma.user.upsert({
            where: { email: user.email },
            update: {}, // Don't update anything if they exist
            create: {
              email: user.email,
              name: user.name,
            },
          });

          token.userId = dbUser.id;
        } catch (error) {
          throw error;
        }
      }
      return token;
    },
    async session({
      session,
      token,
      user,
    }: {
      session: any;
      token: any;
      user: any;
    }) {
      // Send properties to the client, like an access_token from a provider.
      session.accessToken = token.accessToken;
      return session;
    },
  },
};

export const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
