import { renderBoard } from "./initial_setup.js";
import { updateTiles } from "./game_state.js";
import { removeFocus } from "./board_ui.js";

const buildAHotel = () => {
  alert("build hotel");
  const bankContainer = document.querySelector(".bank");

  bankContainer.addEventListener("click", (e) => {
    e.preventDefault();
    console.log(e.target.parentNode);
  });
};

const eventsForPlacingATile = {
  "building hotel": buildAHotel,
  nothing: () => {},
};

export const addListenerToBoard = (playerTiles) => {
  const board = document.querySelector(".board");
  board.addEventListener("click", async (e) => {
    const tileContainer = e.target.closest("div");
    const tile = tileContainer.querySelector("p").textContent;
    removeFocus(board, playerTiles);
    const { updatedPlayerTiles, tilesOnBoard } = await updateTiles(tile);

    renderBoard(tilesOnBoard, updatedPlayerTiles);
    eventsForPlacingATile[actionForPlacingTile](tile);
  });
};
