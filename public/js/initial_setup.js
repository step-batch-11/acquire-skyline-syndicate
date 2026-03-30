const fetch = () => {
  const response = {
    initialTilesOnBoard: ["1a", "5i", "9h", "12d", "10a", "2h"],
    initialAmount: 6000,
    playerTiles: ["2e", "8i", "3g", "10b", "9c", "11e"],
  };

  return response;
};

const focusPlayerTiles = (board, playerTiles) => {
  playerTiles.forEach((tile) => {
    const tileContainer = board.querySelector(`#tile-${tile}`);
    tileContainer.classList.add("tiles-in-player-hand");
  });
};

const renderBoard = (tiles, playerTiles) => {
  const board = document.querySelector(".board");
  focusPlayerTiles(board, playerTiles);
  tiles.forEach((tile) => {
    const tileContainer = board.querySelector(`#tile-${tile}`);
    tileContainer.classList.add("tiles-in-market");
  });
};

const putInitialAmount = (amount) => {
  const amountContainer = document.querySelector(".amount-container p");
  amountContainer.innerText = `₹${amount}`;
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

const displayPlayerTiles = (tiles) => {
  const tilesContainer = document.querySelector(".tiles");
  const playerTiles = tiles.map(createTileElement);
  tilesContainer.append(...playerTiles);
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

export const initialBoardSetup = () => {
  const { initialTilesOnBoard, initialAmount, playerTiles } = fetch();
  renderBoard(initialTilesOnBoard, playerTiles);
  putInitialAmount(initialAmount);
  displayPlayerTiles(playerTiles);
};
