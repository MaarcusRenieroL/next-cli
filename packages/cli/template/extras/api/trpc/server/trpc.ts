import { initTRPC, TRPCError } from "@trpc/server";
import superjson from "superjson";

import { Context } from "./trpc/context";
import { ZodError } from "zod";

const t = initTRPC.context<Context>().create({
  transformer: superjson,
  isServer: typeof window === "undefined" ? true : false,
  errorFormatter({ shape, error }) {
    return {
      ...shape,
      data: {
        ...shape.data,
        zodError: error.cause instanceof ZodError ? error.cause.flatten() : null,
      },
    };
  },
  isDev: process.env.NODE_ENV === "development" ? true : false,
});

export const middleware = t.middleware;
export const withAuth = middleware(async ({ ctx, next }) => {
  if (!process.env.API_SECRET) {
    throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "API_SECRET is not configured" });
  }

  const token = ctx.req?.headers.get("authorization")?.replace(/^Bearer\\s+/i, "");

  if (token !== process.env.API_SECRET) {
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }

  return next({
    ctx: {
      session: { authorized: true },
    },
  });
});

export const createCallerFactory = t.createCallerFactory;
export const router = t.router;

// Define all procedure here
export const procedure = t.procedure;

export const publicProcedure = procedure;
export const privateProcedure = procedure.use(withAuth);
