import { renderBoard } from "./initial_setup.js";
import { assignNewTiles, updateTiles } from "./game_state.js";
import { postData } from "./controllers.js";
import { removeFocus } from "./board_ui.js";

const buildAHotel = (tileContainer) => {
  alert("build hotel");
  const bankContainer = document.querySelector(".bank");
  let hotel = "";
  const selectHotel = (e) => {
    e.preventDefault();
    if (e.target.id === "confirm") {
      postData("/build-hotel", { hotel });
      tileContainer.classList.add(`${hotel}-icon`);
      return bankContainer.removeEventListener("click", selectHotel);
    }
    hotel = e.target.parentNode.id;
  };
  bankContainer.addEventListener("click", selectHotel);
};

const eventsForPlacingATile = {
  "build hotel": buildAHotel,
  nothing: () => {},
};

export const addListenerToBoard = (tilesInPlayerHand) => {
  const board = document.querySelector(".board");
  board.addEventListener("click", async (e) => {
    const tileContainer = e.target.closest("div");
    const tile = tileContainer.querySelector("p").textContent;
    removeFocus(board, tilesInPlayerHand);
    const updatedTiles = await updateTiles(tile);
    renderBoard(updatedTiles.tilesOnBoard, updatedTiles.updatedPlayerTiles);

    eventsForPlacingATile[updatedTiles.action](tileContainer);

    const { playerTiles, tilesOnBoard } = await assignNewTiles(tile);
    renderBoard(tilesOnBoard, playerTiles);
  });
};
