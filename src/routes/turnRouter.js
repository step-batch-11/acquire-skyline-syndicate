import { Hono } from "hono";

export const turn = new Hono();

const placeTile = async (c) => {
  const { tile } = await c.req.json();
  const game = c.get("game");

  return c.json(game.placeTile(tile));
};

turn.post("/placeTile", placeTile);
