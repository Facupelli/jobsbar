import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { prisma } from "~/server/db";

export const membershipRouter = createTRPCRouter({
  getAllMemberships: protectedProcedure.query(async () => {
    const memberships = await prisma.membership.findMany();

    return memberships;
  }),
});
