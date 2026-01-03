import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { customSession } from "better-auth/plugins";
import { nextCookies } from "better-auth/next-js";

import { findUserById } from "./db/user";

import { PrismaClient } from "@/app/generated/prisma";

const prisma = new PrismaClient();

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  emailAndPassword: {
    enabled: true,
  },
  plugins: [
    customSession(async ({ user, session }) => {
      const myUser = await findUserById(user.id);

      return {
        user: myUser,
        session,
      };
    }),
    nextCookies(),
  ],
});
