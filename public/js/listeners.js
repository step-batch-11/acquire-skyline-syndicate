import { handleAssignTile } from "./event_handlers.js";
import { handleCartUpdation } from "./event_handlers.js";
import { postData } from "./request.js";
import { renderBankSection, renderUserSection } from "./ui_renderers.js";
import { extractSelectedStocks } from "./utils.js";

export const listenerForCart = (e) => {
  const action = e.target.dataset.action;
  const parent = e.target.parentElement;
  handleCartUpdation(action, parent);
};

export const listenerForBuyingStocks = async (e) => {
  e.preventDefault();
  const listOfHotelHeader = document.querySelectorAll(".hotel-card-header");
  const cart = [...listOfHotelHeader].reduce(extractSelectedStocks, []);
  const { hotels, playerInfo } = await postData("/turn/buy-stocks", cart);
  renderBankSection(hotels);
  renderUserSection(playerInfo);
};

export const listenerForHotelSelection = (e) => {
  e.preventDefault();
  return event.target.parentNode.id;
};

export const listenerForFoundingHotel = (
  e,
  hotelToFound,
  tileContainer,
  bankContainer,
) => {
  e.preventDefault();
  postData("/turn/buildHotel", { hotelToFound });
  tileContainer.classList.add(`${hotelToFound}-icon`);
  bankContainer.removeEventListener("click", listenerForHotelSelection);
  handleAssignTile();
};
