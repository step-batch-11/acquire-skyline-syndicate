import { lobbyStates, times } from "../config.js";
import { addListenerToCopyBtn, addListenerToStartBtn } from "./listeners.js";
import { renderLobby, renderStartBtn } from "./lobby_setup.js";
import { getLobbyDetails } from "./request.js";
const { READY, STARTED } = lobbyStates;

const { ping, startTimer } = times;
globalThis.onload = () => {
  const startBtn = document.getElementById("start-button-container");
  addListenerToStartBtn(startBtn);
  const copyBtn = document.getElementById("copyBtn");
  addListenerToCopyBtn(copyBtn);

  const id = setInterval(async () => {
    // const { state } = await getLobbyState();
    const { state, lobbyDetails } = await getLobbyDetails();
    renderLobby(state, lobbyDetails);
    if (state === READY) {
      renderStartBtn();
    }

    if (state === STARTED) {
      setTimeout(async () => {
        const response = await fetch("/game");
        globalThis.location.href = response.url;
      }, startTimer);
      clearInterval(id);
    }
  }, ping);
};
