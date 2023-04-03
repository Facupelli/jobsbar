import { prisma } from "~/server/db";

export const fetchAllConsumptionsByCategories = async () => {
  return await prisma.consumptionCategory.findMany({
    select: {
      id: true,
      name: true,
      consumptions: {
        select: {
          name: true,
          points: true,
          id: true,
        },
      },
    },
    orderBy: {
      name: "asc",
    },
  });
};

export const fetchUserConsumptionsByCategories = async (userId: string) => {
  return await prisma.consumptionCategory.findMany({
    select: {
      id: true,
      name: true,
      consumptions: {
        select: {
          name: true,
          users: {
            select: {
              userId: true,
            },
          },
        },
        where: {
          users: {
            some: {
              userId,
            },
          },
        },
      },
    },
    orderBy: {
      name: "asc",
    },
  });
};

export const fetchAllPromotions = async () => {
  return await prisma.promotion.findMany({
    select: {
      name: true,
      id: true,
      discount: true,
      points: true,
      memberships: { select: { name: true } },
      consumptions: {
        select: {
          consumption: {
            select: {
              name: true,
              consumptionCategory: { select: { name: true } },
            },
          },
        },
      },
    },
  });
};
