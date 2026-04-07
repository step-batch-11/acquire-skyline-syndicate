import { listenerForCart } from "./handlers/hotel_selection_handler.js";
import { renderBankSection } from "./ui_renderers.js";

export const renderHotelSection = (hotels) => {
  renderBankSection(hotels);
  const bank = document.querySelector(".bank");
  bank.addEventListener("click", listenerForCart);
};
