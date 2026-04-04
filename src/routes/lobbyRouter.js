import { Hono } from "hono";
export const lobby = new Hono();

const startGame = (c) => {
  const game = c.get("game");
  return c.json(game.currentState());
};

const joinLobby = async (c) => {
  const formData = await c.req.formData();
  const playerName = formData.get("player_name");

  const lobby = c.get("lobby");
  lobby.addPlayerToLobby(playerName);

  return c.redirect("/pages/lobby.html", 302);
};

const currentState = (c) => {
  const lobby = c.get("lobby");
  return c.json({ state: lobby.currentState() });
};

const activePlayers = (c) => {
  const lobby = c.get("lobby");
  const players = lobby.getActivePlayers();
  return c.json(players);
};

lobby.post("/join", joinLobby);
lobby.get("/state", currentState);
lobby.get("/startGame", startGame);
lobby.get("/active-players", activePlayers);
