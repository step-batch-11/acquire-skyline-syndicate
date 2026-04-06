import { createBoard, renderGame } from "./initial_setup.js";
import { gameState } from "./request.js";

globalThis.onload = async () => {
  const gameData = await gameState();
  createBoard();

  renderGame(gameData);
};
