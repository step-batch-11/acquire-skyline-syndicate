import { createBoard, initialBoardSetup } from "./initial_setup.js";

globalThis.onload = () => {
  createBoard();
  initialBoardSetup();
};
