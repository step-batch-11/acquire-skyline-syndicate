import { assignNewTiles, updateTiles } from "../request.js";
import { renderGame } from "../initial_setup.js";
import { removeFocus } from "../utils.js";
import { renderBoard, renderTilesInHand } from "../ui_renderers.js";
import { gameStates } from "../config/state_config.js";

export const TOTAL_SELECTED_STOCKS = [];
const noOp = () => {};

export const handleTilePlacement = async (
  board,
  tileContainer,
  tilesInPlayerHand,
) => {
  const tile = tileContainer.id.split("-")[1];

  const { currentPlayer, tilesOnBoard, hotels, state } = await updateTiles(
    tile,
  );

  removeFocus(board, tilesInPlayerHand);
  renderBoard(tilesOnBoard, hotels);
  renderTilesInHand(currentPlayer.tiles);
  const action = gameStates[state] || noOp;
  action(tileContainer);
};

export const handleShiftTurn = async () => {
  const currentState = await fetch("/shift-turn", { method: "post" });
  const data = await currentState.json();
  renderGame(data);
};

export const handleAssignTile = async () => {
  const currentState = await assignNewTiles();
  renderTilesInHand(currentState.currentPlayer.tiles);
  handleShiftTurn();
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
  incr: incrementStocks,
  decr: decrementStocks,
};

export const handleCartUpdation = (action, parent) => {
  if (action in clickActions) {
    const cartElement = parent.querySelector(".cart-value");
    const counterValue = Number(cartElement.value);

    clickActions[action](cartElement, counterValue);
  }
};
