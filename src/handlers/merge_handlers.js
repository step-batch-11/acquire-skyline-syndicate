import { getCookie } from "hono/cookie";

export const equalHotelMergeHandler = async (c) => {
  const body = await c.req.json();
  const sessions = c.get("sessions");
  const sessionId = getCookie(c, "sessionId");
  const playerId = sessions.getPlayerId(sessionId);
  const gameManager = c.get("gameManager");
  const game = gameManager.game;
  return c.json(game.merge(body, playerId));
};

export const handleStockDissolution = async (c) => {
  const body = await c.req.json();
  const sessions = c.get("sessions");
  const sessionId = getCookie(c, "sessionId");
  const playerId = sessions.getPlayerId(sessionId);
  const gameManager = c.get("gameManager");
  const game = gameManager.game;

  return c.json(game.handleStockDissolution(body, playerId));
};
