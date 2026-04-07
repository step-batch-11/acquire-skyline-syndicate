import { Hono } from "hono";
import { GameController } from "../controllers/game_controller.js";

export const createGameRouter = () => {
  const game = new Hono();
  const controller = new GameController();

  game.get("/start-game", controller.startGame);
  game.get("/join-game", controller.redirectToGame);

  return game;
};
