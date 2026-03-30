const fetch = () => {
  const response = {
    initialTilesOnBoard: ["1a", "5i", "9h", "12d", "10a", "2h"],
    initialAmount: 6000,
    playerTiles: ["2e", "8i", "3g", "10b", "9c", "11e"],
  };

  return response;
};

const renderBoard = (tiles) => {
  const board = document.querySelector(".board");
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

export const initialBoardSetup = () => {
  const { initialTilesOnBoard, initialAmount, playerTiles } = fetch();
  renderBoard(initialTilesOnBoard);
  putInitialAmount(initialAmount);
  displayPlayerTiles(playerTiles);
};
