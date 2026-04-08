import { getCookie } from "hono/cookie";

export class LobbyController {
  constructor() {
  }

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

  redirectToJoinLobby(c) {
    return c.redirect("/pages/join_lobby.html", 302);
  }
}
