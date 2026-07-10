import NextAuth from "next-auth";
import Discord from "next-auth/providers/discord";
import { connectDB } from "./mongodb";
import User from "@/models/User";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Discord({
      clientId: process.env.DISCORD_CLIENT_ID!,
      clientSecret: process.env.DISCORD_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async signIn({ profile }) {
      if (!profile) return false;
      await connectDB();

      const discordProfile = profile as {
        id: string;
        username: string;
        email?: string;
        avatar?: string;
      };

      await User.findOneAndUpdate(
        { discordId: discordProfile.id },
        {
          discordId: discordProfile.id,
          username: discordProfile.username,
          email: discordProfile.email,
          avatar: discordProfile.avatar,
          updatedAt: new Date(),
        },
        { upsert: true, new: true }
      );

      return true;
    },
    async session({ session, token }) {
      if (token.sub) {
        session.user.discordId = token.sub;
      }
      return session;
    },
    async jwt({ token, profile }) {
      if (profile) {
        token.sub = (profile as { id: string }).id;
      }
      return token;
    },
  },
  pages: {
    signIn: "/login",
  },
});
