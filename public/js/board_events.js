import { renderBoard } from "./initial_setup.js";
import { updateTiles } from "./game_state.js";
import { removeFocus } from "./board_ui.js";

export const addListener = () => {
  const board = document.querySelector(".board");
  board.addEventListener("click", async (e) => {
    const tileContainer = e.target.closest("div");
    const tile = tileContainer.querySelector("p").textContent;
    const { playerTiles, tilesOnBoard } = await updateTiles(tile);
    removeFocus(board, playerTiles);
    renderBoard(tilesOnBoard, playerTiles);
  });
};
