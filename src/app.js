import { Hono } from "hono";
import { serveStatic } from "hono/deno";
import { logger } from "hono/logger";
import { getCookie, setCookie } from "hono/cookie";
import { lobby } from "./routes/lobbyRouter.js";
import { turn } from "./routes/turnRouter.js";

export const createApp = (lobbyInstance, game, sessions) => {
  const app = new Hono();
  app.use(logger());
  app.use(async (context, next) => {
    context.set("game", game);
    context.set("lobby", lobbyInstance);

    context.set("sessions", sessions);
    await next();
  });

  app.route("/lobby", lobby);
  app.route("/turn", turn);
  app.post("/login", async (c) => {
    const formData = await c.req.formData();
    const playerName = formData.get("player_name");
    const sessionId = crypto.randomUUID();
    const sessions = c.get("sessions");
    sessions.addPlayer(sessionId, playerName);
    setCookie(c, "sessionId", sessionId);
    return c.redirect("pages/menu.html");
  });
  app.get("/menu/get-player-name", (c) => {
    const sessionId = getCookie(c, "sessionId");
    const sessions = c.get("sessions");
    const playerName = sessions.getPlayerName(sessionId);
    return c.json({ playerName });
  });
  app.get("/redirect-login", (c) => c.redirect("pages/login.html", 302));
  app.get("*", serveStatic({ root: "public" }));
  return app;
};
