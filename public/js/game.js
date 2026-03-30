import { initBank } from "./bank_setup.js";
import { createBoard, initialBoardSetup } from "./initial_setup.js";

globalThis.onload = () => {
  createBoard();
  initialBoardSetup();
  initBank();
};
