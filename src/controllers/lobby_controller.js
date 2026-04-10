import { getCookie } from "hono/cookie";

export class LobbyController {
  constructor() {
  }

  hostLobby(c) {
    const sessions = c.get("sessions");
    const sessionId = getCookie(c, "sessionId");
    const playerId = sessions.getPlayerId(sessionId);
    const lobbyId = Math.floor(Math.random() * 1000000);
    const lobby = c.get("lobby");
    lobby.lobbyId = lobbyId;
    lobby.host = playerId;
    lobby.playerId = playerId;

    return c.redirect("/pages/lobby.html", 302);
  }

  async joinLobby(c) {
    const lobby = c.get("lobby");
    if (!lobby.isFull()) {
      const formData = await c.req.formData();

      const _lobbyId = formData.get("lobby_id");

      const sessions = c.get("sessions");
      const sessionId = getCookie(c, "sessionId");

      const playerId = sessions.getPlayerId(sessionId);
      lobby.playerId = playerId;

      return c.json({ isDone: true, url: "/pages/lobby.html" });
    }
    return c.json({ isDone: false, msg: "Lobby is full !" });
  }

  lobbyDetails(c) {
    const sessionId = getCookie(c, "sessionId");
    const sessions = c.get("sessions");
    const lobby = c.get("lobby");
    const playerId = sessions.getPlayerId(sessionId);
    const lobbyId = lobby.lobbyId;
    const playerIds = lobby.activePlayerIds;
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
