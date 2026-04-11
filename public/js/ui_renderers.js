import { createElement } from "../js/features/hotel_foundation.js";

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
  const playerTileElements = playerTiles.map((tile) =>
    createTileElement(tile.id)
  );
  tilesContainer.innerHTML = "";
  tilesContainer.append(...playerTileElements);
};

const displayInitialAmount = (amount) => {
  const amountContainer = document.querySelector(".amount-container p");
  amountContainer.innerText = `$${amount}`;
};

export const createBuildHotelsBtn = (buttonContainer) => {
  const button = cloneElement("#button");
  button.textContent = "Build";
  button.id = "found";
  buttonContainer.append(button);
  return buttonContainer;
};

export const cloneElement = (templateId) => {
  const template = document.querySelector(templateId);
  return template.content.querySelector("*").cloneNode(true);
};

export const addHotelData = ({ name, tiles, stocksLeft, stockPrice }) => {
  const tableRowElement = document.createElement("tr");
  const tableDataElement = createElement("td", "name-info-section");
  const circleElement = createElement("div", `hotel-colored-circle`);
  circleElement.classList.add(name);
  tableDataElement.append(circleElement, name);

  const rowData = [stockPrice, tiles.length, stocksLeft].map((content) => {
    const tableDataElement = document.createElement("td");
    tableDataElement.innerText = content;
    return tableDataElement;
  });

  tableRowElement.append(tableDataElement, ...rowData);
  return tableRowElement;
};

export const renderBankSection = (hotels) => {
  const bankSection = document.querySelector(".bank");
  const bankHeader = cloneElement("#bank-header-template");
  const tableContainer = cloneElement("#bank-info-table");
  const tableBody = tableContainer.querySelector("tbody");

  const hotelCards = hotels.map((hotel) => addHotelData(hotel));
  tableBody.append(...hotelCards);
  tableContainer.append(tableBody);
  bankSection.replaceChildren(bankHeader, tableContainer);
};

const addDetailsToCard = (stockCard, name, count) => {
  stockCard.classList.remove("empty");
  const stockName = stockCard.querySelector(".stock-name");
  stockName.textContent = name;
  stockName.classList.add(name);
  stockCard.querySelector(".count").textContent = count;
};

const cloneStockCards = () => {
  return Array.from({ length: 7 }, () => cloneElement("#stock-template"));
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
