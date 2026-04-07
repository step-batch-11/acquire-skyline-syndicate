import { getCookie } from "hono/cookie";

export class LobbyController {
  constructor() {
  }

  // gameState(c) {
  //   const gameManager = c.get("gameManager");
  //   const game = gameManager.getGame()
  //   return c.json(game.currentState());
  // }

  hostLobby(c) {
    const sessions = c.get("sessions");
    const sessionId = getCookie(c, "sessionId");
    const playerId = sessions.getPlayerId(sessionId);
    const lobbyId = crypto.randomUUID();
    const lobby = c.get("lobby");
    lobby.setLobby(lobbyId);
    lobby.setHost(playerId);
    lobby.setPlayer(playerId);

    return c.redirect("/pages/lobby.html", 302);
  }

  async joinLobby(c) {
    const formData = await c.req.formData();
    const _lobbyId = formData.get("lobby_id");

    const sessions = c.get("sessions");
    const sessionId = getCookie(c, "sessionId");

    const playerId = sessions.getPlayerId(sessionId);
    const lobby = c.get("lobby");
    lobby.setPlayer(playerId);

    return c.redirect("/pages/lobby.html", 302);
  }

  lobbyDetails(c) {
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
  }

  // async createGame(c) {
  //   const createGameInstance = c.get("createGame");
  //   const lobbyInstance = c.get("lobby");

  //   if (lobbyInstance.isFull()) {
  //     const mockPlayers = ["yash", "pradipta"];
  //     c.set("game", createGameInstance(mockPlayers));
  //   }

  //   return await c.json({ "done": true });
  // }

  redirectToJoinLobby(c) {
    return c.redirect("/pages/join_lobby.html", 302);
  }
}
