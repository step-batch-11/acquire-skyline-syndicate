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

export const renderBoard = (tilesOnBoard) => {
  const board = document.querySelector(".board");
  tilesOnBoard.forEach((tile) => {
    const tileContainer = board.querySelector(`#tile-${tile}`);
    tileContainer.classList.add("tiles-in-market");
  });
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
  button.addEventListener("click", listenerForBuyingStocks);
  buttonContainer.append(button);
  return buttonContainer;
};

const cloneElement = (templateId) => {
  const template = document.querySelector(templateId);
  return template.content.querySelector("*").cloneNode(true);
};

const addHotelData = ({ name, tileCount, stocksLeft, price }, bankSection) => {
  const hotelCard = cloneElement("#hotel-card");
  hotelCard.setAttribute("id", name);
  const hotelContainer = hotelCard.querySelector(".hotel-container");
  hotelContainer.classList.add(`${name}-icon`);
  hotelCard.querySelector(".hotel-name").textContent = name;
  hotelCard.querySelector("#price").textContent = `$ ${price}`;
  hotelCard.querySelector("#tiles").textContent = `🧱 ${tileCount}`;
  hotelCard.querySelector("#stock-left").textContent = `📈 ${stocksLeft}`;

  bankSection.append(hotelCard);
};

export const renderBankSection = (hotels) => {
  const bankSection = document.querySelector(".bank");

  hotels.forEach((hotel) => {
    addHotelData(hotel, bankSection);
  });
  const button = createTradeConfirmationBtn();
  bankSection.append(button);
  console.log(bankSection)
};

export const renderUserSection = ({ money, tiles }) => {
  renderTilesInHand(tiles);
  displayInitialAmount(money);
};
