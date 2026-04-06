import { gameState } from "../request.js";
import { renderBankSection } from "../ui_renderers.js";

export const expandHotel = async (_tileContainer) => {
  const { hotels } = await gameState();
  renderBankSection(hotels);
};
