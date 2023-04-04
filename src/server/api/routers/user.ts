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
  getAllUsers: protectedProcedure.query(async () => {
    const allUsers = await prisma.user.findMany({});

    const usersCount = await prisma.user.count();

    return { allUsers, usersCount };
  }),

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
            membership: {
              include: { promotions: { include: { consumptions: true } } },
            },
            consumptions: {
              include: {
                consumption: { include: { consumptionCategory: true } },
              },
            },
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

  postConsumptionOnUser: publicProcedure
    .input(
      z.object({
        userId: z.string(),
        consumptionId: z.string(),
        points: z.number(),
        quantity: z.number(),
      })
    )
    .mutation(async ({ input }) => {
      const userToUpdate = await prisma.user.findUnique({
        where: { id: input.userId },
      });

      if (!userToUpdate) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "User not found",
        });
      }

      await prisma.consumptionOnUser.create({
        data: {
          user: { connect: { id: input.userId } },
          consumption: { connect: { id: input.consumptionId } },
          quantity: Number(input.quantity),
        },
      });

      await prisma.user.update({
        where: { id: input.userId },
        data: {
          totalPoints: {
            increment: Number(input.points),
          },
        },
      });

      return { success: true };
    }),

  updateGameStatus: protectedProcedure
    .input(z.object({ winner: z.boolean(), id: z.string() }))
    .mutation(async ({ input }) => {
      await prisma.consumptionOnUser.update({
        where: { id: input.id },
        data: {
          winner: input.winner,
        },
      });

      return { success: true };
    }),
});
