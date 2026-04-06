import { Hono } from "hono";
import { serveStatic } from "hono/deno";
import { logger } from "hono/logger";
import { lobby } from "./routes/lobbyRouter.js";
import { turn } from "./routes/turnRouter.js";
import { handleShiftTurn } from "./handlers/game_handler.js";

// export const createApp = (service, gameEngine, lobbyInstance) => {
export const createApp = (lobbyInstance, createGame) => {
  const app = new Hono();
  app.use(logger());
  app.use(async (context, next) => {
    context.set("createGame", createGame);
    context.set("lobby", lobbyInstance);
    await next();
  });
  app.use(async (context, next) => {
      context.set("createGame", createGame);
      context.set("lobby", lobbyInstance);
      await next();
    });
  app.route("/lobby", lobby);
  app.route("/turn", turn);
  app.post("/shiftTurn", handleShiftTurn);
  app.get("*", serveStatic({ root: "public" }));
  return app;
};
