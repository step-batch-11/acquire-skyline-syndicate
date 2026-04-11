import { createElement } from "../features/hotel_foundation.js";
import { addListenerToBoard } from "../board_events.js";
import { buildAHotel } from "../features/hotel_foundation.js";
import { handleMerge } from "../features/merge.js";
import { cloneElement } from "../ui_renderers.js";
import { highlightPlayableTiles } from "../utils.js";
import {
  listenerForBuyingStocks,
  listenerForCart,
} from "../handlers/hotel_selection_handler.js";
import { handleShiftTurn } from "../handlers/event_handlers.js";

const handlePlaceTile = (gameData) => {
  const { player } = gameData;
  highlightPlayableTiles(player.tiles);
  addListenerToBoard(player.tiles);
};

const cartSection = () => {
  const cartContainer = createElement("div", "cart-container");

  const cartCount = createElement("p", "cart-count");
  cartCount.textContent = "0/3 Selected";

  const total = createElement("p", "total");
  total.textContent = "Total:";

  const totalAmount = createElement("p", "total-amount");
  totalAmount.textContent = 0;

  const skipBtn = createElement("button", "skip");
  skipBtn.textContent = "skip";

  skipBtn.addEventListener("click", listenerForBuyingStocks);

  const confirmBtn = createElement("button", "confirm");
  confirmBtn.textContent = "confirm";
  confirmBtn.addEventListener("click", listenerForBuyingStocks);

  const cartTotal = createElement("div", "cart-total");
  const btns = createElement("div", "btns");

  cartTotal.append(total, totalAmount);
  btns.append(skipBtn, confirmBtn);
  cartContainer.append(cartCount, cartTotal, btns);

  return cartContainer;
};

const createCounter = (isBuyState, isActive) => {
  const counter = cloneElement("#counter-template");
  if (isBuyState && isActive) {
    counter.addEventListener("click", listenerForCart);
  }
  return counter;
};

const createHotelData = (
  { name, stockPrice, isActive },
  isBuyState = false,
) => {
  const tr = createElement("tr", "hotel-stock");
  tr.classList.add(isActive ? "inactive-element" : "active");
  tr.id = name;

  const hotelNameElement = createElement("span", "hotel-name-element");
  hotelNameElement.textContent = name;

  const hotelPriceElement = createElement("data", "stock-price");
  hotelPriceElement.textContent = stockPrice;
  hotelPriceElement.value = stockPrice;

  const counter = createCounter(isBuyState, isActive);

  const tableRowData = [hotelNameElement, hotelPriceElement, counter].map(
    (el) => {
      const td = createElement("td", "data");
      td.append(el);

      return td;
    },
  );
  tr.append(...tableRowData);
  return tr;
};

const createTable = (hotels) => {
  const table = cloneElement("#table");
  const tbody = table.querySelector("tbody");
  const tableData = hotels.map(createHotelData);
  tbody.append(...tableData);

  return tbody;
};

const stocksSection = (hotels) => {
  const stockContainer = createElement("div", "stocks-container");
  const firstTable = createTable(hotels.slice(0, 4));
  const secondtable = createTable(hotels.slice(-3));

  stockContainer.append(firstTable, secondtable);
  return stockContainer;
};

const handleBuyStocks = ({ hotels }) => {
  const contextMenu = document.querySelector(".context-menu");
  const buyStockContainer = createElement("div", "buy-stock-container");
  const operationElement = document.createElement("p");
  operationElement.textContent = "Buy Stocks";
  const cartContainer = cartSection();
  const stocksContainer = stocksSection(hotels);

  buyStockContainer.append(stocksContainer, cartContainer);
  contextMenu.replaceChildren(operationElement, buyStockContainer);
};

const handleEndGame = (gameData) => {
  const clone = cloneElement("#endGameTemplate");
  const winnerElement = clone.querySelector(".winnerName");
  const tableBody = clone.querySelector(".playersTableBody");

  const { players, winner } = gameData;

  winnerElement.textContent = winner;
  players.sort((a, b) => b.amount - a.amount);
  players.forEach((player) => {
    const row = document.createElement("tr");

    row.innerHTML = `
      <td>${player.name}</td>
      <td>${player.money}</td>
    `;

    tableBody.appendChild(row);
  });
  document.body.appendChild(clone);
  requestAnimationFrame(() => {
    document.querySelector(".overlay:last-child").classList.add("active");
  });
};

export const gameStates = {
  PLACE_TILE: handlePlaceTile,
  BUILD_HOTEL: buildAHotel,
  BUY_STOCK: handleBuyStocks,
  SHIFT_TURN: handleShiftTurn,
  END_GAME: handleEndGame,
  MERGE: handleMerge,
};

export const handleGameState = (gameData) => {
  const { state } = gameData;

  gameStates[state](gameData);
};
