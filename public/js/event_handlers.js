import { eventsForPlacingATile } from "./board_events.js";
import { assignNewTiles, updateTiles } from "./game_state.js";
import { renderBoard, renderTilesInHand } from "./ui_renderers.js";
import { removeFocus } from "./utils.js";

export const handleTilePlacement = async (
  board,
  tileContainer,
  tilesInPlayerHand,
) => {
  const tile = tileContainer.id.split("-")[1];

  const { tilesOnBoard, playerTiles, action } = await updateTiles(tile);
  removeFocus(board, tilesInPlayerHand);
  renderBoard(tilesOnBoard);
  renderTilesInHand(playerTiles);
  eventsForPlacingATile[action](tileContainer);
};

export const handleAssignTile = async () => {
  const { playerTiles, tilesOnBoard } = await assignNewTiles();
  renderBoard(tilesOnBoard);
  renderTilesInHand(playerTiles);
};

const incrementStocks = (parent) => {
  const counter = parent.querySelector("span");
  const counterValue = parseInt(counter.innerText);
  counter.textContent = counterValue + 1;
};

const decrementStocks = (parent) => {
  const counter = parent.querySelector("span");
  const counterValue = parseInt(counter.innerText);
  counter.textContent = counterValue - 1;
};

const clickActions = {
  "incr": incrementStocks,
  "decr": decrementStocks,
};

export const handleCartUpdation = (action, parent) => {
  if (action in clickActions) {
    clickActions[action](parent);
  }
};

