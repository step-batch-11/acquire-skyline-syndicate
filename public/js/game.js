import { handleGameState } from "./config/state_config.js";
import { renderGame } from "./initial_setup.js";
import { gameState } from "./request.js";

globalThis.onload = async () => {
  const gameData = await gameState();

  renderGame(gameData);
  handleGameState(gameData);
};
