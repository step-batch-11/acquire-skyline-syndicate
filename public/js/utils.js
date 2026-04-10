export const highlightPlayableTiles = (playerTiles) => {
  const board = document.querySelector(".board");
  playerTiles.forEach((tile) => {
    if (tile.isPlayable) {
      const tileContainer = board.querySelector(`#tile-${tile.id}`);
      tileContainer.classList.add("tiles-in-player-hand");
    }
  });
};

export const removeFocus = (board, playerTiles) => {
  playerTiles.forEach((tile) => {
    const tileContainer = board.querySelector(`#tile-${tile}`);
    tileContainer.classList.remove("tiles-in-player-hand");
  });
};

export const extractSelectedStocks = (cart, hotel) => {
  const selectedStocks = parseInt(
    hotel.querySelector(".cart-value").value,
  );
  const hotelName = hotel.id;
  if (selectedStocks > 0) {
    cart.push({ hotelName: hotelName.toLowerCase(), selectedStocks });
  }
  return cart;
};
