import { gameState, postData } from "../request.js";
import { extractSelectedStocks } from "../utils.js";
import { handleCartUpdation } from "./event_handlers.js";
import { renderBankSection, renderUserSection } from "../ui_renderers.js";
import { TOTAL_SELECTED_STOCKS } from "./event_handlers.js";

export const listenerForCart = (e) => {
  const action = e.target.dataset.action;
  const parent = e.target.parentElement;
  handleCartUpdation(action, parent);
};

export const listenerForBuyingStocks = async (e) => {
  e.preventDefault();
  const listOfHotelHeader = document.querySelectorAll(".hotel-card-header");
  const cart = [...listOfHotelHeader].reduce(extractSelectedStocks, []);
  await postData("/turn/buy-stocks", cart);
  const { hotels, player } = await gameState();
  TOTAL_SELECTED_STOCKS.length = 0;
  renderBankSection(hotels);
  renderUserSection(player);
};
