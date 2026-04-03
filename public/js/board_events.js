import { handleTilePlacement } from "./event_handlers.js";
import { canPlaceTile } from "./validators.js";
import {
  listenerForFoundingHotel,
  listenerForHotelSelection,
} from "./listeners.js";

export const buildAHotel = (tileContainer) => {
  alert("build hotel");
  const bankContainer = document.querySelector(".bank");
  const foundBtn = bankContainer.querySelector("#found");
  foundBtn.classList.remove("hidden");

  let hotelToFound = "";

  foundBtn.addEventListener("click", (e) =>
    listenerForFoundingHotel(e, hotelToFound, tileContainer, bankContainer),
  );

  bankContainer.addEventListener("click", (e) => {
    hotelToFound = listenerForHotelSelection(e);
  });
};

export const eventsForPlacingATile = {
  "build hotel": buildAHotel,
  nothing: () => "",
};

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
