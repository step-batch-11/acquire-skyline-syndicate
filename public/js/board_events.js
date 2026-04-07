import { handleTilePlacement } from "./handlers/event_handlers.js";
import { canPlaceTile } from "./validators.js";

const tileSelectionListener = (e, tilesInPlayerHand) => {
  const tileContainer = e.target.closest("div");
  const board = document.querySelector(".board");
  if (canPlaceTile(tileContainer, tilesInPlayerHand)) {
    handleTilePlacement(board, tileContainer, tilesInPlayerHand);
    board.removeEventListener("click", tileSelectionListener);
  }
};

export const addListenerToBoard = (tilesInPlayerHand) => {
  const board = document.querySelector(".board");
  board.addEventListener(
    "click",
    (e) => tileSelectionListener(e, tilesInPlayerHand),
  );
};
