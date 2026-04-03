import { setupHotelSection } from "./bank_setup.js";
import { addListenerToBoard } from "./board_events.js";
import { renderBoard, renderUserSection } from "./ui_renderers.js";
import { highlightPlayableTiles } from "./utils.js";

const createTileElement = (tile) => {
  const tileContainer = document.createElement("div");
  tileContainer.classList.add("tile");
  tileContainer.id = `tile-${tile}`;
  const p = document.createElement("p");
  p.textContent = tile;
  tileContainer.append(p);
  return tileContainer;
};

export const createBoard = () => {
  const boardContainer = document.querySelector(".board");
  const string = "abcdefghi";
  for (let col = 0; col < string.length; col++) {
    for (let row = 1; row <= 12; row++) {
      const tileContainer = createTileElement(`${row}${string[col]}`);
      boardContainer.appendChild(tileContainer);
    }
  }
};

export const initializeGameSetup = (initialData) => {
  const { tilesOnBoard, player, hotels } = initialData;
  const board = document.querySelector(".board");
  highlightPlayableTiles(board, player.tiles);
  renderBoard(tilesOnBoard, hotels);
  renderUserSection(player);
  setupHotelSection(hotels);
  addListenerToBoard(player.tiles);
};
