import { renderBoard } from "./initial_setup.js";
import { updateTiles } from "./game_state.js";
import { removeFocus } from "./board_ui.js";

export const addListener = (tilesOnBoard, playerTiles) => {
  const board = document.querySelector(".board");
  board.addEventListener("click", (e) => {
    const tileContainer = e.target.closest("div");
    const tile = tileContainer.querySelector("p").textContent;
    updateTiles(tile, tilesOnBoard, playerTiles);
    removeFocus(board, playerTiles);
    renderBoard(tilesOnBoard, playerTiles);
  });
};
