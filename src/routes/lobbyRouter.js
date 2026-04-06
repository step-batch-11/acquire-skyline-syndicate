import { Hono } from "hono";
import { getCookie } from "hono/cookie";
export const lobby = new Hono();

const gameState = (c) => {
  const game = c.get("game");
  return c.json(game.currentState());
};

const hostLobby = (c) => {
  const sessions = c.get("sessions");
  const sessionId = getCookie(c, "sessionId");
  // const playerName = sessions.getPlayerName(sessionId)
  const playerId = sessions.getPlayerId(sessionId);
  const lobbyId = crypto.randomUUID();
  const lobby = c.get("lobby");
  lobby.setLobby(lobbyId);
  lobby.setHost(playerId);
  lobby.setPlayer(playerId);

  return c.redirect("/pages/lobby.html", 302);
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

const lobbyDetails = (c) => {
  const sessions = c.get("sessions");
  const lobby = c.get("lobby");
  const lobbyId = lobby.lobbyId;
  const playerIds = lobby.getActivePlayers();
  const playerNames = playerIds.map((id) => sessions.getPlayerName(id));

  return c.json({ lobbyId, playerNames });
};

const createGame = async (context) => {
  const createGameInstance = context.get("createGame");
  const lobbyInstance = context.get("lobby");

  if (lobbyInstance.isFull()) {
    const mockPlayers = ["yash", "pradipta"];
    context.set("game", createGameInstance(mockPlayers));
  }

  return await context.json({ "done": true });
};

lobby.get("/host", hostLobby);
lobby.post("/join", joinLobby);
lobby.get("/state", currentState);
lobby.get("/create-game", createGame);
lobby.get("/start-game", gameState);
lobby.get("/lobby-details", lobbyDetails);
