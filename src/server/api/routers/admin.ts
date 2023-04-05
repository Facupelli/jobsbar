import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { prisma } from "~/server/db";

export const adminRouter = createTRPCRouter({
  getMostPopularConsumptions: protectedProcedure.query(async () => {
    const categories = await prisma.consumptionCategory.findMany({
      include: {
        consumptions: {
          include: {
            users: true,
          },
        },
      },
      take: 5,
    });

    if (!categories) {
      return;
    }

    const mostPopular = categories.map((category) => ({
      ...category,
      consumptions: category.consumptions
        .map((consumption) => ({
          name: consumption.name,
          total: consumption.users.reduce((acc, curr) => {
            return acc + curr.quantity;
          }, 0),
        }))
        .sort((a, b) => (a.total > b.total ? -1 : 1)),
    }));

    return mostPopular;
    // const ew = getConsumptionsReducedQuantity(consumptions[0]?.consumptions)
  }),

  getMostPopularPromotion: protectedProcedure.query(async () => {
    const promotions = await prisma.promotion.findMany({
      include: {
        users: true,
      },
      take: 10,
    });

    if (!promotions) {
      return;
    }

    const mostPopular = promotions
      .map((promo) => ({
        name: promo.name,
        total: promo.users.reduce((acc, curr) => {
          return acc + curr.quantity;
        }, 0),
      }))
      .sort((a, b) => (a.total > b.total ? -1 : 1));

    return mostPopular;
  }),

  getMostValuableUser: protectedProcedure.query(async () => {
    const users = await prisma?.user.findMany({
      orderBy: {
        totalPointsSpent: "desc",
      },
      take: 10,
    });

    return users;
  }),

  postMembership: protectedProcedure
    .input(
      z.object({
        name: z.string(),
        minPoints: z.number(),
        maxPoints: z.number().nullable(),
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

  createUser: protectedProcedure
    .input(z.object({ name: z.string() }))
    .mutation(async ({ input }) => {
      const lowestMembership = await prisma.membership.findFirst({
        orderBy: { minPoints: "asc" },
        select: { id: true },
      });

      if (!lowestMembership) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "No existe una membresía para aplicarle al usuario",
        });
      }
      await prisma.user.create({
        data: {
          membershipId: lowestMembership.id,
          name: input.name,
        },
      });

      return { success: true };
    }),

  createPromotion: protectedProcedure
    .input(
      z.object({
        name: z.string(),
        membershipsIds: z.string().array(),
        discount: z.number(),
        points: z.number(),
        consumptionsIds: z.string().array(),
        quantity: z.number(),
      })
    )
    .mutation(async ({ input }) => {
      const newPromotion = await prisma.promotion.create({
        data: {
          name: input.name,
          memberships: { connect: input.membershipsIds.map((id) => ({ id })) },
          points: Number(input.points),
          discount: Number(input.discount),
        },
      });

      await prisma.$transaction(
        input.consumptionsIds.map((consumptionId: string) =>
          prisma.consumptionOnPromotion.create({
            data: {
              promotion: { connect: { id: newPromotion.id } },
              consumption: { connect: { id: consumptionId } },
              quantity: Number(input.quantity),
            },
          })
        )
      );
    }),
});
