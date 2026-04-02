import { createBoard, initializeGameSetup } from "./initial_setup.js";
import { startGame } from "./controllers.js";

globalThis.onload = async () => {
  const initialData = await startGame();
  createBoard();
  initializeGameSetup(initialData);
};
