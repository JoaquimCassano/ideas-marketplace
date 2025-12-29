import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { getUsersCollection } from "./mongodb";
import bcrypt from "bcryptjs";

const handleAuthorize = async (
  credentials: Record<string, string> | undefined
) => {
  if (!credentials?.email || !credentials?.password) {
    return null;
  }

  const users = await getUsersCollection();
  const user = await users.findOne({ email: credentials.email });

  if (!user) {
    return null;
  }

  const isPasswordValid = await bcrypt.compare(
    credentials.password,
    user.password
  );

  if (!isPasswordValid) {
    return null;
  }

  return {
    id: user._id.toString(),
    email: user.email,
    name: user.name,
  };
};

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      authorize: handleAuthorize,
    }),
  ],
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
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
});
