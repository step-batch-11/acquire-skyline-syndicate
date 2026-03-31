import { postData } from "./controllers.js";
import { handleAssignTile, handlePlacingTile } from "./event_handlers.js";

export const buildAHotel = (tileContainer) => {
  alert("build hotel");
  const bankContainer = document.querySelector(".bank");
  let hotel = "";
  const selectHotel = (e) => {
    e.preventDefault();
    if (e.target.id === "confirm") {
      postData("/build-hotel", { hotel });
      tileContainer.classList.add(`${hotel}-icon`);
      bankContainer.removeEventListener("click", selectHotel);
      handleAssignTile();
    }
    hotel = event.target.parentNode.id;
  };
  bankContainer.addEventListener("click", selectHotel);
};

export const eventsForPlacingATile = {
  "build hotel": buildAHotel,
  nothing: () => "",
};

export const addListenerToBoard = (tilesInPlayerHand) => {
  const board = document.querySelector(".board");

  const listener = (event) => {
    const tileContainer = event.target.closest("div");
    handlePlacingTile(board, tileContainer, tilesInPlayerHand);
    board.removeEventListener("click", listener);
  };

  board.addEventListener("click", listener);
};
