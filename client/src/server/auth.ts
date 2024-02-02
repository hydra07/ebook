import axios from '@/lib/axios';
import { NextAuthOptions } from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import Google from 'next-auth/providers/google';
export const authOptions: NextAuthOptions = {
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
    Credentials({
      name: 'Credentials',
      id: 'credentials',
      credentials: {
        // email: { label: 'Email', type: 'text' },
        // password: { label: 'Password', type: 'password' },
        email: {},
        password: {},
      },
      async authorize(credentials) {
        try {
          const _user = {
            email: credentials?.email,
            password: credentials?.password,
          };
          const res = await axios.post('/auth/login', _user);
          // const { token, message, user } = res.data;
          // console.log(token);
          if (res.data) {
            // return { token, message };
            // return Promise.resolve({ token, message });
            return res.data;
            // return { id: token, name: message, email: credentials?.email };
          }
          return null;
        } catch (error: any) {
          throw new Error(error);
        }
      },
    }),
  ],
  callbacks: {
    async signIn({ user }) {
      // console.log('user ', user);
      try {
        const res = await axios.post(`/auth/google`, user);
        if (res.data) {
          // console.log('res.data ', JSON.stringify(res.data));
          (user as any).token = res.data.token;
          return true;
        } else {
          return false;
        }
      } catch (error) {
        return false;
      }
    },
    async jwt({ token, user }) {
      if (user) {
        // console.log(`[1]day la user ${JSON.stringify(user)}`);
        token.accessToken = (user as any).token;
      }
      // console.log(`[2]day la token ${JSON.stringify(token)}`);
      return { ...token, ...user };
      // return token;
    },
    async session({ session, token }) {
      session.user.accessToken = token.accessToken as string;
      // session.user.id = (token.user as any).id as number;
      // session.user.email = (token.user as any).email as string;
      // session.user.name = (token.user as any).name as string;
      // session.user.image = (token.user as any).avatar as string;
      // session.user.gender = (token.user as any).gender as boolean;
      // console.log(`[3]day la session ${JSON.stringify(session)}`);
      return session;
    },
  },

  pages: {
    signIn: '/login',
    signOut: '/logout',
  },
};
