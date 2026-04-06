import { Hono } from "hono";

export const turn = new Hono();

const placeTile = async (c) => {
  const { tile } = await c.req.json();
  const lobby = c.get("lobby");
  const game = lobby.getGame();
  game.placeTile(tile);
  return c.json(game.currentState());
};

const buildHotel = async (c) => {
  const { hotelToFound } = await c.req.json();

  const lobby = c.get("lobby");
  const game = lobby.getGame();
  game.buildHotel(hotelToFound);
  return c.json(game.currentState());
};

const assignNewTile = (c) => {
  const lobby = c.get("lobby");
  const game = lobby.getGame();
  game.assignNewTile();
  return c.json(game.currentState());
};

const buyStocks = async (c) => {
  const cart = await c.req.json();
  const lobby = c.get("lobby");
  const game = lobby.getGame();
  const res = game.buyStocks(cart);
  return c.json(res);
};

turn.post("/placeTile", placeTile);
turn.post("/buildHotel", buildHotel);
turn.post("/assignNewTileToPlayer", assignNewTile);
turn.post("/buy-stocks", buyStocks);
