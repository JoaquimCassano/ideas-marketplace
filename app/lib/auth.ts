import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { getUsersCollection } from "./mongodb";
import bcrypt from "bcryptjs";

const handleAuthorize = async (
  credentials: Partial<Record<"email" | "password", unknown>> | undefined
) => {
  if (!credentials?.email || !credentials?.password) {
    return null;
  }

  const email = credentials.email as string;
  const password = credentials.password as string;

  const users = await getUsersCollection();
  const user = await users.findOne({ email });

  if (!user) {
    return null;
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);

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
