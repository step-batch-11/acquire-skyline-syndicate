import { renderPlayers } from "./players_sections.js";
import {
  renderBankSection,
  renderBoard as renderBoardState,
  renderUserSection,
} from "./ui_renderers.js";

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
  const board = document.querySelector(".board");
  const string = "abcdefghi";
  const cells = [];
  for (let col = 0; col < string.length; col++) {
    for (let row = 1; row <= 12; row++) {
      const tileContainer = createTileElement(`${row}${string[col]}`);
      cells.push(tileContainer);
    }
  }

  board.replaceChildren(...cells);
};

export const renderGame = (gameData) => {
  const { tilesOnBoard, currentPlayer, hotels, players } = gameData;
  createBoard();
  renderBoardState(tilesOnBoard, hotels);
  renderPlayers(players, currentPlayer);
  renderUserSection(currentPlayer);
  renderBankSection(hotels);
};
