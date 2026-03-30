import { addListener } from "./board_events.js";

const focusPlayerTiles = (board, playerTiles) => {
  playerTiles.forEach((tile) => {
    const tileContainer = board.querySelector(`#tile-${tile}`);
    tileContainer.classList.add("tiles-in-player-hand");
  });
};

export const renderBoard = (tilesOnBoard, playerTiles) => {
  const board = document.querySelector(".board");
  focusPlayerTiles(board, playerTiles);
  tilesOnBoard.forEach((tile) => {
    const tileContainer = board.querySelector(`#tile-${tile}`);
    tileContainer.classList.add("tiles-in-market");
  });
  renderPlayerTiles(playerTiles);
};

const putInitialAmount = (amount) => {
  const amountContainer = document.querySelector(".amount-container p");
  amountContainer.innerText = `$${amount}`;
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

const renderPlayerTiles = (playerTiles) => {
  const tilesContainer = document.querySelector(".tiles");
  const playerTileElements = playerTiles.map(createTileElement);
  tilesContainer.innerHTML = "";
  tilesContainer.append(...playerTileElements);
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

export const initialBoardSetup = (initialData) => {
  const { tilesOnBoard, amount, playerTiles } = initialData;
  renderBoard(tilesOnBoard, playerTiles);
  putInitialAmount(amount);
  addListener();
};
