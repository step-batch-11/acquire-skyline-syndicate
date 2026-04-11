import { postData } from "../request.js";
import { extractSelectedStocks } from "../utils.js";
import { handleCartUpdation } from "./event_handlers.js";
import { TOTAL_SELECTED_STOCKS } from "./event_handlers.js";
import { handleShiftTurn } from "./event_handlers.js";

export const listenerForCart = (e) => {
  const action = e.target.dataset.action;
  const parent = e.target.parentElement;
  handleCartUpdation(action, parent);
};

export const listenerForBuyingStocks = async (e) => {
  e.preventDefault();
  const listOfHotels = document.querySelectorAll(".hotel-stock");
  const cart = [...listOfHotels].reduce(extractSelectedStocks, []);
  await postData("/turn/buy-stocks", cart);
  document.querySelector(".context-menu").innerHTML = "";
  TOTAL_SELECTED_STOCKS.length = 0;
};

export const listenerForPassingTurn = (e) => {
  e.preventDefault();
  handleShiftTurn();
};
