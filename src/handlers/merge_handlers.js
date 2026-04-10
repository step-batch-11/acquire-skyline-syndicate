import { getCookie } from "hono/cookie";

export const equalHotelMergeHandler = (c, body) => {
  const sessions = c.get("sessions");
  const sessionId = getCookie(c, "sessionId");
  const playerId = sessions.getPlayerId(sessionId);
  const gameManager = c.get("gameManager");
  const game = gameManager.game;

  return game.merge(body, playerId);
};
