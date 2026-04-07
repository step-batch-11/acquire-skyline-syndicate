import { addListenerToBoard } from "../board_events.js";
import { buildAHotel } from "../features/hotel_foundation.js";
import { handleShiftTurn } from "../handlers/event_handlers.js";
import { addHotelData, createConfirmButton } from "../ui_renderers.js";
import { highlightPlayableTiles } from "../utils.js";

const handlePlaceTile = (gameData) => {
  const { currentPlayer } = gameData;
  highlightPlayableTiles(currentPlayer.tiles);
  addListenerToBoard(currentPlayer.tiles);
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
  console.log({ gameData });
  const { state } = gameData;

  gameStates[state](gameData);
};
