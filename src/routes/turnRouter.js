import { Hono } from "hono";

export const turn = new Hono();

const currentState = (c) => {
  // const game = c.get("game");
  const gameManagaer = c.get("gameManager");
  const game = gameManagaer.getGame();
  return c.json(game.currentState());
};
const placeTile = async (c) => {
  const { tile } = await c.req.json();
  // const game = c.get("game");
  const gameManagaer = c.get("gameManager");
  const game = gameManagaer.getGame();
  game.placeTile(tile);
  return c.json(game.currentState());
};

const buildHotel = async (c) => {
  const { hotelToFound } = await c.req.json();
  // const game = c.get("game");
  const gameManagaer = c.get("gameManager");
  const game = gameManagaer.getGame();
  game.buildHotel(hotelToFound);
  return c.json(game.currentState());
};

const assignNewTile = (c) => {
  // const game = c.get("game");
  const gameManagaer = c.get("gameManager");
  const game = gameManagaer.getGame();
  game.assignNewTile();
  return c.json(game.currentState());
};

const buyStocks = async (c) => {
  const cart = await c.req.json();
  // const game = c.get("game");
  const gameManagaer = c.get("gameManager");
  const game = gameManagaer.getGame();
  const res = game.buyStocks(cart);
  return c.json(res);
};

turn.post("/place-tile", placeTile);
turn.post("/build-hotel", buildHotel);
turn.post("/assign-new-tile-to-player", assignNewTile);
turn.post("/buy-stocks", buyStocks);
turn.get("/current-state", currentState);
