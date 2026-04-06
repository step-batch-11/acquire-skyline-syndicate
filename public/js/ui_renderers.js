import { listenerForBuyingStocks } from "./handlers/hotel_selection_handler.js";

const createTileElement = (tile) => {
  const tileContainer = document.createElement("div");
  tileContainer.classList.add("tile");
  tileContainer.id = `tile-${tile}`;
  const p = document.createElement("p");
  p.textContent = tile;
  tileContainer.append(p);
  return tileContainer;
};

const addColorToHotelTile = (tile, name) => {
  const tileElement = document.querySelector(`#tile-${tile.id}`);
  tileElement.classList.add(name);
};

const addColorToHotelTiles = (hotels) => {
  hotels.forEach((hotel) => {
    if (hotel.isActive) {
      hotel.tiles.forEach((tile) => addColorToHotelTile(tile, hotel.name));
      const tileElement = document.querySelector(
        `#tile-${hotel.originTile.id}`,
      );
      tileElement.classList.add(`board-${hotel.name}-icon`);
      tileElement.innerText = "";
    }
  });
};

export const renderBoard = (tilesOnBoard, hotelsOnBoard) => {
  const board = document.querySelector(".board");
  tilesOnBoard.forEach((tile) => {
    const tileContainer = board.querySelector(`#tile-${tile.id}`);
    tileContainer.classList.add("tiles-in-market");
  });

  addColorToHotelTiles(hotelsOnBoard);
};

export const renderTilesInHand = (playerTiles) => {
  const tilesContainer = document.querySelector(".tiles-in-hand");
  const playerTileElements = playerTiles.map(createTileElement);
  tilesContainer.innerHTML = "";
  tilesContainer.append(...playerTileElements);
};

const displayInitialAmount = (amount) => {
  const amountContainer = document.querySelector(".amount-container p");
  amountContainer.innerText = `$${amount}`;
};

const createBuilHotelsBtn = () => {
  const buttonContainer = document.createElement("div");
  buttonContainer.classList.add("button-container");
  const button = cloneElement("#button");
  button.textContent = "Build";
  button.id = "found";
  button.classList.add("hidden");
  buttonContainer.append(button);
  return buttonContainer;
};

const createBuyButton = () => {
  const buttonContainer = document.createElement("div");
  buttonContainer.classList.add("button-container");

  const button = cloneElement("#button");
  button.textContent = "confirm";
  button.addEventListener("click", listenerForBuyingStocks);
  buttonContainer.append(button);
  return buttonContainer;
};

const cloneElement = (templateId) => {
  const template = document.querySelector(templateId);
  return template.content.querySelector("*").cloneNode(true);
};

const addHotelData = ({ name, tiles, stocksLeft, stockPrice, isActive }) => {
  const hotelCard = cloneElement("#hotel-card");
  hotelCard.setAttribute("id", name);
  const hotelInfoContainer = hotelCard.querySelector(".hotel-info");
  hotelInfoContainer.classList.add(name);
  const hotelContainer = hotelCard.querySelector(".hotel-container");
  hotelContainer.classList.add(`${name}-icon`);

  if (isActive) {
    hotelContainer.classList.add("dim");
    const counter = hotelCard.querySelector(".counter");
    counter.classList.remove("hidden");
    hotelContainer.classList.add("active");
  }

  hotelCard.querySelector(".hotel-name").textContent = name;
  hotelCard.querySelector("#price").textContent = `$ ${stockPrice}`;
  hotelCard.querySelector("#tiles").textContent = `🧱 ${tiles.length}`;
  hotelCard.querySelector("#stock-left").textContent = `📈 ${stocksLeft}`;

  return hotelCard;
};

export const renderBankSection = (hotels) => {
  const bankSection = document.querySelector(".bank");
  const hotelCards = hotels.map(addHotelData);

  bankSection.replaceChildren(...hotelCards);
  const button = createBuilHotelsBtn();
  const buyButton = createBuyButton();
  bankSection.append(button);
  bankSection.append(buyButton);
};

const addDetailsToCard = (stockCard, name, count) => {
  stockCard.classList.add(name);
  stockCard.classList.remove("empty");
  stockCard.querySelector(".stock-name").textContent = name;
  stockCard.querySelector(".count").textContent = count;
};

const cloneStockCards = () => {
  return Array.from(
    { length: 7 },
    () => cloneElement("#stock-template"),
  );
};

export const renderHeldStocks = (stocks) => {
  const stocksSection = document.querySelector(".stocks");
  const stockCards = cloneStockCards();
  Object.entries(stocks).forEach(([name, count], index) =>
    addDetailsToCard(stockCards[index], name, count)
  );
  stocksSection.replaceChildren(...stockCards);
};

export const renderUserSection = ({ money, tiles, stocks }) => {
  renderTilesInHand(tiles);
  displayInitialAmount(money);
  renderHeldStocks(stocks);
};
