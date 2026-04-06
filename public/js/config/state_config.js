import { addListenerToBoard } from "../board_events.js";
import { highlightPlayableTiles } from "../utils.js";

const handlePlaceTile = (gameData) => {
  const { currentPlayer } = gameData;
  highlightPlayableTiles(currentPlayer.tiles);
  addListenerToBoard(currentPlayer.tiles);
};

const gameStates = {
  "PLACE_TILE": handlePlaceTile,
};

export const handleGameState = (gameData) => {
  const { state } = gameData;

  gameStates[state](gameData);
};
