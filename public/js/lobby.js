import { LOBBY_STATES, TIMES } from "../config.js";
import { addListenerToCopyBtn, addListenerToStartBtn } from "./listeners.js";
import { renderLobby, renderStartBtn } from "./lobby_setup.js";
import { getLobbyDetails } from "./request.js";
const { READY, STARTED } = LOBBY_STATES;

const { PING, START_TIMER } = TIMES;
globalThis.onload = () => {
  const startBtn = document.getElementById("start-button-container");
  addListenerToStartBtn(startBtn);
  const copyBtn = document.getElementById("copyBtn");
  addListenerToCopyBtn(copyBtn);

  const id = setInterval(async () => {
    const { state, lobbyDetails } = await getLobbyDetails();
    renderLobby(state, lobbyDetails);
    if (state === READY) {
      renderStartBtn();
    }

    if (state === STARTED) {
      setTimeout(async () => {
        const response = await fetch("/game/join-game");
        globalThis.location.href = response.url;
      }, START_TIMER);
      clearInterval(id);
    }
  }, PING);
};
