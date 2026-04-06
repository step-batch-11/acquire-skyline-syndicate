import { Hono } from "hono";
export const lobby = new Hono();

const gameState = (c) => {
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

const createGame = async (context) => {
  const createGameInstance = context.get("createGame");
  const lobbyInstance = context.get("lobby");

  if (lobbyInstance.isFull()) {
    // insert the player inside the game.
    const mockPlayers = ["yash", "pradipta"];
    context.set("game", createGameInstance(mockPlayers));
  }

  return await context.json({ "done": true });
};

lobby.post("/join", joinLobby);
lobby.get("/state", currentState);
lobby.get("/create-game", createGame);
lobby.get("/start-game", gameState);
lobby.get("/active-players", activePlayers);
