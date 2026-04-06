import { Hono } from "hono";

export const turn = new Hono();

const currentState = (c) => {
  const game = c.get("game");
  return c.json(game.currentState());
};
const placeTile = async (c) => {
  const { tile } = await c.req.json();
  const game = c.get("game");
  game.placeTile(tile);
  return c.json(game.currentState());
};

const buildHotel = async (c) => {
  const { hotelToFound } = await c.req.json();
  const game = c.get("game");
  game.buildHotel(hotelToFound);
  return c.json(game.currentState());
};

const assignNewTile = (c) => {
  const game = c.get("game");
  game.assignNewTile();
  return c.json(game.currentState());
};

const buyStocks = async (c) => {
  const cart = await c.req.json();
  const game = c.get("game");
  const res = game.buyStocks(cart);
  return c.json(res);
};

turn.post("/placeTile", placeTile);
turn.post("/buildHotel", buildHotel);
turn.post("/assignNewTileToPlayer", assignNewTile);
turn.post("/buy-stocks", buyStocks);
turn.get("/currentState", currentState);
