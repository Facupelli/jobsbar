import { TRPCError } from "@trpc/server";
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
