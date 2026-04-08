import { LOBBY_STATES } from "../config.js";

const { WAITING, READY } = LOBBY_STATES;

export const cloneElement = (templateId) => {
  const template = document.querySelector(templateId);
  return template.content.querySelector("*").cloneNode(true);
};

const renderBuffer = (state) => {
  const bufferContainer = document.querySelector("#buffer-container");
  const bufferTemplateId = [WAITING, READY].includes(state)
    ? "#waiting-icon-template"
    : "#starting-icon-template";

  const element = cloneElement(bufferTemplateId);
  if (state === READY) {
    const h3 = element.querySelector("h3")
    h3.textContent ="";
    h3.textContent = "START THE GAME OR WAIT FOR OTHER PLAYERS TO JOIN"
  }
  bufferContainer.innerHTML = "";
  bufferContainer.appendChild(element);
};
const renderNames = (activePlayers) => {
  const listContainer = document.querySelector("#players-list");

  const elementsList = activePlayers.map((player) => {
    const element = cloneElement("#name-display-template");
    element.querySelector("#name").textContent = player;
    return element;
  });
  listContainer.innerHTML = "";
  listContainer.append(...elementsList);
};

const renderLobbyId = (lobbyId) => {
  const idContainer = document.querySelector("#lobby-id-container");

  const element = cloneElement("#lobby-id-template");
  idContainer.innerHTML = "";
  element.textContent = lobbyId;
  idContainer.append(element);
};

export const renderStartBtn = () => {
  const startBtnContainer = document.querySelector("#start-button-container");

  const element = cloneElement("#start-btn-template");
  startBtnContainer.innerHTML = "";
  startBtnContainer.append(element);
};

export const renderLobby = (state, lobbyDetails) => {
  renderBuffer(state);
  renderNames(lobbyDetails.playerNames);
  renderLobbyId(lobbyDetails.lobbyId);
};

export const renderLobbyMsg = (msg) => {
  const lobbyStatusContainer = document.querySelector(
    "#lobby-status-container",
  );
  const element = cloneElement("#lobby-status-template");
  lobbyStatusContainer.innerHTML = "";
  element.textContent = msg;
  lobbyStatusContainer.append(element);
};
