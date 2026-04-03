import { handleAssignTile } from "./event_handlers.js";
import { handleCartUpdation } from "./event_handlers.js";
import { postData } from "./request.js";
import { extractSelectedStocks } from "./utils.js";

export const listenerForCart = (e) => {
  const action = e.target.dataset.action;
  const parent = e.target.parentElement;
  handleCartUpdation(action, parent);
};

export const listenerForBuyingStocks = (e) => {
  e.preventDefault();
  const listOfHotelHeader = document.querySelectorAll(".hotel-card-header");
  const cart = [...listOfHotelHeader].reduce(extractSelectedStocks, []);
  return cart;
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
