import { handleClickActions } from "./handlers.js";
import { renderBankSection } from "./render.js";

export const renderHotelsSection = (hotels) => {
  renderBankSection(hotels);
  const bank = document.querySelector(".bank");
  bank.addEventListener("click", handleClickActions);
};
