import { renderBoard } from "./initial_setup.js";
import { assignNewTiles, updateTiles } from "./game_state.js";
import { removeFocus } from "./board_ui.js";

export const addListenerToBoard = (tilesInPlayerHand) => {
  const board = document.querySelector(".board");
  board.addEventListener("click", async (e) => {
    const tileContainer = e.target.closest("div");
    const tile = tileContainer.querySelector("p").textContent;
    removeFocus(board, tilesInPlayerHand);
    const updatedTiles = await updateTiles(tile);
    renderBoard(updatedTiles.tilesOnBoard, updatedTiles.playerTiles);
    const { playerTiles, tilesOnBoard } = await assignNewTiles(tile);
    renderBoard(tilesOnBoard, playerTiles);
  });
};
