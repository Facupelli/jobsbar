import { TRPCError } from "@trpc/server";
import { z } from "zod";

import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "~/server/api/trpc";
import { prisma } from "~/server/db";
import { fetchUserConsumptionsByCategories } from "~/utils/admin";

export const userRouter = createTRPCRouter({
  getUserById: publicProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input }) => {
      try {
        const user = await prisma.user.findUnique({
          where: { id: input.id },
        });

        if (!user) {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "User not found",
          });
        }
        return { success: true, user };
      } catch (err) {
        console.log(err);
      }
    }),

  getUser: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input }) => {
      try {
        const user = await prisma.user.findUnique({
          where: { id: input.id },
          include: {
            membership: true,
            consumptions: { include: { consumption: true } },
          },
        });

        if (!user) {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "User not found",
          });
        }

        return user;
      } catch (err) {
        console.log(err);
      }
    }),

  getUserConsumptionsGrouped: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input }) => {
      try {
        const categories = await fetchUserConsumptionsByCategories(input.id);

        if (!categories) {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Consumptions not found",
          });
        }

        const consumptionsByCategory = categories.map((category) => ({
          id: category.id,
          name: category.name,
          consumptions: category.consumptions.map((c) => ({
            ...c,
            users: c.users.filter((user) => user.userId === input.id),
          })),
        }));

        return consumptionsByCategory;
      } catch (err) {
        console.log(err);
      }
    }),
});
