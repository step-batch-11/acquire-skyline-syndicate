import { getCookie } from "hono/cookie";

export class TurnController {
  currentState(c) {
    const gameManager = c.get("gameManager");
    const game = gameManager.getGame();
    const sessions = c.get("sessions");
    const sessionId = getCookie(c, "sessionId");
    const playerId = sessions.getPlayerId(sessionId);

    return c.json(game.currentState(playerId));
  }

  async placeTile(c) {
    const { tile } = await c.req.json();
    const gameManager = c.get("gameManager");
    const game = gameManager.getGame();
    game.placeTile(tile);
    return c.json({ message: "Tile placed successfully" });
  }

  async buildHotel(c) {
    const { hotelToFound } = await c.req.json();
    const gameManager = c.get("gameManager");
    const game = gameManager.getGame();
    game.buildHotel(hotelToFound);
    return c.json({ message: "Tile placed successfully" });
  }

  async buyStocks(c) {
    const cart = await c.req.json();
    const gameManager = c.get("gameManager");
    const game = gameManager.getGame();
    const res = game.buyStocks(cart);
    return c.json(res);
  }
}
