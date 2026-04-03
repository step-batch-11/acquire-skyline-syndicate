import { Hono } from "hono";

export const turn = new Hono();

const placeTile = async (c) => {
  const { tile } = await c.req.json();
  const game = c.get("game");

  return c.json(game.placeTile(tile));
};

const buildHotel = async (c) => {
  const { hotelToFound } = await c.req.json();
  const game = c.get("game");
  game.buildHotel(hotelToFound);

  return c.json(game.currentState());
};

turn.post("/placeTile", placeTile);
turn.post("/buildHotel", buildHotel);
