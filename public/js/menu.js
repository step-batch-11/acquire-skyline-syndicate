import { cloneElement } from "./lobby_setup.js";
import { getData } from "./request.js";

globalThis.onload = async () => {
  const { playerName } = await getData("/menu/get-player-name");
  const container = document.querySelector("#player-name-container");
  const element = cloneElement("#player-name-template");
  element.textContent = playerName;
  container.append(element);
};
