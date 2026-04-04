import { Hono } from "hono";
import { serveStatic } from "hono/deno";
import { logger } from "hono/logger";
import { lobby } from "./routes/lobbyRouter.js";
import { turn } from "./routes/turnRouter.js";
import {
  buildHotel,
  handleAssignTile,
  handleInitialSetup,
  handleUpdateTiles,
} from "./handlers.js";
import { handleShiftTurn } from "./handlers/game_handler.js";

export const createApp = (service, gameEngine, game) => {
  const app = new Hono();
  app.use(logger());
  app.use(async (context, next) => {
    context.set("service", service);
    context.set("engine", gameEngine);
    context.set("game", game);
    await next();
  });
  app.route("/lobby", lobby);
  app.route("/turn", turn);
  app.post("/shiftTurn", handleShiftTurn);
  app.post("/update-player-tiles", handleUpdateTiles);
  app.post("/build-hotel", buildHotel);
  app.post("/assign-new-tile", handleAssignTile);
  app.get("/initial-setup", handleInitialSetup);
  app.get("*", serveStatic({ root: "public" }));
  return app;
};
