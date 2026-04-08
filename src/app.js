import { Hono } from "hono";
import { serveStatic } from "hono/deno";
import { logger } from "hono/logger";
import { createLobbyRouter } from "./routes/lobby_router.js";
import { createTurnRouter } from "./routes/turn_router.js";
import { handleShiftTurn } from "./controllers/game_controller.js";
import { loadGameState, saveGameState } from "./controllers/dev_controller.js";
import { createGameRouter } from "./routes/game_router.js";
import { createLoginRouter } from "./routes/login_router.js";

// const requireLogin = async (c, next) => {
//   const sessionId = getCookie(c, "sessionId");
//   const sessions = c.get("sessions");
//   if (sessions.hasSessionId(sessionId)) await next();
//   return c.redirect("/redirect-login", 302);
// };

export const createApp = (sessions, lobbyInstance, gameManager, isDevMode) => {
  const app = new Hono();
  const lobbyRouter = createLobbyRouter();
  const gameRouter = createGameRouter();
  const loginRouter = createLoginRouter();
  const turnRouter = createTurnRouter();

  app.use(logger());
  app.use(async (c, next) => {
    c.set("gameManager", gameManager);
    c.set("lobby", lobbyInstance);
    c.set("sessions", sessions);
    await next();
  });

  app.route("/game", gameRouter);
  app.route("/lobby", lobbyRouter);
  app.route("/turn", turnRouter);
  app.route("/login", loginRouter);

  app.post("/shift-turn", handleShiftTurn);

  if (isDevMode) {
    app.get("/save", saveGameState);
    app.get("/state", loadGameState);
  }

  app.get("*", serveStatic({ root: "public" }));
  return app;
};
