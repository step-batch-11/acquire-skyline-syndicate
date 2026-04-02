import { Hono } from "hono";

export const turn = new Hono();

const placeTile = async (c) => {
  const { tile } = await c.req.json();
  const playerTiles = ["8g", "1f", "2c", "7a", "3a", "9d"];
  const tilesOnBoard = ["2h", "9c", "4b", "2i", "10a", "1g"];
  const tileIndex = playerTiles.indexOf(tile);

  playerTiles.splice(tileIndex, 1);
  tilesOnBoard.push(tile);

  const res = { playerTiles, tilesOnBoard };

  return c.json(res);
};

turn.post("/placeTile", placeTile);
