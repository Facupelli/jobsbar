import { z } from "zod";

import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "~/server/api/trpc";
import { prisma } from "~/server/db";

export const adminRouter = createTRPCRouter({
  postMembership: protectedProcedure
    .input(
      z.object({
        name: z.string(),
        minPoints: z.number(),
        maxPoints: z.number(),
      })
    )
    .mutation(async ({ input }) => {
      await prisma.membership.create({
        data: {
          name: input.name,
          minPoints: Number(input.minPoints),
          maxPoints: Number(input.maxPoints),
        },
      });

      return { success: true };
    }),

  postConsumption: protectedProcedure
    .input(
      z.object({ name: z.string(), points: z.number(), categoryId: z.string() })
    )
    .mutation(async ({ input }) => {
      try {
        await prisma.consumption.create({
          data: {
            name: input.name,
            points: Number(input.points),
            consumptionCategoryId: input.categoryId,
          },
        });

        return { success: true };
      } catch (err) {
        console.log(err);
      }
    }),
});
