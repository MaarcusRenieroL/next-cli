// @ts-nocheck
import { Hono } from "hono";
import { cors } from "hono/cors";
import { handle } from "hono/vercel";
import users from "./routers/user";
import { Bindings } from "./types";

const allowedOrigins = [process.env.NEXT_PUBLIC_APP_URL].filter(Boolean) as string[];

const app = new Hono<{ Bindings: Bindings }>()
  .basePath("/api")
  .use(
    cors({
      origin: (origin) => {
        if (!origin || allowedOrigins.includes(origin)) return origin;
        return "";
      },
      credentials: true,
    })
  )
  .route("/user", users);

// The handler Next.js uses to answer API requests
export const httpHandler = handle(app);

/**
 * (Optional)
 * Exporting our API here for easy deployment
 *
 * Run `npm run deploy` for one-click API deployment to Cloudflare's edge network
 */
export default app;

// export type definition of API
export type AppType = typeof app;
