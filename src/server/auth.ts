import {PrismaAdapter} from "@next-auth/prisma-adapter";
import {type GetServerSidePropsContext} from "next";
import {type DefaultSession, getServerSession, type NextAuthOptions, User,} from "next-auth";
import {prisma} from "~/server/db";
import Credentials from "next-auth/providers/credentials";
import * as bcrypt from "bcrypt"

/**
 * Module augmentation for `next-auth` types. Allows us to add custom properties to the `session`
 * object and keep type safety.
 *
 * @see https://next-auth.js.org/getting-started/typescript#module-augmentation
 */
declare module "next-auth" {
  interface Session extends DefaultSession {
    user: DefaultSession["user"] & {
      id: string;
      firstName: string;
      lastName: string;
      displayName: string;
      username: string;
      email: string;
      image: string | null;
    };
  }

  interface User {
    id: string;
    firstName: string;
    lastName: string;
    displayName: string;
    username: string;
    email: string;
    image: string | null;
  }
}

/**
 * Options for NextAuth.js used to configure adapters, providers, callbacks, etc.
 *
 * @see https://next-auth.js.org/configuration/options
 */
export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60,
  },
  callbacks: {
    session: ({session, token}) => {
      return {
        ...session,
        user: {
          ...session.user,
          id: token.id,
          firstName: token.firstName,
          lastName: token.lastName,
          username: token.username,
          displayName: token.displayName
        },
      }
    },
    jwt: ({token, user}) => {
      if (user) {
        return {
          ...token,
          ...user
        }
      }
      return token
    }
  },
  adapter: PrismaAdapter(prisma),
  providers: [
    Credentials({
      id: "signIn",
      credentials: {
        email: {label: "Email", type: "text"},
        password: {label: "Password", type: "password"},
      },
      async authorize(credentials, req): Promise<User | null> {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        const user = await prisma.user.findUnique({
          where: {
            email: credentials.email,
          },
        })

        if (!user) {
          return null
        }

        const passwordMatch = await bcrypt.compare(credentials.password, user.password);

        if (!passwordMatch) {
          return null
        }

        return {

          id: user.id,
          firstName: user.firstName,
          lastName: user.lastName,
          displayName: user.displayName,
          username: user.username,
          email: user.email,
          image: user.image
        }
      },
    }),
    Credentials({
      id: "signUp",
      credentials: {
        email: {label: "Email", type: "text"},
        password: {label: "Password", type: "password"},
        firstName: {type: "text"},
        lastName: {type: "text"},
        displayName: {type: "text"},
        username: {type: "text"},
      },
      async authorize(credentials, req): Promise<User | null> {
        if (!credentials?.email || !credentials?.password || !credentials?.username || !credentials?.displayName || !credentials?.firstName || !credentials?.lastName) {
          return null
        }

        try {
          const newUser = await prisma.user.create({
            data: {
              email: credentials.email,
              password: await bcrypt.hash(credentials.password, 10),
              firstName: credentials.firstName,
              lastName: credentials.lastName,
              username: credentials.lastName,
              displayName: credentials.displayName
            }
          })

          return {
            id: newUser.id,
            firstName: newUser.firstName,
            lastName: newUser.lastName,
            displayName: newUser.displayName,
            username: newUser.username,
            email: newUser.email,
            image: newUser.image,
          }
        } catch (e: unknown) {
          console.log(e)
          return null
        }
      },
    })
  ],
  pages: {
    signIn: "/login",
    newUser: "/signup"
  }
};

/**
 * Wrapper for `getServerSession` so that you don't need to import the `authOptions` in every file.
 *
 * @see https://next-auth.js.org/configuration/nextjs
 */
export const getServerAuthSession = (ctx: {
  req: GetServerSidePropsContext["req"];
  res: GetServerSidePropsContext["res"];
}) => {
  return getServerSession(ctx.req, ctx.res, authOptions);
};
