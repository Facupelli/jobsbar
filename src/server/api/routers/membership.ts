import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { prisma } from "~/server/db";

export const membershipRouter = createTRPCRouter({
  getAllMemberships: protectedProcedure.query(async () => {
    const memberships = await prisma.membership.findMany();

    return memberships;
  }),

  editMembershipById: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        name: z.string(),
        minPoints: z.number(),
        maxPoints: z.number().nullable(),
      })
    )
    .mutation(async ({ input }) => {
      await prisma.membership.update({
        where: { id: input.id },
        data: {
          name: input.name,
          minPoints: input.minPoints,
          maxPoints: input.maxPoints,
        },
      });

      return { success: true };
    }),

  deleteMembershipById: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input }) => {
      await prisma.membership.delete({
        where: { id: input.id },
      });

      return { success: true };
    }),
});
