import { Hono } from "hono";
import { getCookie } from "hono/cookie";

export const turn = new Hono();

export const extractRequestedPlayerId = (c) => {
  const sessions = c.get("sessions");
  const sessionId = getCookie(c, "sessionId");
  return sessions.getPlayerId(sessionId);
};

const currentState = (c) => {
  const gameManagaer = c.get("gameManager");
  const game = gameManagaer.getGame();
  const playerId = extractRequestedPlayerId(c);

  return c.json(game.currentState(playerId));
};
const placeTile = async (c) => {
  const { tile } = await c.req.json();
  const gameManagaer = c.get("gameManager");
  const game = gameManagaer.getGame();
  const playerId = extractRequestedPlayerId(c);
  game.placeTile(playerId, tile);
  return c.json({ message: "Tile placed successfully" });
};

const buildHotel = async (c) => {
  const { hotelToFound } = await c.req.json();
  const gameManagaer = c.get("gameManager");
  const game = gameManagaer.getGame();
  const playerId = extractRequestedPlayerId(c);
  game.buildHotel(playerId, hotelToFound);
  return c.json({ message: "Tile placed successfully" });
};

const buyStocks = async (c) => {
  const cart = await c.req.json();
  const gameManagaer = c.get("gameManager");
  const game = gameManagaer.getGame();
  const playerId = extractRequestedPlayerId(c);
  const res = game.buyStocks(playerId, cart);
  return c.json(res);
};

turn.post("/place-tile", placeTile);
turn.post("/build-hotel", buildHotel);
turn.post("/buy-stocks", buyStocks);
turn.get("/current-state", currentState);
