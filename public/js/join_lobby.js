import { addListenerToJoinLobbyForm } from "./listeners.js";

globalThis.onload = () => {
  const form = document.querySelector("form");
  addListenerToJoinLobbyForm(form);
};
