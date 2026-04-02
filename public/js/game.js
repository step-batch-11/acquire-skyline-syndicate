import { createBoard, initialiseGameSetup } from "./initial_setup.js";
import { fetchData } from "./request.js";

globalThis.onload = async () => {
  createBoard();
  const initialData = await fetchData("/initial-setup");
  initialiseGameSetup(initialData);
};
