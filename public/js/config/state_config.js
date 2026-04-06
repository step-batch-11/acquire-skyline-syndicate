import { addListenerToBoard } from "../board_events.js";
import { expandHotel } from "../features/expand_hotel.js";
import { buildAHotel } from "../features/hotel_foundation.js";
import { highlightPlayableTiles } from "../utils.js";

const handlePlaceTile = (gameData) => {
  const { currentPlayer } = gameData;
  highlightPlayableTiles(currentPlayer.tiles);
  addListenerToBoard(currentPlayer.tiles);
};

const handleBuyStocks = (_gameData) => {
  console.log("buy the stocks");
};

const handleBuildHotel = (gameData) => {
  handlePlaceTile(gameData);
  buildAHotel();
};

export const gameStates = {
  "PLACE_TILE": handlePlaceTile,
  "BUILD_HOTEL": handleBuildHotel,
  "EXPAND_HOTEL": expandHotel,
  "BUY_STOCK": handleBuyStocks,
};

export const handleGameState = (gameData) => {
  const { state } = gameData;
  console.log({ state });

  gameStates[state](gameData);
};
