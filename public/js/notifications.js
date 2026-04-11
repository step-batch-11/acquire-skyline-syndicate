const getDeadNotificationMessage = ({ removedTiles, newTiles }) =>
  `These ${removedTiles} are exchaged with ${newTiles}`;

const getStocksPurchaseNotification = ({ cart, playerName }) =>
  cart.reduce(
    (msg, details) =>
      msg += `${details.selectedStocks} shares of ${details.hotelName} \n\t`,
    `${playerName} purchased `,
  );

const getInsufficientFundsNotification = ({ _hasEnoughBalance }) =>
  "Insufficient Balance !!";

const getMergerBonusNotification = (data) =>
  data.reduce(
    (
      msg,
      details,
    ) => (msg +=
      `${details.type} bonus: ${details.name} ->$${details.amount}\n\t`),
    `Bonus Allocation \n `,
  );

const getMessage = ({ type, data }) => {
  const notificationMapper = {
    DEAD_TILE_EXCHANGE: getDeadNotificationMessage,
    BUYING_STOCKS: getStocksPurchaseNotification,
    INSUFFICIENT_FUNDS: getInsufficientFundsNotification,
    MERGER_BONUS: getMergerBonusNotification,
  };
  return notificationMapper[type](data);
};

export const updateNotification = (notification) => {
  if (Object.keys(notification).length === 0) return;
  const notificationBox = document.querySelector(".notification-box");
  notificationBox.classList.add("notification-container");
  // notificationBox.classList.remove(".hidden");
  setTimeout(() => {
    notificationBox.classList.remove("notification-container");
    notificationBox.textContent = "";
  }, 3000);
  const message = getMessage(notification);
  notificationBox.textContent = message;
};
