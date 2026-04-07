export const cloneElement = (templateId) => {
  const template = document.querySelector(templateId);
  return template.content.querySelector("*").cloneNode(true);
};

const renderBuffer = (state) => {
  const bufferContainer = document.querySelector("#buffer-container");
  const bufferTemplateId = state === "waiting"
    ? "#waiting-icon-template"
    : "#starting-icon-template";

  const element = cloneElement(bufferTemplateId);
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
