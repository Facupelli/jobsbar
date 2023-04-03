import { z } from "zod";

import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "~/server/api/trpc";
import { prisma } from "~/server/db";

export const userRouter = createTRPCRouter({
  getUserById: publicProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input }) => {
      try {
        const user = await prisma.user.findUnique({
          where: { id: input.id },
        });

        if (user) {
          return { success: true, user };
        }
        return { success: false, message: "user not found" };
      } catch (err) {
        console.log(err);
      }
    }),
});
