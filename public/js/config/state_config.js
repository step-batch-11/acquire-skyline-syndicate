import { addListenerToBoard } from "../board_events.js";
import { buildAHotel } from "../features/hotel_foundation.js";
import { handleShiftTurn } from "../handlers/event_handlers.js";
import { addHotelData, createConfirmButton } from "../ui_renderers.js";
import { highlightPlayableTiles } from "../utils.js";

const handlePlaceTile = (gameData) => {
  const { player } = gameData;
  highlightPlayableTiles(player.tiles);
  addListenerToBoard(player.tiles);
};

const handleBuyStocks = (gameData) => {
  const { hotels } = gameData;
  const bankSection = document.querySelector(".bank");
  const hotelCards = hotels.map((hotel) => addHotelData(hotel, true));

  bankSection.replaceChildren(...hotelCards);
  const buttonContainer = document.createElement("div");
  buttonContainer.classList.add("button-container");
  const confirmBtn = createConfirmButton(buttonContainer);

  bankSection.append(confirmBtn);
};

const handleEndGame = (gameData) => {
  const template = document.getElementById("endGameTemplate");
  const clone = template.content.cloneNode(true);

  const overlay = clone.querySelector(".overlay");
  const winnerEl = clone.querySelector(".winnerName");
  const tableBody = clone.querySelector(".playersTableBody");
  const closeBtn = clone.querySelector(".close-btn");

  const { players, winner } = gameData;

  winnerEl.textContent = winner;
  players.sort((a, b) => b.amount - a.amount);
  players.forEach((player) => {
    const row = document.createElement("tr");

    row.innerHTML = `
      <td>${player.name}</td>
      <td>${player.amount}</td>
    `;

    tableBody.appendChild(row);
  });
  closeBtn.addEventListener("click", () => overlay.remove());
  overlay.addEventListener("click", (e) => {
    if (e.target === overlay) {
      overlay.remove();
    }
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
};

export const handleGameState = (gameData) => {
  const { state } = gameData;

  gameStates[state](gameData);
};
