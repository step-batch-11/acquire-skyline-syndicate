import { renderLobby } from "./lobby_setup.js";
import { getLobbyState, listActivePlayers } from "./request.js";

globalThis.onload = () => {
  const id = setInterval(async () => {
    const { state } = await getLobbyState();
    const activePlayers = await listActivePlayers();
    renderLobby(state, activePlayers);
    if (state === "ready") {
      clearInterval(id);

      setTimeout(async () => {
        const response = await fetch("/lobby/createGame");
        globalThis.location.href = await response.url;
      }, 3000);
    }
  }, 1000);
};
