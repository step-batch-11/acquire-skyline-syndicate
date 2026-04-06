import { renderLobby } from "./lobby_setup.js";
import { getLobbyDetails, getLobbyState } from "./request.js";

globalThis.onload = () => {
  const id = setInterval(async () => {
    const { state } = await getLobbyState();
    const lobbyDetails = await getLobbyDetails();
    renderLobby(state, lobbyDetails);
    if (state === "ready") {
      clearInterval(id);

      setTimeout(async () => {
        const response = await fetch("/lobby/create-game");
        globalThis.location.href = await response.url;
      }, 3000);
    }
  }, 1000);
};
