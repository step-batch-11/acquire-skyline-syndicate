import { getCookie, setCookie } from "hono/cookie";

export class LoginController {
  #idGenerator;
  constructor(idGenerator = Date.now) {
    this.#idGenerator = idGenerator;
  }

  login(c, formData) {
    const playerName = formData.get("player_name");
    const sessionId = crypto.randomUUID();
    const playerId = this.#idGenerator();
    const sessions = c.get("sessions");
    sessions.setSession(sessionId, playerId);
    sessions.setPlayerId(playerId, playerName);
    setCookie(c, "sessionId", sessionId);
    return c.redirect("/pages/home_page.html", 302);
  }

  getPlayerName(c) {
    const sessionId = getCookie(c, "sessionId");
    const sessions = c.get("sessions");
    const playerId = sessions.getPlayerId(sessionId);
    const playerName = sessions.getPlayerName(playerId);
    return c.json({ playerName });
  }

  redirectToLogin(c) {
    return c.redirect("/pages/login.html", 302);
  }
}
