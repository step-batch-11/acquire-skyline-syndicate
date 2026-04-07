import { Hono } from "hono";
import { serveStatic } from "hono/deno";
import { logger } from "hono/logger";
import { getCookie, setCookie } from "hono/cookie";
import { lobby } from "./routes/lobbyRouter.js";
import { turn } from "./routes/turnRouter.js";
import { handleShiftTurn } from "./handlers/game_handler.js";

const login = async (c) => {
  const formData = await c.req.formData();
  const playerName = formData.get("player_name");
  const sessionId = crypto.randomUUID();
  const playerId = crypto.randomUUID();
  const sessions = c.get("sessions");
  sessions.setSession(sessionId, playerId);
  sessions.setPlayerId(playerId, playerName);
  setCookie(c, "sessionId", sessionId);
  return c.redirect("pages/menu.html", 302);
};

const getPlayerName = (c) => {
  const sessionId = getCookie(c, "sessionId");
  const sessions = c.get("sessions");
  const playerId = sessions.getPlayerId(sessionId);
  const playerName = sessions.getPlayerName(playerId);
  return c.json({ playerName });
};

// const requireLogin = async (c, next) => {
//   const sessionId = getCookie(c, "sessionId");
//   const sessions = c.get("sessions");
//   if (sessions.hasSessionId(sessionId)) await next();
//   return c.redirect("/redirect-login", 302);
// };

const startGame = (c) => {
  const gameManagaer = c.get("gameManager");
  const lobby = c.get("lobby");
  const sessions = c.get("sessions");
  const playerIds = lobby.getActivePlayersIds();
  const playerIdsMap = sessions.getPlayerIds();
  const playerNameIds = [...playerIdsMap].filter(([playerId, _]) =>
    playerIds.includes(playerId)
  );
  gameManagaer.createGame(playerNameIds);
  lobby.transitionToStart();
  // return c.body(null, 204);
  return c.redirect("/pages/lobby.html", 302);
};

const redirectToGame = (c) => {
  return c.redirect("/pages/game.html", 302);
};

export const createApp = (sessions, lobbyInstance, gameManager) => {
  const app = new Hono();
  app.use(logger());
  app.use(async (context, next) => {
    context.set("gameManager", gameManager);
    context.set("lobby", lobbyInstance);
    context.set("sessions", sessions);
    await next();
  });

  app.get("/start-game", startGame);
  app.get("/game", redirectToGame);

  app.route("/lobby", lobby);
  app.route("/turn", turn);
  app.post("/shift-turn", handleShiftTurn);
  app.post("/login", login);

  // app.get("/pages/menu.html", requireLogin);
  app.get("/menu/get-player-name", getPlayerName);

  app.get("/redirect-login", (c) => c.redirect("pages/login.html", 302));

  app.get("*", serveStatic({ root: "public" }));
  return app;
};
