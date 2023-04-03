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
});
