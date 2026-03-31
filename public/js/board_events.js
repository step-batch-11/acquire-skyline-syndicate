import { removeFocus } from "./board_ui.js";
import { renderBoard } from "./initial_setup.js";
import { assignNewTiles, updateTiles } from "./game_state.js";

const buildAHotel = () => {
  alert("build hotel");
  const bankContainer = document.querySelector(".bank");

  bankContainer.addEventListener("click", (e) => {
    e.preventDefault();
  });
};

const eventsForPlacingATile = {
  "building hotel": buildAHotel,
  nothing: () => {},
};

export const addListenerToBoard = (tilesInPlayerHand) => {
  const board = document.querySelector(".board");
  board.addEventListener("click", async (event) => {
    const tileContainer = event.target.closest("div");
    const tile = tileContainer.querySelector("p").textContent;
    removeFocus(board, tilesInPlayerHand);
    const updatedTiles = await updateTiles(tile);
    renderBoard(updatedTiles.tilesOnBoard, updatedTiles.playerTiles);
    eventsForPlacingATile[updatedTiles.actionForPlacingTile](tile);

    const { playerTiles, tilesOnBoard } = await assignNewTiles(tile);
    renderBoard(tilesOnBoard, playerTiles);
  });
};
