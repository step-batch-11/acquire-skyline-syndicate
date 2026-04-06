import { handleTilePlacement } from "./event_handlers.js";
import { canPlaceTile } from "./validators.js";
import {
  listenerForFoundingHotel,
  listenerForHotelSelection,
} from "./listeners.js";
import { renderBankSection } from "./ui_renderers.js";
import { gameState } from "./request.js";

export const buildAHotel = (tileContainer) => {
  alert("build hotel");
  const bankContainer = document.querySelector(".bank");
  const foundBtn = bankContainer.querySelector("#found");
  foundBtn.classList.remove("hidden");

  const allHotels = document.querySelectorAll(".hotel-container");
  Array.from(allHotels).forEach((hotel) => {
    if (!hotel.classList.contains("dim")) hotel.classList.add("inactive");
  });

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

const expandHotel = async (_tileContainer) => {
  alert("hotel expanded");
  const { hotels } = await gameState();
  renderBankSection(hotels);
};

export const turnActions = {
  BUILD_HOTEL: buildAHotel,
  EXPAND_HOTEL: expandHotel,
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
