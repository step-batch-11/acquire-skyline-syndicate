import { listenerForBuyingStocks } from "./listeners.js";

const createTileElement = (tile) => {
  const tileContainer = document.createElement("div");
  tileContainer.classList.add("tile");
  tileContainer.id = `tile-${tile}`;
  const p = document.createElement("p");
  p.textContent = tile;
  tileContainer.append(p);
  return tileContainer;
};

const addColorToHotelTile = (tileId, name) => {
  const tile = document.querySelector(`#tile-${tileId}`);
  tile.classList.add(name);
};

const addColorToHotelTiles = (hotels) => {
  hotels.forEach((hotel) => {
    if (hotel.tiles.length > 0) {
      hotel.tiles.forEach((tileId) => addColorToHotelTile(tileId, hotel.name));
    }
  });
};

export const renderBoard = (tilesOnBoard, hotels) => {
  const board = document.querySelector(".board");
  tilesOnBoard.forEach((tileId) => {
    const tileContainer = board.querySelector(`#tile-${tileId}`);
    tileContainer.classList.add("tiles-in-market");
  });

  addColorToHotelTiles(hotels);
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

const createTradeConfirmationBtn = () => {
  const buttonContainer = document.createElement("div");
  buttonContainer.classList.add("button-container");
  const button = cloneElement("#button");
  button.textContent = "Found";
  button.id = "found";
  button.classList.add("hidden");
  buttonContainer.append(button);
  return buttonContainer;
};

const createBuyButton = () => {
  const buttonContainer = document.createElement("div");
  buttonContainer.classList.add("button-container");

  const button = cloneElement("#button");
  button.textContent = "buy";
  button.addEventListener("click", listenerForBuyingStocks);
  buttonContainer.append(button);
  return buttonContainer;
};

const cloneElement = (templateId) => {
  const template = document.querySelector(templateId);
  return template.content.querySelector("*").cloneNode(true);
};

const addHotelData = ({ name, tiles, stocksLeft, stockPrice }) => {
  const hotelCard = cloneElement("#hotel-card");
  hotelCard.setAttribute("id", name);
  const hotelInfoContainer = hotelCard.querySelector(".hotel-info");
  hotelInfoContainer.classList.add(name);
  const hotelContainer = hotelCard.querySelector(".hotel-container");
  hotelContainer.classList.add(`${name}-icon`);

  if (tiles.length > 0) hotelContainer.classList.add("dim");

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
  const button = createTradeConfirmationBtn();
  const buyButton = createBuyButton();
  bankSection.append(button);
  bankSection.append(buyButton);
};

export const renderUserSection = ({ money, tiles }) => {
  renderTilesInHand(tiles);
  displayInitialAmount(money);
};
