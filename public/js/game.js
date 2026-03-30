import { initBank } from "./bank_setup.js";
import { createBoard, initialBoardSetup } from "./initial_setup.js";
import { fetchData } from "./controllers.js";

globalThis.onload = async () => {
  const initialData = await fetchData();
  createBoard();
  initialBoardSetup(initialData);
  initBank(initialData.bankData);
};
