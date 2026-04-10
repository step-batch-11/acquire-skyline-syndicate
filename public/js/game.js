import { handleGameState } from "./config/state_config.js";
import { renderGame } from "./initial_setup.js";
import { updateNotification } from "./notifications.js";
import { gameState } from "./request.js";

let currentState;

const polling = () => {
  const intervalId = setInterval(async () => {
    const gameData = await gameState();
    if (gameData.state === "END_GAME") {
      clearInterval(intervalId);
      handleGameState(gameData);
      return;
    }
    updateNotification(gameData.notification);
    if (currentState !== gameData.state) {
      renderGame(gameData);
      if (gameData.isActivePlayer) {
        handleGameState(gameData);
      }
    }

    currentState = gameData.state;
  }, 500);
};

globalThis.onload = async () => {
  const gameData = await gameState();
  currentState = gameData.state;
  renderGame(gameData);
  updateNotification(gameData.notification);
  if (gameData.isActivePlayer) {
    handleGameState(gameData);
  }

  polling();
};
