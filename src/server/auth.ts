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
      // ...other properties
      // role: UserRole;
    };
  }

  interface User {
    id: string;
    name: string,
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
  callbacks: {
    session: ({ session, user }) => ({
      ...session,
      user: {
        ...session.user,
        id: user.id,
      },
    }),
  },
  adapter: PrismaAdapter(prisma),
  providers: [
    Credentials({
      type: "credentials",
      credentials: {
        email: {label: "Email", type: "text"},
        password: {label: "Password", type: "password"},
        name: {type: "text"},
        displayName: {type: "text"},
        username: {type: "text"},
      },
      async authorize(credentials, req): Promise<User | null> {
        try {
          if (!credentials) {
            throw new Error("Credentials are not defined")
          }

          const user = await prisma.user.findFirst({
            where: {
              email: credentials.email,
            },
          })

          if (!user) {
            const existingUser = await prisma.user.findFirst({
              where: {email: credentials.email},
            });

            if (existingUser) {
              throw new Error("Email is already registered");
            }

            const hashedPassword = await bcrypt.hash(credentials.password, 10);

            const newUser = await prisma.user.create({
              data: {
                email: credentials.email,
                password: hashedPassword,
                name: credentials.name,
                displayName: credentials.displayName,
                username: credentials.username,
              }
            })

            return {
              id: newUser.id,
              name: newUser.name,
              displayName: newUser.displayName,
              username: newUser.username,
              email: newUser.email,
              image: newUser.image
            }
          }

          // Verify the password using bcrypt
          const passwordMatch = await bcrypt.compare(credentials.password, user.password);

          if (!passwordMatch) {
            throw new Error("Invalid password");
          }

          return {
            id: user.id,
            name: user.name,
            displayName: user.displayName,
            username: user.username,
            email: user.email,
            image: user.image
          }
        } catch (e) {
          console.log(e)
        }

        return null;
      },
    })
  ],
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
