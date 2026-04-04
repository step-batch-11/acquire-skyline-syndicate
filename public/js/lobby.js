import { createBoard, initializeGameSetup } from "./initial_setup.js";
import { renderLobby } from "./lobby_setup.js";
import { listActivePlayers, startGame } from "./request.js";

globalThis.onload = async () => {
  const id = setInterval(async () => {
    const response = await fetch("/lobby/state");
    const { state } = await response.json();
    const activePlayers = await listActivePlayers();
    renderLobby(state, activePlayers);
    if (state === "ready") {
      clearInterval(id);

      setTimeout(async () => {
        const response = await fetch("/pages/game.html");
        globalThis.location.href = await response.url;
      }, 2000);
    }
  }, 1000);

  const initialData = await startGame();
  createBoard();
  initializeGameSetup(initialData);
};
