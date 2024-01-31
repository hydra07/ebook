import NextAuth from "next-auth/next";

declare module "next-auth" {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    user: {
      id: number;
      email: string;
      name: string;
      image: string;
      gender: boolean;
      accessToken: string;
      // refreshToken: string;
    }
  };
}