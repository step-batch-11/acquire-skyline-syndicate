export const removeFocus = (board, playerTiles) => {
  playerTiles.forEach((tile) => {
    const tileContainer = board.querySelector(`#tile-${tile}`);
    tileContainer.classList.remove("tiles-in-player-hand");
  });
};
