import { getCookie } from "hono/cookie";

export const extractRequestedPlayerId = (c) => {
  const sessions = c.get("sessions");
  const sessionId = getCookie(c, "sessionId");
  return sessions.getPlayerId(sessionId);
};

export class TurnController {
  currentState(c) {
    const gameManager = c.get("gameManager");
    const game = gameManager.game;
    const playerId = extractRequestedPlayerId(c);
    return c.json(game.currentState(playerId));
  }

  async placeTile(c) {
    const { tile } = await c.req.json();
    const gameManager = c.get("gameManager");
    const game = gameManager.game;
    const playerId = extractRequestedPlayerId(c);
    try {
      const response = game.placeTile(playerId, tile);
      return c.json(response, 201);
    } catch (error) {
      return c.jon(error, 400);
    }
  }

  async buildHotel(c) {
    const { hotelToFound } = await c.req.json();
    const gameManager = c.get("gameManager");
    const game = gameManager.game;
    const playerId = extractRequestedPlayerId(c);
    game.buildHotel(playerId, hotelToFound);
    return c.json({ message: "Tile placed successfully" });
  }

  async buyStocks(c) {
    const cart = await c.req.json();
    const gameManager = c.get("gameManager");
    const game = gameManager.game;
    const playerId = extractRequestedPlayerId(c);
    const res = game.buyStocks(playerId, cart);

    return c.json(res);
  }
}
