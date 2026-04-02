import { setupHotelSection } from "./bank_setup.js";
import { addListenerToBoard } from "./board_events.js";
import { renderUserSection } from "./render.js";

const highlightPlayableTiles = (board, playerTiles) => {
  playerTiles.forEach((tile) => {
    const tileContainer = board.querySelector(`#tile-${tile}`);
    tileContainer.classList.add("tiles-in-player-hand");
  });
};

export const renderBoard = (tilesOnBoard) => {
  const board = document.querySelector(".board");
  tilesOnBoard.forEach((tile) => {
    const tileContainer = board.querySelector(`#tile-${tile}`);
    tileContainer.classList.add("tiles-in-market");
  });
};

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

export const initialiseGameSetup = (initialData) => {
  const { tilesOnBoard, amount, bankData, playerTiles } = initialData;
  const board = document.querySelector(".board");
  highlightPlayableTiles(board, playerTiles);
  renderBoard(tilesOnBoard, playerTiles);
  renderUserSection({ amount, playerTiles });
  setupHotelSection(bankData);
  addListenerToBoard(playerTiles);
};
