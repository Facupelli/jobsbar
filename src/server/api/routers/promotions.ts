import { TRPCError } from "@trpc/server";
import { z } from "zod";

import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "~/server/api/trpc";
import { prisma } from "~/server/db";
import {
  fetchAllConsumptionsByCategories,
  fetchAllPromotions,
} from "~/utils/admin";

export const promotionRouter = createTRPCRouter({
  getAllPromotions: protectedProcedure.query(async () => {
    const allPromotions = await fetchAllPromotions();

    return allPromotions;
  }),

  postPromotionOnUser: publicProcedure
    .input(
      z.object({
        userId: z.string(),
        points: z.number(),
        quantity: z.number(),
        promotionId: z.string(),
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

      //CARGAR PROMO EN USUARIO
      if (userToUpdate.totalPoints - input.points >= 0) {
        await prisma.promotionOnUser.create({
          data: {
            promotionId: input.promotionId,
            userId: input.userId,
            quantity: Number(input.quantity),
          },
        });

        const user = await prisma.user.update({
          where: { id: input.userId },
          data: {
            totalPoints: {
              decrement: Number(input.points),
            },
            totalPointsSpent: {
              increment: Number(input.points),
            },
          },
          include: { membership: true },
        });

        // ACTUALIZAR MEMEBRESÍA SI ES NECESARIO
        if (
          user &&
          user.membership?.maxPoints &&
          user.totalPointsSpent > user.membership?.maxPoints
        ) {
          const membership = await prisma.membership.findFirst({
            where: {
              AND: [
                { minPoints: { lte: user.totalPointsSpent } },
                { maxPoints: { gt: user.totalPointsSpent } },
              ],
            },
          });

          if (membership) {
            await prisma.user.update({
              where: { id: input.userId },
              data: {
                membership: { connect: { id: membership.id } },
              },
            });
          }
        }
        return;
      }

      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "El usuario no tiene suficientes puntos",
      });
    }),

  deletePromotion: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input }) => {
      await prisma.promotion.delete({
        where: { id: input.id },
      });

      return { success: true };
    }),
});
