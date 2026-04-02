import { createBoard, initializeGameSetup } from "./initial_setup.js";
import { startGame } from "./request.js";

globalThis.onload = async () => {
  const initialData = await startGame();
  createBoard();
  initializeGameSetup(initialData);
};
