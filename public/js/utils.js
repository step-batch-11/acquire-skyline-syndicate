export const highlightPlayableTiles = (board, playerTiles) => {
  playerTiles.forEach((tile) => {
    const tileContainer = board.querySelector(`#tile-${tile}`);
    tileContainer.classList.add("tiles-in-player-hand");
  });
};

export const removeFocus = (board, playerTiles) => {
  playerTiles.forEach((tile) => {
    const tileContainer = board.querySelector(`#tile-${tile}`);
    tileContainer.classList.remove("tiles-in-player-hand");
  });
};

export const extractSelectedStocks = (cart, hotelHeader) => {
  const selectedStocks = parseInt(
    hotelHeader.querySelector(".cart-value").innerText,
  );
  const hotelName = hotelHeader.querySelector(".hotel-name").innerText;
  if (selectedStocks > 0) {
    cart.push({ hotelName, selectedStocks });
  }
  return cart;
};
