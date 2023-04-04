import { createTRPCRouter } from "~/server/api/trpc";
import { exampleRouter } from "~/server/api/routers/example";
import { userRouter } from "./routers/user";
import { consumptionRouter } from "./routers/consumption";
import { promotionRouter } from "./routers/promotions";
import { adminRouter } from "./routers/admin";
import { membershipRouter } from "./routers/membership";
import { rankingRouter } from "./routers/ranking";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  example: exampleRouter,
  user: userRouter,
  consumptions: consumptionRouter,
  promotions: promotionRouter,
  admin: adminRouter,
  membership: membershipRouter,
  ranking: rankingRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
