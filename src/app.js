import { Hono } from "hono";
import { serveStatic } from "hono/deno";
import { logger } from "hono/logger";
import {
  handleAssignTile,
  handleInitialSetup,
  handleUpdateTiles,
} from "./handlers.js";

export const createApp = (service) => {
  const app = new Hono();
  app.use(logger());
  app.use(async (context, next) => {
    context.set("service", service);
    await next();
  });
  app.post("/update-player-tiles", handleUpdateTiles);
  app.post("/assign-new-tile", handleAssignTile);
  app.get("/initial-setup", handleInitialSetup);
  app.get("*", serveStatic({ root: "public" }));
  return app;
};
