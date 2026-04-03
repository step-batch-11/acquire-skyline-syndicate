import { Hono } from "hono";

export const lobby = new Hono();

const startGame = (c) => {
  const game = c.get("game");
  return c.json(game.currentState());
};

lobby.get("/startGame", startGame);
