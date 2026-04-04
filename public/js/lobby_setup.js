const cloneElement = (templateId) => {
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

export const renderLobby = (state, activePlayers) => {
  renderBuffer(state);
  renderNames(activePlayers);
};
