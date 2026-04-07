import { updateTiles } from "../request.js";
import { removeFocus } from "../utils.js";
import { renderBoard } from "../ui_renderers.js";

export const TOTAL_SELECTED_STOCKS = [];

export const handleTilePlacement = async (
  board,
  tileContainer,
  tilesInPlayerHand,
) => {
  const tile = tileContainer.id.split("-")[1];

  const { tilesOnBoard, hotels } = await updateTiles(tile);

  removeFocus(board, tilesInPlayerHand);
  renderBoard(tilesOnBoard, hotels);
};

export const handleShiftTurn = async () => {
  await fetch("/shift-turn", { method: "post" });
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
