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
  const _lobbyId = formData.get("lobby_id");

  const sessions = c.get("sessions");
  const sessionId = getCookie(c, "sessionId");

  const playerId = sessions.getPlayerId(sessionId);
  const lobby = c.get("lobby");
  lobby.setPlayer(playerId);

  return c.redirect("/pages/lobby.html", 302);
};

const lobbyDetails = (c) => {
  const sessionId = getCookie(c, "sessionId");
  const sessions = c.get("sessions");
  const lobby = c.get("lobby");
  const playerId = sessions.getPlayerId(sessionId);
  const lobbyId = lobby.lobbyId;
  const playerIds = lobby.getActivePlayersIds();
  const playerNames = playerIds.map((id) => sessions.getPlayerName(id));

  return c.json({
    state: lobby.currentState(playerId),
    lobbyDetails: { lobbyId, playerNames },
  });
};

const createGame = async (context) => {
  const createGameInstance = context.get("createGame");
  const lobbyInstance = context.get("lobby");

  if (lobbyInstance.isFull()) {
    // insert the player inside the game.
    const mockPlayers = ["yash", "pradipta"];
    context.set("game", createGameInstance(mockPlayers));
  }

  return await context.json({ done: true });
};

const redirectToJoinLobby = (c) => {
  return c.redirect("/pages/join_lobby.html", 302);
};

lobby.get("/host", hostLobby);
lobby.get("/join", redirectToJoinLobby);
lobby.post("/join-lobby", joinLobby);
// lobby.get("/state", currentState);
lobby.get("/create-game", createGame);
lobby.get("/start-game", gameState);
lobby.get("/lobby-details", lobbyDetails);
