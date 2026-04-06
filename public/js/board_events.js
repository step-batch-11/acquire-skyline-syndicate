import { handleTilePlacement } from "./handlers/event_handlers.js";
import { canPlaceTile } from "./validators.js";

export const addListenerToBoard = (tilesInPlayerHand) => {
  const board = document.querySelector(".board");

  const tileSelectionListener = (event) => {
    const tileContainer = event.target.closest("div");
    if (canPlaceTile(tileContainer, tilesInPlayerHand)) {
      handleTilePlacement(board, tileContainer, tilesInPlayerHand);
      board.removeEventListener("click", tileSelectionListener);
    }
  };

  board.addEventListener("click", tileSelectionListener);
};
