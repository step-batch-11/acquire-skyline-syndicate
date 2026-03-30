const fetch = () => {
  const response = {
    initialTilesOnBoard: ["1a", "5i", "9h", "12d", "10a", "2h"],
    initialAmount: 6000,
    userTiles: ["2e", "8i", "3g", "10b", "9c", "11e"],
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

const initialBoardSetup = () => {
  const { initialTilesOnBoard, initialAmount } = fetch();
  renderBoard(initialTilesOnBoard);
  putInitialAmount(initialAmount);
};

globalThis.onload = () => {
  initialBoardSetup();
};
