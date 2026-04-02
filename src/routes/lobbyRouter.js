import { Hono } from "hono";

export const lobby = new Hono();

const startGame = (c) => {
  const game = c.get("game");
  return c.json(game.init((tiles) => tiles));
};

lobby.get("/startGame", startGame);
