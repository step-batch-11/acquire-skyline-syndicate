import { listenerForCart } from "./listeners.js";
import { renderBankSection } from "./ui_renderers.js";

export const setupHotelSection = (hotels) => {
  renderBankSection(hotels);
  const bank = document.querySelector(".bank");
  bank.addEventListener("click", listenerForCart);
};
