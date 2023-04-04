import { TRPCError } from "@trpc/server";
import { z } from "zod";

import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "~/server/api/trpc";
import { prisma } from "~/server/db";
import { fetchAllConsumptionsByCategories } from "~/utils/admin";

export const consumptionRouter = createTRPCRouter({
  getConsumptionsGrouped: publicProcedure.query(async ({ input }) => {
    try {
      const consumptions = await fetchAllConsumptionsByCategories();

      if (!consumptions) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "consumptions not found",
        });
      }
      return consumptions;
    } catch (err) {
      console.log(err);
    }
  }),

  editConsumption: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        name: z.string(),
        points: z.number(),
        categoryId: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      await prisma.consumption.update({
        where: { id: input.id },
        data: {
          name: input.name,
          points: input.points,
          consumptionCategoryId: input.categoryId,
        },
      });

      return { success: true };
    }),
});
