import { turnActions } from "./board_events.js";
import { assignNewTiles, updateTiles } from "./game_state.js";
import { renderBoard, renderTilesInHand } from "./ui_renderers.js";
import { removeFocus } from "./utils.js";

const TOTAL_SELECTED_STOCKS = [];
const noOp = () => {};

export const handleTilePlacement = async (
  board,
  tileContainer,
  tilesInPlayerHand,
) => {
  const tile = tileContainer.id.split("-")[1];

  const updatedTiles = await updateTiles(tile);
  removeFocus(board, tilesInPlayerHand);
  renderBoard(updatedTiles.tilesOnBoard);
  renderTilesInHand(updatedTiles.playerTiles);
  const action = turnActions[updatedTiles.state] || noOp;
  action(tileContainer);
};

export const handleAssignTile = async () => {
  const { playerTiles, tilesOnBoard } = await assignNewTiles();
  renderBoard(tilesOnBoard);
  renderTilesInHand(playerTiles);
};

const incrementStocks = (cartElement, counterValue) => {
  if (counterValue < 3 && TOTAL_SELECTED_STOCKS.length < 3) {
    cartElement.textContent = counterValue + 1;
    cartElement.value = counterValue + 1;
    TOTAL_SELECTED_STOCKS.push(1);
  }
};

const decrementStocks = (cartElement, counterValue) => {
  if (counterValue > 0) {
    cartElement.textContent = counterValue - 1;
    cartElement.value = counterValue - 1;
    TOTAL_SELECTED_STOCKS.pop();
  }
};

const clickActions = {
  "incr": incrementStocks,
  "decr": decrementStocks,
};

export const handleCartUpdation = (action, parent) => {
  if (action in clickActions) {
    const cartElement = parent.querySelector(".cart-value");
    const counterValue = Number(cartElement.value);
    
    clickActions[action](cartElement, counterValue);
  }
};
