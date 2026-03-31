import { handleAssignTile, handlePlacingTile } from "./event_handlers.js";

const buildAHotel = () => {
  alert("build hotel");
  const bankContainer = document.querySelector(".bank");

  bankContainer.addEventListener("click", (e) => {
    e.preventDefault();
  });
};

const eventsForPlacingATile = {
  "building hotel": buildAHotel,
  nothing: () => "",
};

export const addListenerToBoard = (tilesInPlayerHand) => {
  const board = document.querySelector(".board");
  board.addEventListener("click", (event) => {
    const tileContainer = event.target.closest("div");
    handlePlacingTile(board, tileContainer, tilesInPlayerHand);
    eventsForPlacingATile[updatedTiles.actionForPlacingTile](tile);
    handleAssignTile(tile);
  });
};
