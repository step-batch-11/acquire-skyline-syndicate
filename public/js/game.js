const fetch = () => {
  const response = {
    initialTilesOnBoard: ["1a", "5i", "9h", "12d", "10a", "2h"],
    initialAmount: 6000,
    userTiles: ["2e", "8i", "3g", "10b", "9c", "11e"],
  };

  return response;
};

const highlightInitTiles = (tiles) => {
  const board = document.querySelector(".board");
  tiles.forEach((tile) => {
    const tileToHighlight = board.querySelector(`#tile-${tile}`);
    tileToHighlight.classList.add("tiles-in-market");
  });
};

const initialBoardSetup = () => {
  const { initialTilesOnBoard } = fetch();
  highlightInitTiles(initialTilesOnBoard);
};

globalThis.onload = () => {
  initialBoardSetup();
};
