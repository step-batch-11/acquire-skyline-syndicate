import { handleGameState } from "./config/state_config.js";
import { renderGame } from "./initial_setup.js";
import { gameState } from "./request.js";

const polling = () => {
  setInterval(async () => {
    const gameData = await gameState();
    renderGame(gameData);
    handleGameState(gameData);
  }, 2000);
};

globalThis.onload = async () => {
  const gameData = await gameState();
  renderGame(gameData);
  handleGameState(gameData);

  polling();
};
