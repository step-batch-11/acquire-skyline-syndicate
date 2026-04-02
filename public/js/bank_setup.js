import { cartListener } from "./handlers.js";
import { renderBankSection } from "./render.js";

export const setupHotelSection = (hotels) => {
  renderBankSection(hotels);
  const bank = document.querySelector(".bank");
  bank.addEventListener("click", cartListener);
};
