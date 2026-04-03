import { turnActions } from "./board_events.js";
import { assignNewTiles, updateTiles } from "./game_state.js";
import { renderBoard, renderTilesInHand } from "./ui_renderers.js";
import { removeFocus } from "./utils.js";

const noOp = () => {};

export const handleTilePlacement = async (
  board,
  tileContainer,
  tilesInPlayerHand,
) => {
  const tile = tileContainer.id.split("-")[1];

  const { player, tilesOnBoard, hotels, state } = await updateTiles(tile);
  removeFocus(board, tilesInPlayerHand);
  renderBoard(tilesOnBoard, hotels);
  renderTilesInHand(player.tiles);
  const action = turnActions[state] || noOp;
  action(tileContainer);
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
