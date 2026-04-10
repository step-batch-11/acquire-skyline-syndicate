const getMessage = (gameData) => {
  const { state, currentPlayer, isActivePlayer } = gameData;

  const activeMessages = {
    PLACE_TILE: "Your turn: Place a tile",
    BUILD_HOTEL: "Choose a hotel to found",
    BUY_STOCK: "Buy stocks (max 3)",
    SHIFT_TURN: "Ending turn...",
  };

  const inactiveMessages = {
    PLACE_TILE: (name) => `${name} is placing a tile`,
    BUILD_HOTEL: (name) => `${name} is founding a hotel`,
    BUY_STOCK: (name) => `${name} is buying stocks`,
    SHIFT_TURN: (name) => `${name} is ending turn`,
  };

  if (isActivePlayer) {
    return activeMessages[state] || "";
  }

  return inactiveMessages[state]?.(currentPlayer.name) || "";
};

export const updateNotification = (gameData) => {
  const notificationBox = document.querySelector(".notification-box");
  const message = getMessage(gameData);
  notificationBox.textContent = message;
};
