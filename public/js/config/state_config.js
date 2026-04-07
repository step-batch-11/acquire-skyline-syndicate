import { addListenerToBoard } from "../board_events.js";
import { buildAHotel } from "../features/hotel_foundation.js";
import { handleShiftTurn } from "../handlers/event_handlers.js";
import { addHotelData, createConfirmButton } from "../ui_renderers.js";
import { highlightPlayableTiles } from "../utils.js";

const handlePlaceTile = (gameData) => {
  const { player } = gameData;
  highlightPlayableTiles(player.tiles);
  addListenerToBoard(player.tiles);
};

const handleBuyStocks = (gameData) => {
  const { hotels } = gameData;
  const bankSection = document.querySelector(".bank");
  const hotelCards = hotels.map((hotel) => addHotelData(hotel, true));

  bankSection.replaceChildren(...hotelCards);
  const buttonContainer = document.createElement("div");
  buttonContainer.classList.add("button-container");
  const confirmBtn = createConfirmButton(buttonContainer);

  bankSection.append(confirmBtn);
};

export const gameStates = {
  PLACE_TILE: handlePlaceTile,
  BUILD_HOTEL: buildAHotel,
  BUY_STOCK: handleBuyStocks,
  SHIFT_TURN: handleShiftTurn,
};

export const handleGameState = (gameData) => {
  const { state } = gameData;

  gameStates[state](gameData);
};
