const fetchData = async () => {
  const response = await fetch("/initial-setup");
  return await response.json();
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

export const initialBoardSetup = async () => {
  const { tilesOnBoard, amount, playerTiles } = await fetchData();
  renderBoard(tilesOnBoard);
  putInitialAmount(amount);
  displayPlayerTiles(playerTiles);
};
