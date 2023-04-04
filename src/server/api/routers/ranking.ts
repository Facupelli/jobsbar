import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { prisma } from "~/server/db";
import { Consumption } from "~/types/model";

export const rankingRouter = createTRPCRouter({
  getGameRankingById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input }) => {
      const game = await prisma.consumption.findUnique({
        where: { id: input.id },
        include: {
          users: {
            where: {
              winner: true,
            },
            select: {
              id: true,
              winner: true,
              quantity: true,
              user: {
                select: {
                  id: true,
                  name: true,
                },
              },
            },
          },
        },
      });

      if (!game) {
        return;
      }

      type Game = {
        id: string;
        name: string;
        points: number;
        consumptionCategoryId: string;
        users: {
          id: string;
          quantity: number;
          user: { id: string; name: string | null };
          winner: boolean | null;
        }[];
      };

      function getWinnersByUser(game: Game) {
        const result: Record<string, number> = {};
        game.users.forEach((user) => {
          if (user.winner) {
            const userName = user.user.name;
            if (userName) {
              if (result[userName]) {
                result[userName]++;
              } else {
                result[userName] = 1;
              }
            }
          }
        });
        return Object.entries(result)
          .map(([name, total]) => ({ name, total }))
          .sort((a, b) => (a.total > b.total ? -1 : 1));
      }

      const winnersByUser = getWinnersByUser(game);

      return winnersByUser;
    }),
});
