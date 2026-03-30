import { Hono } from "hono";
import { serveStatic } from "hono/deno";
import { logger } from "hono/logger";

export const createApp = (service) => {
  const app = new Hono();
  app.use(logger());
  app.get("/initial-setup", (context) => {
    return context.json(service.initialSetup());
  });
  app.get("*", serveStatic({ root: "public" }));
  return app;
};
