import { Hono } from "hono";

export const turn = new Hono();

const placeTile = async (c) => {
  const { tile } = await c.req.json();
  const game = c.get("game");

  return c.json(game.placeTile(tile));
};

const buildHotel = async () => {
};

const assignNewTile = (c) => {
  const game = c.get("game");
  return c.json(game.assignNewTile());
};

turn.post("/placeTile", placeTile);
turn.post("/buildHotel", buildHotel);
turn.post("/assignNewTileToPlayer", assignNewTile);
