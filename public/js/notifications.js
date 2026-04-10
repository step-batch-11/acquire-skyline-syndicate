const getDeadNotificationMessage = ({ removedTiles, newTiles }) =>
  `These ${removedTiles} are exchaged with ${newTiles}`;

const getStocksPurchaseNotification = ({ cart }) =>
  cart.reduce(
    (msg, details) =>
      msg += `${details.selectedStocks} of ${details.hotelName} \n\t`,
    `Player purchased `,
  );

const getInsufficientFundsNotification = ({ _hasEnoughBalance }) =>
  "check balance bro";

const getMessage = ({ type, data }) => {
  const notificationMapper = {
    "DEAD_TILE_EXCHANGE": getDeadNotificationMessage,
    "BUYING_STOCKS": getStocksPurchaseNotification,
    "INSUFFICIENT_FUNDS": getInsufficientFundsNotification,
  };
  return notificationMapper[type](data);
};

export const updateNotification = (notification) => {
  if (Object.keys(notification).length === 0) return;
  const notificationBox = document.querySelector(".notification-box");
  const message = getMessage(notification);
  notificationBox.textContent = message;
};
