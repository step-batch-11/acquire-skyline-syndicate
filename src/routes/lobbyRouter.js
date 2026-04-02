import { Hono } from "hono";
import { bankData } from "../bank_data.js";

export const lobby = new Hono();

export const createTiles = () => {
  const tiles = [];
  const string = "abcdefghi";
  for (let col = 0; col < string.length; col++) {
    for (let row = 1; row <= 12; row++) {
      tiles.push(`${row}${string[col]}`);
    }
  }
  return tiles;
};

const startGame = (c) => {
  const res = {
    amount: 6000,
    playerTiles: ["8g", "1f", "2c", "7a", "3a", "9d"],
    tilesOnBoard: ["2h", "9c", "4b", "2i", "10a", "1g"],
    bankData,
  };

  return c.json(res);
};

lobby.get("/startGame", startGame);
