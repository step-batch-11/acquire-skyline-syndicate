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

  const allHotels = document.querySelectorAll(".hotel-container");
  const inactiveHotels = Array.from(allHotels).forEach((hotel) => {
    if (!hotel.classList.contains("dim")) hotel.classList.add("inactive");
  });

  console.log(inactiveHotels);

  let hotelToFound = "";

  foundBtn.addEventListener(
    "click",
    (e) =>
      listenerForFoundingHotel(e, hotelToFound, tileContainer, bankContainer),
  );

  bankContainer.addEventListener("click", (e) => {
    hotelToFound = listenerForHotelSelection(e);
  });
};

const expandHotel = (_tileContainer) => {
  alert("hotel expanded");
};

export const turnActions = {
  EXPAND_HOTEL: expandHotel,
  BUILD_HOTEL: buildAHotel,
  NO_ACTION: () => "",
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
