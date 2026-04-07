import { handleGameState } from "./config/state_config.js";
import { renderGame } from "./initial_setup.js";
import { gameState } from "./request.js";

let currentState;

export const polling = () => {
  setInterval(async () => {
    const gameData = await gameState();
    if (currentState !== gameData.state) {
      renderGame(gameData);
      handleGameState(gameData);
    }

    currentState = gameData.state;
  }, 500);
};

globalThis.onload = async () => {
  const gameData = await gameState();
  console.log(gameData);

  currentState = gameData.state;

  renderGame(gameData);
  handleGameState(gameData);

  polling();
};
