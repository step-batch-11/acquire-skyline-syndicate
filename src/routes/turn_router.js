import { Hono } from "hono";
import { TurnController } from "../controllers/turn_controller.js";

export const createTurnRouter = () => {
  const turn = new Hono();
  const turnController = new TurnController();

  turn.post("/place-tile", turnController.placeTile);
  turn.post("/build-hotel", turnController.buildHotel);
  turn.post("/buy-stocks", turnController.buyStocks);
  turn.get("/current-state", turnController.currentState);
  return turn;
};
