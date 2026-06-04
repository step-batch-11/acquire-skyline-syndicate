File: public/js/board_events.js
import { handleTilePlacement } from "./handlers/event_handlers.js";
import { canPlaceTile } from "./validators.js";

const tileSelectionListener = (e, tilesInPlayerHand, board) => {
  const tileContainer = e.target.closest("div");
  if (canPlaceTile(tileContainer, tilesInPlayerHand)) {
    handleTilePlacement(tileContainer);
    board.removeEventListener("click", tileSelectionListener);
  }
};

export const addListenerToBoard = (tilesInPlayerHand) => {
  const board = document.querySelector(".board");
  board.addEventListener(
    "click",
    (e) => tileSelectionListener(e, tilesInPlayerHand, board),
  );
};

File: public/js/game.js
import { handleGameState } from "./config/state_config.js";
import { renderGame } from "./initial_setup.js";
import { updateNotification } from "./notifications.js";
import { gameState } from "./request.js";

let currentState;

const polling = () => {
  const intervalId = setInterval(async () => {
    const gameData = await gameState();
    if (gameData.state === "END_GAME") {
      clearInterval(intervalId);
      handleGameState(gameData);
      return;
    }
    updateNotification(gameData.notification);
    if (currentState !== gameData.state) {
      renderGame(gameData);
      if (gameData.isActivePlayer) {
        handleGameState(gameData);
      }
    }

    currentState = gameData.state;
  }, 1000);
};

globalThis.onload = async () => {
  const gameData = await gameState();
  currentState = gameData.state;
  renderGame(gameData);
  updateNotification(gameData.notification);
  if (gameData.isActivePlayer) {
    handleGameState(gameData);
  }

  polling();
};

File: public/js/home_page.js
import { cloneElement } from "./lobby_setup.js";
import { getData } from "./request.js";

globalThis.onload = async () => {
  const { playerName } = await getData("/login/get-player-name");
  const container = document.querySelector("#player-name-container");
  const element = cloneElement("#player-name-template");
  element.textContent = playerName;
  container.append(element);
};

File: public/js/initial_setup.js
import { renderPlayers } from "./players_sections.js";
import {
  renderBankSection,
  renderBoard as renderBoardState,
  renderUserSection,
} from "./ui_renderers.js";

const createTileElement = (tile) => {
  const tileContainer = document.createElement("div");
  tileContainer.classList.add("tile");
  tileContainer.id = `tile-${tile}`;
  const p = document.createElement("p");
  p.textContent = tile;
  tileContainer.append(p);
  return tileContainer;
};

export const createBoard = () => {
  const board = document.querySelector(".board");
  const string = "abcdefghi";
  const cells = [];
  for (let col = 0; col < string.length; col++) {
    for (let row = 1; row <= 12; row++) {
      const tileContainer = createTileElement(`${row}${string[col]}`);
      cells.push(tileContainer);
    }
  }

  board.replaceChildren(...cells);
};

export const renderGame = (gameData) => {
  const { tilesOnBoard, currentPlayer, player, hotels, players } = gameData;
  createBoard();
  renderBoardState(tilesOnBoard, hotels);
  renderPlayers(players, currentPlayer);
  renderUserSection(player);
  renderBankSection(hotels);
};

File: public/js/join_lobby.js
import { addListenerToJoinLobbyForm } from "./listeners.js";

globalThis.onload = () => {
  const form = document.querySelector("form");
  addListenerToJoinLobbyForm(form);
};

File: public/js/listeners.js
import { handleCartUpdation } from "./handlers/event_handlers.js";
import { renderLobbyMsg } from "./lobby_setup.js";
import { postData } from "./request.js";
import {
  renderBankSection,
  renderBoard,
  renderHeldStocks,
  renderUserSection,
} from "./ui_renderers.js";
import { extractSelectedStocks } from "./utils.js";

export const listenerForCart = (e) => {
  const action = e.target.dataset.action;
  const parent = e.target.parentElement;
  handleCartUpdation(action, parent);
};

export const listenerForBuyingStocks = async (e) => {
  e.preventDefault();
  const listOfHotelHeader = document.querySelectorAll(".hotel-card-header");
  const cart = [...listOfHotelHeader].reduce(extractSelectedStocks, []);
  const { hotels, playerInfo } = await postData("/turn/buy-stocks", cart);
  renderBankSection(hotels);
  renderUserSection(playerInfo);
};

export const listenerForHotelSelection = (e) => {
  e.preventDefault();
  return event.target.parentNode.id;
};

export const listenerForFoundingHotel = async (
  e,
  hotelToFound,
  _tileContainer,
  bankContainer,
) => {
  e.preventDefault();
  const { hotels, tilesOnBoard, currentPlayer } = await postData(
    "/turn/build-hotel",
    {
      hotelToFound,
    },
  );

  bankContainer.removeEventListener("click", listenerForHotelSelection);

  const foundBtn = bankContainer.querySelector("#found");
  foundBtn.classList.add("hidden");
  renderBankSection(hotels);
  renderBoard(tilesOnBoard, hotels);
  renderHeldStocks(currentPlayer.stocks);
};

export const addListenerToCopyBtn = (copyBtn) => {
  copyBtn.addEventListener("click", async () => {
    const lobbyIdEl = document.getElementById("lobbyId");
    const status = document.getElementById("copyStatus");
    const lobbyId = lobbyIdEl.textContent;

    try {
      await navigator.clipboard.writeText(lobbyId);
      status.textContent = "Copied!";
    } catch {
      status.textContent = "Failed to copy";
    }
  });
};

export const addListenerToStartBtn = (startBtn) => {
  startBtn.addEventListener("click", async (e) => {
    e.preventDefault();
    await fetch("/game/start-game");
  });
};

export const addListenerToJoinLobbyForm = (form) => {
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const formData = new FormData(form);
    const response = await fetch(form.action, {
      method: "POST",
      body: formData,
    });

    const data = await response.json();

    if (data.isDone) {
      globalThis.location.href = data.url;
    } else {
      renderLobbyMsg(data.msg);
    }
  });
};

File: public/js/lobby_setup.js
import { LOBBY_STATES } from "../config.js";

const { WAITING, READY } = LOBBY_STATES;

export const cloneElement = (templateId) => {
  const template = document.querySelector(templateId);
  return template.content.querySelector("*").cloneNode(true);
};

const renderBuffer = (state) => {
  const bufferContainer = document.querySelector("#buffer-container");
  const bufferTemplateId = [WAITING, READY].includes(state)
    ? "#waiting-icon-template"
    : "#starting-icon-template";

  const element = cloneElement(bufferTemplateId);
  if (state === READY) {
    const h3 = element.querySelector("h3");
    h3.textContent = "";
    h3.textContent = "START THE GAME OR WAIT FOR OTHER PLAYERS TO JOIN";
  }
  bufferContainer.innerHTML = "";
  bufferContainer.appendChild(element);
};
const renderNames = (activePlayers) => {
  const listContainer = document.querySelector("#players-list");

  const elementsList = activePlayers.map((player) => {
    const element = cloneElement("#name-display-template");
    element.querySelector("#name").textContent = player;
    return element;
  });
  listContainer.innerHTML = "";
  listContainer.append(...elementsList);
};

const renderLobbyId = (lobbyId) => {
  const idContainer = document.querySelector("#lobby-id-container");

  const element = cloneElement("#lobby-id-template");
  idContainer.innerHTML = "";
  element.textContent = lobbyId;
  idContainer.append(element);
};

export const renderStartBtn = () => {
  const startBtnContainer = document.querySelector("#start-button-container");

  const element = cloneElement("#start-btn-template");
  startBtnContainer.innerHTML = "";
  startBtnContainer.append(element);
};

export const renderLobby = (state, lobbyDetails) => {
  renderBuffer(state);
  renderNames(lobbyDetails.playerNames);
  renderLobbyId(lobbyDetails.lobbyId);
};

export const renderLobbyMsg = (msg) => {
  const lobbyStatusContainer = document.querySelector(
    "#lobby-status-container",
  );
  const element = cloneElement("#lobby-status-template");
  lobbyStatusContainer.innerHTML = "";
  element.textContent = msg;
  lobbyStatusContainer.append(element);
};

File: public/js/lobby.js
import { LOBBY_STATES, TIMES } from "../config.js";
import { addListenerToCopyBtn, addListenerToStartBtn } from "./listeners.js";
import { renderLobby, renderStartBtn } from "./lobby_setup.js";
import { getLobbyDetails } from "./request.js";
const { READY, STARTED } = LOBBY_STATES;

const { PING, START_TIMER } = TIMES;
globalThis.onload = () => {
  const startBtn = document.getElementById("start-button-container");
  addListenerToStartBtn(startBtn);
  const copyBtn = document.getElementById("copyBtn");
  addListenerToCopyBtn(copyBtn);

  const id = setInterval(async () => {
    const { state, lobbyDetails, msg } = await getLobbyDetails();
    renderLobby(state, lobbyDetails, msg);
    if (state === READY) {
      renderStartBtn();
    }

    if (state === STARTED) {
      setTimeout(async () => {
        const response = await fetch("/game/join-game");
        globalThis.location.href = response.url;
      }, START_TIMER);
      clearInterval(id);
    }
  }, PING);
};

File: public/js/notifications.js
const getDeadNotificationMessage = ({ removedTiles, newTiles }) =>
  `These ${removedTiles} are exchaged with ${newTiles}`;

const getStocksPurchaseNotification = ({ cart }) =>
  cart.reduce(
    (msg, details) =>
      msg += `${details.selectedStocks} of ${details.hotelName} \n\t`,
    `Player purchased `,
  );

const getInsufficientFundsNotification = ({ _hasEnoughBalance }) =>
  "Insufficient Balance !!";

const getMergerBonusNotification = (data) =>
  data.reduce(
    (msg, details) =>
      msg += `${details.type} bonus: ${details.name} ->$${details.amount}\n\t`,
    `Bonus Allocation \n `,
  );

const getMessage = ({ type, data }) => {
  const notificationMapper = {
    "DEAD_TILE_EXCHANGE": getDeadNotificationMessage,
    "BUYING_STOCKS": getStocksPurchaseNotification,
    "INSUFFICIENT_FUNDS": getInsufficientFundsNotification,
    "MERGER_BONUS": getMergerBonusNotification,
  };
  return notificationMapper[type](data);
};

export const updateNotification = (notification) => {
  if (Object.keys(notification).length === 0) return;
  const notificationBox = document.querySelector(".notification-box");
  notificationBox.classList.add("notification-container");
  setTimeout(() => {
    notificationBox.classList.remove("notification-container");
    notificationBox.textContent = "";
  }, 3000);
  const message = getMessage(notification);
  notificationBox.textContent = message;
};

File: public/js/players_sections.js
export const renderPlayers = (players, currentPlayer) => {
  const playersSection = document.querySelector(".players");
  playersSection.replaceChildren();
  const playerTemplate = document.querySelector("#player-template");

  players.forEach(({ name }, id) => {
    const playerClone = playerTemplate.content.cloneNode(true);
    playerClone.querySelector(".player-name").textContent = name;
    playerClone
      .querySelector(".player-name")
      .setAttribute("id", `player-${id + 1}`);
    if (name === currentPlayer.name) {
      playerClone
        .querySelector(".player-profile")
        .setAttribute("class", "player-profile active-player");
    }
    playersSection.appendChild(playerClone);
  });
};

File: public/js/request.js
export const getData = async (endPoint) => {
  const response = await fetch(endPoint);
  return await response.json();
};

export const gameState = async () => {
  return await getData("/turn/current-state");
};

export const getLobbyState = async () => {
  return await getData("/lobby/state");
};

export const getLobbyDetails = async () => {
  return await getData("/lobby/lobby-details");
};

export const postData = async (endPoint, content) => {
  const response = await fetch(endPoint, {
    method: "post",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(content),
  });

  return await response.json();
};

export const updateTiles = async (tile) => {
  return await postData("/turn/place-tile", { tile });
};

File: public/js/script.js
globalThis.onload = () => {
  setTimeout(async () => {
    const response = await fetch("/login/redirect-login");
    globalThis.location.href = await response.url;
  }, 5000);
};

File: public/js/ui_renderers.js
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

File: public/js/utils.js
export const highlightPlayableTiles = (playerTiles) => {
  const board = document.querySelector(".board");
  playerTiles.forEach((tile) => {
    if (tile.isPlayable) {
      const tileContainer = board.querySelector(`#tile-${tile.id}`);
      tileContainer.classList.add("tiles-in-player-hand");
    }
  });
};

export const removeFocus = (board, playerTiles) => {
  playerTiles.forEach((tile) => {
    const tileContainer = board.querySelector(`#tile-${tile}`);
    tileContainer.classList.remove("tiles-in-player-hand");
  });
};

export const extractSelectedStocks = (cart, hotel) => {
  const selectedStocks = parseInt(
    hotel.querySelector(".cart-value").value,
  );
  const hotelName = hotel.id;
  if (selectedStocks > 0) {
    cart.push({ hotelName: hotelName.toLowerCase(), selectedStocks });
  }
  return cart;
};

File: public/js/validators.js
export const canPlaceTile = (tileContainer, tilesInPlayerHand) => {
  const containerClass = tileContainer.getAttribute("class");
  if (containerClass === "board") return false;

  const playerTile = tileContainer.id.split("-")[1];
  return tilesInPlayerHand.some((tile) => playerTile === tile.id);
};

File: public/index.html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Home Page</title>
    <link rel="stylesheet" href="./styles/landing_page.css" />
    <script type="module" src="./js/script.js"></script>
  </head>
  <body>
    <main>
      <div class="game-heading">
        <h1">ACQUIRE</h1>
      </div>
    </main>
  </body>
</html>

File: public/pages/game.html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Basic layout</title>
    <link rel="stylesheet" href="../styles/game.css" />
    <link rel="stylesheet" href="../styles/merge.css">
    <script type="module" src="../js/game.js"></script>
  </head>

<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Basic layout</title>
  <link rel="stylesheet" href="../styles/game.css" />
  <script type="module" src="../js/game.js"></script>
</head>

<body>
  <aside>
    <div class="players"></div>
  </aside>
  <main>
    <div class="market-notification-players">
      <div class="notification-box"></div>
      <div class="player-market">
        <div class="board"></div>
      </div>
    </div>
    <footer>
      <div class="user-hand">
        <div class="amount-container">
          <p></p>
        </div>
        <div class="stocks"></div>
        <div class="tiles tiles-in-hand"></div>
      </div>
      <div class="context-menu">
        <div></div>
      </div>
    </footer>
  </main>
  <div class="bank">
    <div></div>
    <!-- Bank Section -->
  </div>

  <template id="player-template">
    <div class="player-container">
      <div class="player-profile"></div>
      <div class="player-name"></div>
    </div>
  </template>

  <template id="board-tile">
    <div class="tile">
      <p>1a</p>
    </div>
  </template>

  <template id="button">
    <button class="confirm-btn"></button>
  </template>

  <template id="stock-template">
    <div class="stock empty">
      <h3 class="stock-name"></h3>
      <span class="count"></span>
    </div>
  </template>

  <template id="counter-template">
    <div class="counter">
      <button data-action="decr">-</button>
      <data class="cart-value" value="0">0</data>
      <button data-action="incr">+</button>
    </div>
  </template>

  <template id="found-hotel">
    <div class="found-hotel-container">
      <div class="icon"></div>
      <div class="name"></div>
    </div>
  </template>

  <template id="endGameTemplate">
    <div class="overlay">
      <div class="popup">
        <span class="close-btn">✖</span>

        <h2>Game Over 🎮</h2>

        <div class="winner">
          <h3>Winner:</h3>
          <p class="winnerName"></p>
        </div>

        <div class="players">
          <h3>Players</h3>

          <table class="players-table">
            <thead>
              <tr>
                <th>Player</th>
                <th>Amount 💰</th>
              </tr>
            </thead>
            <tbody class="playersTableBody"></tbody>
          </table>
        </div>
      </div>
    </div>
  </template>

  <template id="chooseDissolvingHotel">
    <div class="chooseHotelContainer">
      <h1>Choose hotel to disolve.</h1>
      <button id="hotel-1">continental</button>
      <button id="hotel-2">imperial</button>
    </div>
  </template>

  <template id="chooseDissolvingHotel">
    <div class="chooseHotelContainer">
      <h1>
        Choose hotel to disolve.
      </h1>
      <button id="hotel-1">continental</button>
      <button id="hotel-2">imperial</button>
    </div>
  </template>

  <template id="stock-dissolution">
      <div id="stock-dissolution-card">
        <h1>Exchange or Dissolve</h1>
        <div>
          <h3>Exchange counter : </h3>
          <counter-btn id = "exchange-counter"></counter-btn>
        </div>
        <div>
          <h3>sell counter : </h3>
          <counter-btn id = "sell-counter" ></counter-btn>
        </div>
        <button id="dissolve-btn">Dissolve</button>
      </div>
  </template>

</body>

</html>
    <template id="table">
      <table>
        <tbody></tbody>
      </table>
    </template>
    <template id="bank-info-table">
      <table id="info-table">
        <thead>
          <tr>
            <th>Corporation</th>
            <th>price</th>
            <th>size</th>
            <th>stocks</th>
          </tr>
        </thead>
        <tbody></tbody>
      </table>
    </template>
    <template id="bank-header-template">
      <div class="bank-header">
        <img src="/assets/bank.svg" alt="" />
        <h2 class="market-info-header">Market Info</h2>
      </div>
    </template>
  </body>
</html>
  <template id="table">
    <table>
      <tbody></tbody>
    </table>
  </template>
  <template id="bank-info-table">
    <table id="info-table">
      <thead>
        <tr>
          <th>Corporation</th>
          <th>price</th>
          <th>size</th>
          <th>stocks</th>
        </tr>
      </thead>
      <tbody></tbody>
    </table>
  </template>
  <template id="bank-header-template">
    <div class="bank-header">
      <img src="/assets/bank.svg" alt="" />
      <h2 class="market-info-header">Market Info</h2>
    </div>
  </template>
</body>

</html>

File: public/pages/home_page.html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <link rel="stylesheet" href="../styles/home_page.css" />
    <script type="module" src="../js/home_page.js"></script>
    <title>Document</title>
  </head>
  <body>
    <header>
      <h1>ACQUIRE</h1>
    </header>
    <template id="player-name-template">
      <h1 id="player-name"></h1>
    </template>

    <main>
      <section id="player-name-container">
        <h1>Hi!</h1>
      </section>
      <section id="buttons">
        <form action="/lobby/host" method="get">
          <button type="submit" id="host"><h3>HOST</h3></button>
        </form>

        <form action="/lobby/join" method="get">
          <button type="submit" id="join"><h3>JOIN</h3></button>
        </form>
      </section>
      <div class="loader"></div>
    </main>
  </body>
</html>

File: public/pages/join_lobby.html
<!doctype html>
<html lang="en">
  <head>
    <title>ACQUIRE</title>
    <link rel="stylesheet" href="../styles/join_lobby.css" />
    <script type="module" src="../js/join_lobby.js"></script>
  </head>

  <body>
    <template id="lobby-status-template">
      <h1></h1>
    </template>

    <header>
      <h1>ACQUIRE</h1>
      <p class="tagline">
        Build Empires. Acquire Corporations. Dominate the Market.
      </p>
    </header>

    <section class="join-lobby-container">
      <form action="/lobby/join-lobby" method="post" class="join-lobby-form">
        <label for="lobby_id">ENTER LOBBY ID :</label>
        <input
          type="text"
          name="lobby_id"
          id="lobby_id"
          placeholder="Lobby Id"
          required
        />
        <button type="submit" id="join_game">ENTER</button>
      </form>
    </section>

    <section id="lobby-status-container"></section>
  </body>
</html>

File: public/pages/lobby.html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Lobby</title>
    <link rel="stylesheet" href="../styles/lobby.css" />
    <script type="module" src="../js/lobby.js"></script>
  </head>

  <body>
    <template id="lobby-id-template">
      <span id="lobbyId">ABCD1234</span>
    </template>

    <template id="name-display-template">
      <h2>
        <li id="name"></li>
      </h2>
    </template>

    <template id="start-btn-template">
      <button id="start-btn" type="submit">START</button>
    </template>

    <template id="waiting-icon-template">
      <div class="waiting-container">
        <div class="spinner"></div>
        <h3>WAITING FOR HOST TO START THE GAME</h3>
      </div>
    </template>

    <template id="starting-icon-template">
      <div class="starting-container">
        <h3>GAME STARTING...</h3>
        <div class="progress-bar">
          <div class="progress"></div>
        </div>
      </div>
    </template>

    <header>
      <h1>LOBBY</h1>
    </header>

    <main>
      <div class="lobby-info">
        <div class="lobby-id-box">
          <span>Lobby ID: </span>
          <div id="lobby-id-container">
          </div>
          <button id="copyBtn"></button>
        </div>

        <p id="copyStatus"></p>
      </div>

      <section id="players-name-display">
        <section>
          <ol id="players-list"></ol>
        </section>
      </section>

      <section id="start-button-container"></section>

      <section id="buffer-container"></section>
    </main>
  </body>
</html>

File: public/pages/login.html
<!DOCTYPE html>
<html lang="en">

<head>
  <title>ACQUIRE</title>
  <link rel="stylesheet" href="../styles/login.css">
</head>

<body>
  <section class="login-container">
    <form action="/login/login" method="post" class="login-form">
      <h1>ACQUIRE</h1>
      <div class="input-box">
        <label for="player_name">ENTER PLAYER NAME :</label>
        <input type="text" name="player_name" id="player_name" placeholder="Unique Name" required>
      </div>
      <button type="submit" id="login" class="login-btn">LOGIN</button>
    </form>
  </section>

</body>

</html>

File: main.js
import { createApp } from "./src/app.js";
import { GameManager } from "./src/models/game_manager.js";
import { Lobby } from "./src/models/lobby.js";
import { PlayerSession } from "./src/models/player_session.js";
import { createGame } from "./src/utils.js";

const main = () => {
  const port = Deno.env.get("PORT") || 8000;
  const isDevMode = Deno.env.get("dev");

  const lobby = new Lobby();
  const sessions = new PlayerSession();
  const gameManager = new GameManager(createGame);
  const app = createApp(sessions, lobby, gameManager, isDevMode);
  Deno.serve({ port }, app.fetch);
};

main();

File: src/configs/game_states_config.js
export const gameStates = {
  placeTile: "PLACE_TILE",
  buildHotel: "BUILD_HOTEL",
  buyStock: "BUY_STOCK",
  shiftTurn: "SHIFT_TURN",
  endGame: "END_GAME",
};

File: src/configs/hotels_data.js
export const hotels = [
  {
    name: "continental",
    tiles: [],
    stocks: 25,
    orginTile: null,
    price: 0,
    scale: 200,
  },
  {
    name: "imperial",
    tiles: [],
    stocks: 25,
    orginTile: null,
    price: 0,
    scale: 200,
  },
  {
    name: "american",
    tiles: [],
    stocks: 25,
    orginTile: null,
    price: 0,
    scale: 100,
  },
  {
    name: "festival",
    tiles: [],
    stocks: 25,
    orginTile: null,
    price: 0,
    scale: 100,
  },
  {
    name: "worldwide",
    tiles: [],
    stocks: 25,
    orginTile: null,
    price: 0,
    scale: 100,
  },

  {
    name: "sackson",
    tiles: [],
    stocks: 25,
    orginTile: null,
    price: 0,
    scale: 0,
  },
  {
    name: "tower",
    tiles: [],
    stocks: 25,
    orginTile: null,
    price: 0,
    scale: 0,
  },
];

File: src/configs/merge_states.js
export const MERGE_STATE = {
  equal: "EQUAL_HOTEL_MERGE",
  unequal: "UNEQUAL_HOTEL_MERGE",
  dissolution: "STOCK_DISSOLUTION",
};

File: src/controllers/dev_controller.js
import { Player } from "../models/player.js";
import { Tile } from "../models/tile.js";

export const saveGameState = async (c) => {
  const fileName = await c.req.query("name");
  const gameManager = c.get("gameManager");
  const game = gameManager.game;
  const data = game.getCurrentGameState();
  Deno.writeTextFileSync(
    `./game-states/${fileName}.json`,
    JSON.stringify(data),
    { create: true },
  );
  return c.redirect("/pages/game.html");
};

export const loadGameState = async (c) => {
  const gameManager = c.get("gameManager");
  const lobby = c.get("lobby");
  const game = gameManager.game;
  const fileName = await c.req.query("name");
  const jsondata = Deno.readTextFileSync(`./game-states/${fileName}.json`);
  const data = createInstances(JSON.parse(jsondata), lobby);
  game.loadGameState(data);
  return c.redirect("/pages/game.html");
};

const createInstances = (data) => {
  data.hotels.forEach((hotel) => {
    hotel.tiles = hotel.tiles.map(({ id }) => new Tile(id));
    if (hotel.originTile) {
      hotel.originTile = new Tile(hotel.originTile.id);
    }
  });

  data.players = data.players.map((playerDetails) => {
    const player = new Player(playerDetails.name, playerDetails.id);
    player.loadGameState(playerDetails);
    return player;
  });

  data.board.placedTileIds = data.board.placedTileIds.map((id) => new Tile(id));
  return data;
};

File: src/controllers/game_controller.js
import { extractRequestedPlayerId } from "./turn_controller.js";

export class GameController {
  constructor() {}

  startGame(c) {
    const gameManager = c.get("gameManager");
    const lobby = c.get("lobby");
    const sessions = c.get("sessions");
    const playerIdsMap = sessions.playerIds;
    gameManager.createGame(playerIdsMap);
    lobby.transitionToStart();
    return c.redirect("/pages/lobby.html", 302);
  }

  redirectToGame(c) {
    return c.redirect("/pages/game.html", 302);
  }
}

export const handleShiftTurn = (c) => {
  const gameManager = c.get("gameManager");
  const game = gameManager.game;
  const playerId = extractRequestedPlayerId(c);
  try {
    const response = game.shiftTurn(playerId);
    return c.json(response, 200);
  } catch (error) {
    return c.json(error, 400);
  }
};

File: src/controllers/lobby_controller.js
import { getCookie } from "hono/cookie";

export class LobbyController {
  constructor() {
  }

  hostLobby(c) {
    const sessions = c.get("sessions");
    const sessionId = getCookie(c, "sessionId");
    const playerId = sessions.getPlayerId(sessionId);
    const lobbyId = Math.floor(Math.random() * 1000000);
    const lobby = c.get("lobby");
    lobby.lobbyId = lobbyId;
    lobby.host = playerId;
    lobby.playerId = playerId;

    return c.redirect("/pages/lobby.html", 302);
  }

  async joinLobby(c) {
    const lobby = c.get("lobby");
    if (!lobby.isFull()) {
      const formData = await c.req.formData();

      const _lobbyId = formData.get("lobby_id");

      const sessions = c.get("sessions");
      const sessionId = getCookie(c, "sessionId");

      const playerId = sessions.getPlayerId(sessionId);
      lobby.playerId = playerId;

      return c.json({ isDone: true, url: "/pages/lobby.html" });
    }
    return c.json({ isDone: false, msg: "Lobby is full !" });
  }

  lobbyDetails(c) {
    const sessionId = getCookie(c, "sessionId");
    const sessions = c.get("sessions");
    const lobby = c.get("lobby");
    const playerId = sessions.getPlayerId(sessionId);
    const lobbyId = lobby.lobbyId;
    const playerIds = lobby.activePlayerIds;
    const playerNames = playerIds.map((id) => sessions.getPlayerName(id));

    return c.json({
      state: lobby.currentState(playerId),
      lobbyDetails: { lobbyId, playerNames },
    });
  }

  redirectToJoinLobby(c) {
    return c.redirect("/pages/join_lobby.html", 302);
  }
}

File: src/controllers/login_controller.js
import { getCookie, setCookie } from "hono/cookie";

export class LoginController {
  #idGenerator;
  constructor(idGenerator = Date.now) {
    this.#idGenerator = idGenerator;
  }

  login(c, formData) {
    const playerName = formData.get("player_name");
    const sessionId = crypto.randomUUID();
    const playerId = this.#idGenerator();
    const sessions = c.get("sessions");
    sessions.session = { sessionId, playerId };
    sessions.playerId = { playerId, playerName };
    setCookie(c, "sessionId", sessionId);
    return c.redirect("/pages/home_page.html", 302);
  }

  getPlayerName(c) {
    const sessionId = getCookie(c, "sessionId");
    const sessions = c.get("sessions");
    const playerId = sessions.getPlayerId(sessionId);
    const playerName = sessions.getPlayerName(playerId);
    return c.json({ playerName });
  }

  redirectToLogin(c) {
    return c.redirect("/pages/login.html", 302);
  }
}

File: src/controllers/turn_controller.js
import { getCookie } from "hono/cookie";

export const extractRequestedPlayerId = (c) => {
  const sessions = c.get("sessions");
  const sessionId = getCookie(c, "sessionId");
  return sessions.getPlayerId(sessionId);
};

export class TurnController {
  currentState(c) {
    const gameManager = c.get("gameManager");
    const game = gameManager.game;
    const playerId = extractRequestedPlayerId(c);
    return c.json(game.currentState(playerId));
  }

  async placeTile(c) {
    const { tile } = await c.req.json();
    const gameManager = c.get("gameManager");
    const game = gameManager.game;
    const playerId = extractRequestedPlayerId(c);
    try {
      const response = game.placeTile(playerId, tile);
      return c.json(response, 201);
    } catch (error) {
      return c.json(error, 400);
    }
  }

  async buildHotel(c) {
    const { hotelToFound } = await c.req.json();
    const gameManager = c.get("gameManager");
    const game = gameManager.game;
    const playerId = extractRequestedPlayerId(c);
    try {
      const response = game.buildHotel(playerId, hotelToFound);
      return c.json(response);
    } catch (error) {
      return c.json(error, 400);
    }
  }

  async buyStocks(c) {
    const cart = await c.req.json();
    const gameManager = c.get("gameManager");
    const game = gameManager.game;
    const playerId = extractRequestedPlayerId(c);
    const res = game.buyStocks(playerId, cart);

    return c.json(res);
  }
}

File: src/handlers/game_handler.js
export const handleShiftTurn = (c) => {
  const gameManager = c.get("gameManager");
  const game = gameManager.game;
  const playerId = extractRequestedPlayerId(c);
  game.shiftTurn(playerId);
  const currentGameState = game.currentState();
  return c.json(currentGameState);
};

File: src/handlers/merge_handlers.js
import { getCookie } from "hono/cookie";

export const equalHotelMergeHandler = async (c) => {
  const body = await c.req.json();
  const sessions = c.get("sessions");
  const sessionId = getCookie(c, "sessionId");
  const playerId = sessions.getPlayerId(sessionId);
  const gameManager = c.get("gameManager");
  const game = gameManager.game;
  return c.json(game.merge(body, playerId));
};

export const handleStockDissolution = async (c) => {
  const body = await c.req.json();
  const sessions = c.get("sessions");
  const sessionId = getCookie(c, "sessionId");
  const playerId = sessions.getPlayerId(sessionId);
  const gameManager = c.get("gameManager");
  const game = gameManager.game;

  return c.json(game.handleStockDissolution(body, playerId));
};

File: src/models/board.js
export class Board {
  #placedTiles;
  #lastTile;

  constructor() {
    this.#placedTiles = [];
  }

  get lastTile() {
    return this.#lastTile;
  }

  isTileOnBoard(tileId) {
    const placedTileIds = this.#placedTiles.map((tile) => tile);
    return placedTileIds.includes(tileId);
  }

  getPlacedTiles() {
    return this.#placedTiles.map((tile) => ({ id: tile.id }));
  }

  place(tile) {
    this.#placedTiles.push(tile);
    this.#lastTile = tile;
  }

  hasAdjacentForLastTile() {
    return this.#placedTiles.some((placedTile) =>
      this.#lastTile.isNeighbour(placedTile)
    );
  }

  adjacentTilesOf(tile) {
    return tile.getAllConnectedTiles(this.#placedTiles);
  }

  getAdjacentTiles(tile) {
    return tile.neighbourTiles();
  }

  getBoardState() {
    const placedTileIds = this.#placedTiles.map((tile) => tile.id);
    const lastTile = this.#lastTile.id;
    return {
      placedTileIds,
      lastTile,
    };
  }

  loadGameState({ placedTileIds, lastTile }) {
    this.#lastTile = lastTile;
    this.#placedTiles = placedTileIds;
  }
}

File: src/models/deck.js
export class Deck {
  #tiles;
  constructor(tiles) {
    this.#tiles = tiles;
  }

  drawTiles(count = 1) {
    return this.#tiles.splice(0, count);
  }

  get tiles() {
    return this.#tiles;
  }

  set tiles(tiles) {
    this.#tiles = tiles;
  }
}

File: src/models/game_manager.js
export class GameManager {
  #game;
  #createGame;

  constructor(createGame) {
    this.#createGame = createGame;
  }

  createGame(activePlayers) {
    this.#game = this.#createGame(activePlayers);
  }

  get game() {
    return this.#game;
  }
}

File: src/models/game.js
import { gameStates } from "../configs/game_states_config.js";
import {
  distributeBonus,
  sellStocks,
} from "../services/dissolution_controller.js";
import { Tile } from "./tile.js";

export class Game {
  #currentService;
  #mergeService = null;
  #deck;
  #board;
  #hotels;
  #currentPlayer;
  #state;
  #players;
  #currentPlayerIndex;
  #createMergeService;
  #notification = {};
  #mergeState;

  constructor(deck, board, hotels, players, createMergeService) {
    this.#deck = deck;
    this.#board = board;
    this.#hotels = hotels;
    this.#currentPlayerIndex = 0;
    this.#currentPlayer = players[this.#currentPlayerIndex];
    this.#players = players;
    this.#state = gameStates.placeTile;
    this.#createMergeService = createMergeService;
  }

  init() {
    const initialBoardTiles = this.#deck.drawTiles(6);
    initialBoardTiles.forEach((tile) => this.#board.place(tile));
    this.#players.forEach((player) => {
      const initialPlayerTiles = this.#deck.drawTiles(6);
      player.addInitialTiles(initialPlayerTiles.map((tile) => tile));
    });
  }

  calculateFinalWinner() {
    this.#hotels.getHotelEntities().forEach((hotel) => {
      distributeBonus(this.#players, hotel);
    });

    this.#hotels.getHotelEntities().forEach((hotel) => {
      this.#players.forEach((player) => {
        sellStocks(player, hotel);
      });
    });

    const players = this.#players
      .map((player) => {
        const { name, money } = player.getDetails();
        return { name, money };
      })
      .sort((a, b) => b.money - a.money);

    return {
      state: this.#state,
      players,
      winner: players[0].name,
    };
  }

  #notifyInactivePlayers(requestedPlayerId, notification) {
    if (requestedPlayerId !== notification.playerId) {
      return { type: notification.type, data: notification.data };
    }
    return {};
  }

  #notifyCurrentPlayer(requestedPlayerId, notification) {
    if (requestedPlayerId === notification.playerId) {
      return { type: notification.type, data: notification.data };
    }
    return {};
  }

  #notifyAllPlayers(_requestedPlayerId, notification) {
    return { type: notification.type, data: notification.data };
  }

  #generateNotification(requestedPlayerId, notification) {
    if (Object.keys(notification).length === 0) return {};

    const notificationHandler = {
      "DEAD_TILE_EXCHANGE": this.#notifyCurrentPlayer,
      "BUYING_STOCKS": this.#notifyInactivePlayers,
      "INSUFFICIENT_FUNDS": this.#notifyCurrentPlayer,
      "MERGER_BONUS": this.#notifyAllPlayers,
    };
    const intervalId = setInterval(() => {
      this.#notification = {};
      clearInterval(intervalId);
    }, 5000);

    return notificationHandler[notification.type](
      requestedPlayerId,
      notification,
    );
  }

  currentState(requestedPlayerId) {
    if (this.#state === "END_GAME") return this.calculateFinalWinner();
    if (
      this.#mergeService &&
      this.#mergeService.mergeState === "END_MERGE"
    ) {
      this.#state = "BUY_STOCK";
      this.#mergeService = null;
      this.#mergeState = null;
    }
    return {
      notification: this.#generateNotification(
        requestedPlayerId,
        this.#notification,
      ),
      player: this.#players
        .find((player) => player.id === requestedPlayerId)
        .getDetails(),
      currentPlayer: { name: this.#currentPlayer.name },
      hotels: this.#hotels.getHotels(),
      tilesOnBoard: this.#board.getPlacedTiles(),
      state: this.#state,
      players: this.#players.map((player) => ({
        name: player.name,
      })),
      isActivePlayer: this.#currentPlayer.id === requestedPlayerId,
      mergeData: {
        mergeState: this.#mergeState,
      },
    };
  }

  #isBuildPossible() {
    const adjacentTiles = this.#board.lastTile.neighbourTiles();
    const notInAnyHotel = !adjacentTiles.some((tile) =>
      this.#hotels.isTileInAnyHotel(tile)
    );
    return (
      this.#hotels.isAnyInActiveHotel() &&
      this.#board.hasAdjacentForLastTile() &&
      notInAnyHotel
    );
  }

  #isValidTilePlacement(tileId) {
    if (this.#board.isTileOnBoard(tileId)) return false;
    if (!this.#currentPlayer.isPlayerTile(tileId)) return false;
    return true;
  }

  #isExpansion() {
    const adjacentTiles = this.#board.lastTile.neighbourTiles();
    return adjacentTiles.some((tile) => this.#hotels.isTileInAnyHotel(tile));
  }

  #getAdjacentHotelChains() {
    const lastTile = this.#board.lastTile;
    const adjacentTiles = this.#board.adjacentTilesOf(lastTile);
    return this.#hotels.getAdjacentHotelChains(adjacentTiles);
  }

  #changeStateAfterMergeEnd() {
    if (this.#mergeService.mergeState === "MERGE_END") {
      this.#state = "BUY_STOCK";
    }
    this.#mergeState = this.#mergeService.mergeState;
    this.#state = "MERGE";
  }

  #initiateMerge(adjacentHotelChains) {
    this.#mergeService = this.#createMergeService(
      adjacentHotelChains,
      this.#players,
      this.#hotels,
      this.#board,
    );
    this.#currentService = this.#mergeService;
    this.#currentService.init();
    const bonusHoldersDetails = this.#currentService.getBonusHoldersDetails();
    this.#createNotificationData("MERGER_BONUS", bonusHoldersDetails);
  }

  #actionForTilePlacement(tileId) {
    const adjacentHotelChains = this.#getAdjacentHotelChains();
    if (adjacentHotelChains.length > 1) {
      this.#initiateMerge(adjacentHotelChains);
      // this.#mergeService.handleMerge();
      this.#changeStateAfterMergeEnd();
      return;
    }

    if (this.#isBuildPossible()) {
      this.#state = "BUILD_HOTEL";
      return;
    }

    if (this.#isExpansion()) {
      this.expandHotel(tileId);
    }

    this.#state = "BUY_STOCK";
  }

  #areStocksValid(cart) {
    const totalStocks = cart.reduce(
      (count, { selectedStocks }) => (count += selectedStocks),
      0,
    );

    return totalStocks <= 3;
  }

  #isValidPurchase(cart, moneyToDeduct) {
    return (
      this.#areStocksValid(cart) &&
      this.#hotels.areCartHotelsActive(cart) &&
      this.#hotels.hasEnoughStocksToBuy(cart) &&
      this.#currentPlayer.hasEnoughMoney(moneyToDeduct)
    );
  }

  #isActivePlayer(requestedPlayerId) {
    return this.#currentPlayer.id === requestedPlayerId;
  }

  merge(data) {
    // this.#state = "BUY_STOCK"
    return this.#currentService.handleMerge(data);
  }

  placeTile(requestedPlayerId, tileId) {
    if (!this.#isActivePlayer(requestedPlayerId)) {
      throw new Error({ msg: "OUT OF TURN ACTION" });
    }
    if (this.#state !== "PLACE_TILE") {
      throw new Error({ msg: "INVALID STATE" });
    }
    if (!this.#isValidTilePlacement(tileId)) {
      throw new Error({ msg: "INVALID TILE PLACEMENT" });
    }

    this.#board.place(new Tile(tileId));
    this.#actionForTilePlacement(tileId);
    this.#currentPlayer.removeTile(tileId);
    return { msg: "TILE PLACED SUCCESSFULLY" };
  }

  expandHotel(tileId) {
    const tilesOnBoard = this.#board.getPlacedTiles();
    this.#hotels.expand(tileId, tilesOnBoard);
  }

  buildHotel(requestedPlayerId, hotelName) {
    if (!this.#isActivePlayer(requestedPlayerId)) {
      throw new Error({ msg: "OUT OF TURN ACTION" });
    }
    if (this.#state !== "BUILD_HOTEL") {
      throw new Error({ msg: "INVALID STATE" });
    }
    if (this.#hotels.isHotelActive(hotelName)) {
      throw new Error({ msg: "HOTEL IS ALREADY ACTIVE" });
    }
    const lastTile = this.#board.lastTile;
    const adjacentTiles = this.#board.adjacentTilesOf(lastTile);
    this.#hotels.foundHotel(hotelName, lastTile, adjacentTiles);
    this.#currentPlayer.addStocks(hotelName, 1);
    this.#state = "BUY_STOCK";
    return { msg: "HOTEL BUILT SUCCESSFULLY" };
  }

  getAdjacentHotelChainsOfTile(tile) {
    const adjacentTiles = this.#board.getAdjacentTiles(tile);
    return this.#hotels.getAdjacentHotelChains(adjacentTiles);
  }

  isDeadTile(tile) {
    const newTile = new Tile(tile);
    const adjacentHotelChains = this.getAdjacentHotelChainsOfTile(newTile);
    const stableHotels = adjacentHotelChains.filter(
      ({ tiles }) => tiles.length > 10,
    );
    return stableHotels.length > 1;
  }

  getExchangedTiles(set1, set2) {
    const removedTiles = set1.filter((tile) => !set2.includes(tile));
    const newTiles = set2.filter((tile) => !set1.includes(tile));
    return { removedTiles, newTiles };
  }

  exchangeDeadTiles() {
    const playerPreviousTiles = this.#currentPlayer.getTileIds();
    playerPreviousTiles.forEach((tile) => {
      if (this.isDeadTile(tile)) {
        this.#currentPlayer.removeTile(tile);
        this.assignNewTile();
      }
    });
    const playerNewTiles = this.#currentPlayer.getTileIds();
    const exchangedTiles = this.getExchangedTiles(
      playerPreviousTiles,
      playerNewTiles,
    );
    if (exchangedTiles.removedTiles.length !== 0) {
      this.#createNotificationData("DEAD_TILE_EXCHANGE", exchangedTiles);
    }
  }

  assignNewTile() {
    const [tile] = this.#deck.drawTiles(1);
    if (tile === undefined) return;
    if (this.isDeadTile(tile.id)) {
      return this.assignNewTile();
    }
    this.#currentPlayer.addTiles([tile]);
  }

  #createNotificationData(type, data) {
    this.#notification.type = type;
    this.#notification.data = data;
    this.#notification.playerId = this.#currentPlayer.id;
  }

  buyStocks(requestedPlayerId, cart) {
    if (!this.#isActivePlayer(requestedPlayerId)) {
      throw new Error({ msg: "OUT OF TURN ACTION" });
    }
    if (this.#state !== "BUY_STOCK") {
      throw new Error({ msg: "INVALID STATE" });
    }

    const moneyToDeduct = this.#hotels.calculateMoneyToDeduct(cart);
    const hasEnoughBalance = this.#currentPlayer.hasEnoughMoney(moneyToDeduct);
    const isValidBuy = this.#isValidPurchase(cart, moneyToDeduct) &&
      hasEnoughBalance;

    if (isValidBuy) {
      this.#hotels.deductStocks(cart);
      const hotels = this.#hotels.getHotels();
      cart.forEach(({ hotelName, selectedStocks }) =>
        this.#currentPlayer.addStocks(hotelName, selectedStocks)
      );

      this.#currentPlayer.deductMoney(moneyToDeduct);
      if (this.isGameEnd()) {
        this.#state = "END_GAME";
        return this.calculateFinalWinner();
      }
      this.#state = "SHIFT_TURN";
      const playerInfo = this.#currentPlayer.getDetails();
      this.#createNotificationData("BUYING_STOCKS", { cart });
      return { hotels, playerInfo, state: this.#state };
    }
    if (!hasEnoughBalance) {
      this.#createNotificationData("INSUFFICIENT_FUNDS", {
        hasEnoughBalance: false,
      });
    }
  }

  #areAllHotelsStable() {
    const hotels = this.#hotels.getHotels();
    //<S>  hotel.tiles.length > 1 && hotel.tiles.length >= 11 in every loop.
    const activeHotels = hotels.filter((hotel) => hotel.tiles.length > 1);
    return (
      activeHotels.length > 0 &&
      activeHotels.every((hotel) => hotel.tiles.length >= 11)
    );
  }

  #isAnyHotelHas41Tiles() {
    const hotels = this.#hotels.getHotels();
    return hotels.some((hotel) => hotel.tiles.length >= 41);
  }

  #areAllHandsEmpty() {
    return this.#players.every((player) => player.getTilesInfo().length === 0);
  }

  isGameEnd() {
    return (
      this.#areAllHotelsStable() ||
      this.#isAnyHotelHas41Tiles() ||
      this.#areAllHandsEmpty()
    );
  }

  shiftTurn(requestedPlayerId) {
    if (!this.#isActivePlayer(requestedPlayerId)) {
      throw new Error({ msg: "OUT OF TURN ACTION" });
    }
    if (this.#state !== "SHIFT_TURN") {
      throw new Error({ msg: "INVALID STATE" });
    }

    this.assignNewTile();
    this.#currentPlayer =
      this.#players[++this.#currentPlayerIndex % this.#players.length];
    this.exchangeDeadTiles();
    this.#state = "PLACE_TILE";
    return { msg: "TURN SHIFTED SUCCESSFULLY" };
  }

  handleStockDissolution(body) {
    const res = this.#mergeService.dissolveStocks(body, this.#currentPlayer);
    this.#currentPlayerIndex += 1;
    this.#currentPlayer =
      this.#players[this.#currentPlayerIndex % this.#players.length];
    return res;
  }

  getCurrentGameState() {
    const players = this.#players.map((player) => player.getDetails());
    return {
      board: this.#board.getBoardState(),
      deck: this.#deck.tiles,
      hotels: this.#hotels.getHotelsState(),
      players,
      state: this.#state,
      currentPlayerIndex: this.#currentPlayerIndex,
    };
  }

  loadGameState(data) {
    this.#state = data.state;
    this.#currentPlayer =
      data.players[data.currentPlayerIndex % data.players.length];
    this.#currentPlayerIndex = data.currentPlayerIndex;
    this.#deck.tiles = data.deck;
    this.#players = data.players;
    this.#board.loadGameState(data.board);
    this.#hotels.loadGameState(data.hotels);
  }
}

//http://localhost:8000/state?name=merge/two_equal

File: src/models/hotel.js
export class Hotel {
  #name;
  #tiles;
  #stocks;
  #priceOffset;
  #originTile;

  constructor(name, priceOffset) {
    this.#name = name;
    this.#stocks = 25;
    this.#tiles = [];
    this.#priceOffset = priceOffset;
    this.#originTile = {};
  }

  get name() {
    return this.#name;
  }

  #getNumberOfTiles() {
    const count = this.#tiles.length;

    if (count <= 5) return count;
    if (count <= 10) return 6;
    if (count <= 20) return 7;
    if (count <= 30) return 8;
    if (count <= 40) return 9;
    return 10;
  }

  addTiles(tiles) {
    this.#tiles.push(...tiles);
  }

  dissolve() {
    this.#tiles = [];
    this.#stocks = 25;
  }

  getTiles() {
    return [...this.#tiles];
  }

  setOriginTile(originTile) {
    this.#originTile = originTile;
  }

  calculateStockPrice() {
    if (this.#tiles.length === 0) return 0;
    const numberOfTiles = this.#getNumberOfTiles();
    return numberOfTiles * 100 + this.#priceOffset;
  }

  bonuses() {
    return {
      primaryBonus: this.calculateStockPrice() * 10,
      secondaryBonus: this.calculateStockPrice() * 5,
    };
  }

  getState() {
    const stockPrice = this.calculateStockPrice();
    return {
      name: this.#name,
      tiles: this.#tiles.map(({ id }) => ({ id })),
      stocksLeft: this.#stocks,
      stockPrice,
      originTile: { id: this.#originTile?.id || "" },
      isActive: this.isActive(),
    };
  }

  tileIncludes(tile) {
    return this.#tiles.some((hotelTile) => hotelTile.id === tile);
  }

  isActive() {
    return this.#tiles.length > 0;
  }

  decreaseStockCount(count) {
    this.#stocks -= count;
  }

  found(originTile, adjacentTiles) {
    this.setOriginTile(originTile);
    this.addTiles(adjacentTiles);
    this.decreaseStockCount(1);
  }

  canDeductStocksFromHotel(stocks) {
    return this.#stocks >= stocks && stocks >= 0;
  }

  getHotelState() {
    return {
      name: this.#name,
      tiles: this.#tiles,
      stocks: this.#stocks,
      priceOffset: this.#priceOffset,
      originTile: this.#originTile,
    };
  }

  loadGameState(hotelInfo) {
    this.#name = hotelInfo.name;
    this.#tiles = hotelInfo.tiles;
    this.#stocks = hotelInfo.stocks;
    this.#priceOffset = hotelInfo.priceOffset;
    this.#originTile = hotelInfo.originTile;
  }

  get primaryBonus() {
    return this.calculateStockPrice() * 10;
  }

  get secondaryBonus() {
    return this.calculateStockPrice() * 5;
  }
}

File: src/models/hotels.js
import { Hotel } from "./hotel.js";
import { Tile } from "./tile.js";

export class Hotels {
  #hotels;

  constructor(hotels) {
    this.#hotels = hotels;
  }

  getHotels() {
    return Object.values(this.#hotels).map((hotel) => hotel.getState());
  }

  getHotelEntities() {
    return Object.values(this.#hotels);
  }

  foundHotel(hotelName, originTile, adjacentTilesForHotel) {
    const adjacents = adjacentTilesForHotel.map((tileId) => new Tile(tileId));
    this.#hotels[hotelName].found(originTile, adjacents);
  }

  isAnyInActiveHotel() {
    return Object.values(this.#hotels).some((hotel) => !hotel.isActive());
  }

  isTileInAnyHotel(tileId) {
    return Object.values(this.#hotels).some((hotel) =>
      hotel.tileIncludes(tileId)
    );
  }

  getAdjacentHotelChains(tiles) {
    const adjacents = new Set(tiles);
    return this.getHotels().filter(({ tiles }) =>
      tiles.some((tile) => adjacents.has(tile.id))
    );
  }

  getHotel(hotelName) {
    return this.#hotels[hotelName];
  }

  addTilesToHotel(hotelName, tiles) {
    this.#hotels[hotelName].addTiles(tiles);
  }

  expand(tileId, tilesOnBoard) {
    const tile = new Tile(tileId);

    const hotel = Object.values(this.#hotels).find((hotel) => {
      const tiles = hotel.getTiles();

      return tiles.some((hotelTile) => hotelTile.isNeighbour(tile));
    });

    const allConnectedTiles = tile.getAllConnectedTiles(tilesOnBoard);
    const hotelTiles = hotel.getTiles().map((tile) => tile.id);
    const connectedFreeTiles = allConnectedTiles.filter(
      (connectedTile) => !hotelTiles.includes(connectedTile),
    );
    hotel.addTiles(connectedFreeTiles.map((tile) => new Tile(tile)));
    return hotel;
  }

  static instantiateHotels(hotelsInfo) {
    const hotels = hotelsInfo.reduce((hotels, { name, scale }) => {
      hotels[name] = new Hotel(name, scale);
      return hotels;
    }, {});

    return new Hotels(hotels);
  }

  deductStocks(cart) {
    cart.forEach(({ hotelName, selectedStocks }) => {
      this.#hotels[hotelName].decreaseStockCount(selectedStocks);
    });
  }

  calculateMoneyToDeduct(cart) {
    return cart.reduce(
      (calculatedMoney, { hotelName, selectedStocks }) =>
        calculatedMoney +
        this.#hotels[hotelName].calculateStockPrice() * selectedStocks,
      0,
    );
  }

  isHotelActive(hotelName) {
    return this.#hotels[hotelName].isActive();
  }

  areCartHotelsActive(cart) {
    return cart.every(({ hotelName }) => {
      return this.#hotels[hotelName].isActive();
    });
  }

  hasEnoughStocksToBuy(cart) {
    return cart.every(({ hotelName, selectedStocks }) =>
      this.#hotels[hotelName].canDeductStocksFromHotel(selectedStocks)
    );
  }

  getHotelsState() {
    return Object.values(this.#hotels).map((hotel) => hotel.getHotelState());
  }

  loadGameState(hotels) {
    hotels.forEach((hotelInfo) => {
      this.#hotels[hotelInfo.name].loadGameState(hotelInfo);
    });
  }
}

File: src/models/lobby.js
import { LOBBY_STATES, MAX_PLAYERS, MIN_PLAYERS } from "../config.js";

const { READY, WAITING, STARTED } = LOBBY_STATES;

export class Lobby {
  #minPlayers = MIN_PLAYERS;
  #maxPlayers = MAX_PLAYERS;
  #host;
  #lobbyId;
  #players;
  #lobbyState;

  constructor() {
    this.#players = new Set();
    this.#lobbyState = WAITING;
  }

  set playerId(playerId) {
    this.#players.add(playerId);
  }

  currentState(playerId) {
    if (
      this.#players.size >= this.#minPlayers && this.isHost(playerId) &&
      this.#lobbyState === WAITING
    ) {
      return READY;
    }
    return this.#lobbyState;
  }

  transitionToStart() {
    this.#lobbyState = STARTED;
  }

  set host(playerId) {
    this.#host = playerId;
  }

  isHost(playerId) {
    return this.#host === playerId;
  }

  set lobbyId(lobbyId) {
    this.#lobbyId = lobbyId;
  }

  get lobbyId() {
    return this.#lobbyId;
  }

  get activePlayerIds() {
    return [...this.#players];
  }

  isFull() {
    return this.#players.size >= this.#maxPlayers;
  }
}

File: src/models/player_session.js
export class PlayerSession {
  #sessions;
  #playerIds;
  constructor() {
    this.#sessions = new Map();
    this.#playerIds = new Map();
  }

  set session({ sessionId, playerId }) {
    this.#sessions.set(`${sessionId}`, playerId);
  }

  set playerId({ playerId, playerName }) {
    this.#playerIds.set(`${playerId}`, playerName);
  }

  getPlayerName(playerId) {
    return this.#playerIds.get(`${playerId}`);
  }

  getPlayerId(sessionId) {
    return this.#sessions.get(`${sessionId}`);
  }

  hasSessionId(sessionId) {
    return this.#sessions.has(`${sessionId}`);
  }

  hasPlayerId(playerId) {
    return this.#playerIds.has(`${playerId}`);
  }

  get playerIds() {
    return [...this.#playerIds];
  }
}

File: src/models/player.js
export class Player {
  #id;
  #name;
  #tiles;
  #money;
  #stocks;

  constructor(name, playerId) {
    this.#id = playerId;
    this.#name = name;
    this.#tiles = [];
    this.#money = 6000;
    this.#stocks = {};
  }

  get id() {
    return this.#id;
  }

  get name() {
    return this.#name;
  }

  getTilesInfo() {
    return this.#tiles.map((tile) => ({
      id: tile.id,
      isPlayable: tile.isPlayable,
    }));
  }

  getTileIds() {
    return this.#tiles.map((tile) => tile.id);
  }

  hasStock(hotelName) {
    return hotelName in this.#stocks;
  }

  isPlayerTile(tileId) {
    return this.#tiles.some((tile) => tile.id === tileId);
  }

  getStockCount(hotelName) {
    return this.#stocks[hotelName];
  }

  addInitialTiles(tiles) {
    this.#tiles.push(...tiles);
  }

  removeTile(tileId) {
    const tileIndex = this.#tiles.findIndex(({ id }) => id === tileId);
    this.#tiles.splice(tileIndex, 1);
  }

  addStocks(hotelName, noOfStocks) {
    this.#stocks[hotelName] = this.#stocks[hotelName] || 0;
    this.#stocks[hotelName] += noOfStocks;
  }

  addTiles(tile) {
    this.#tiles.push(...tile);
  }

  deductMoney(moneyToDeduct) {
    this.#money -= moneyToDeduct;
  }

  hasEnoughMoney(moneyToDeduct) {
    return moneyToDeduct <= this.#money;
  }

  getDetails() {
    return {
      id: this.#id,
      name: this.#name,
      tiles: this.getTilesInfo(),
      money: this.#money,
      stocks: { ...this.#stocks },
    };
  }

  depositMoney(money) {
    this.#money = this.#money + money;
  }

  removeHotelStocks(hotelName) {
    delete this.#stocks[hotelName];
  }

  removeStocks(hotelName, stocksCount) {
    this.#stocks[hotelName] = this.#stocks[hotelName] - stocksCount;
  }

  sellStocks(hotelName, price) {
    this.#money += price * this.#stocks[hotelName] || 0;
    delete this.#stocks[hotelName];
  }

  loadGameState(playerDetails) {
    this.#id = playerDetails.id;
    this.#name = playerDetails.name;
    this.#money = playerDetails.money;
    this.#stocks = playerDetails.stocks;
    this.#tiles = playerDetails.tiles;
  }
}

File: src/models/tile.js
export class Tile {
  #id;
  #rowLabels;
  #maxCol;
  #minCol;
  #neighbourDeltas;
  #isPlayable;
  constructor(tileId) {
    this.#maxCol = 12;
    this.#minCol = 1;
    this.#rowLabels = "abcdefghi";
    this.#id = tileId;
    this.#neighbourDeltas = [
      { columnDelta: 1, rowDelta: 0 },
      { columnDelta: -1, rowDelta: 0 },
      { columnDelta: 0, rowDelta: 1 },
      { columnDelta: 0, rowDelta: -1 },
    ];
    this.#isPlayable = true;
  }

  get id() {
    return this.#id;
  }

  get isPlayable() {
    return this.#isPlayable;
  }

  set isPlayable(value) {
    this.#isPlayable = value;
  }

  #getRowIndex(row) {
    return this.#rowLabels.indexOf(row);
  }

  #isValidColumn(col) {
    return col >= this.#minCol && col <= this.#maxCol;
  }

  #isValidRow(row) {
    return this.#getRowIndex(row) !== -1;
  }

  #parseTileId(tileId) {
    return { col: Number(tileId.slice(0, -1)), row: tileId.slice(-1) };
  }

  #getUpdatedRow(row, rowDelta) {
    const rowIndex = this.#getRowIndex(row);
    return this.#rowLabels[rowIndex + rowDelta];
  }

  #getUpdatedPosition({ columnDelta, rowDelta }) {
    const { col, row } = this.#parseTileId(this.id);

    return {
      newColumn: col + columnDelta,
      newRow: this.#getUpdatedRow(row, rowDelta),
    };
  }

  #getNeighbour(delta) {
    const { newColumn, newRow } = this.#getUpdatedPosition(delta);

    return this.#isValidRow(newRow) && this.#isValidColumn(newColumn)
      ? `${newColumn}${newRow}`
      : null;
  }

  neighbourTiles() {
    return this.#neighbourDeltas
      .map((delta) => this.#getNeighbour(delta))
      .filter(Boolean);
  }

  isNeighbour(tile) {
    return this.neighbourTiles().includes(tile.id);
  }

  getAllConnectedTiles(tilesOnBoard, connectedTiles = []) {
    if (connectedTiles.includes(this.id)) return connectedTiles;

    connectedTiles.push(this.id);
    this.neighbourTiles().forEach((tile) => {
      if (tilesOnBoard.some((tileOnBoard) => tileOnBoard.id === tile)) {
        const tileInstance = new Tile(tile);
        tileInstance.getAllConnectedTiles(tilesOnBoard, connectedTiles);
      }
    });

    return connectedTiles;
  }
}

File: src/routes/game_router.js
import { Hono } from "hono";
import { GameController } from "../controllers/game_controller.js";

export const createGameRouter = () => {
  const game = new Hono();
  const controller = new GameController();

  game.get("/start-game", controller.startGame);
  game.get("/join-game", controller.redirectToGame);

  return game;
};

File: src/routes/lobby_router.js
import { Hono } from "hono";
import { LobbyController } from "../controllers/lobby_controller.js";

export const createLobbyRouter = () => {
  const lobby = new Hono();
  const controller = new LobbyController();

  lobby.get("/host", controller.hostLobby);
  lobby.get("/join", controller.redirectToJoinLobby);
  lobby.post("/join-lobby", controller.joinLobby);
  lobby.get("/lobby-details", controller.lobbyDetails);

  return lobby;
};

File: src/routes/login_router.js
import { Hono } from "hono";
import { LoginController } from "../controllers/login_controller.js";

const counter = () => {
  let i = 0;
  return () => {
    i++;
    return i + "";
  };
};

export const createLoginRouter = () => {
  const login = new Hono();
  const controller = new LoginController(counter());

  login.post(
    "/login",
    async (c) => {
      const formData = await c.req.formData();
      return controller.login(c, formData);
    },
  );
  login.get("/redirect-login", controller.redirectToLogin);
  login.get("/get-player-name", controller.getPlayerName);

  return login;
};

File: src/routes/merge_router.js
import { Hono } from "hono";
import {
  equalHotelMergeHandler,
  handleStockDissolution,
} from "../handlers/merge_handlers.js";
export const merge = new Hono();

merge.post("/two-equal-merge", equalHotelMergeHandler);

merge.post("/dissolve", handleStockDissolution);

File: src/routes/turn_router.js
import { Hono } from "hono";
import { TurnController } from "../controllers/turn_controller.js";

export const createTurnRouter = () => {
  const turn = new Hono();
  const turnController = new TurnController();

  turn.post("/place-tile", turnController.placeTile);
  turn.post("/build-hotel", turnController.buildHotel);
  turn.post("/buy-stocks", turnController.buyStocks);
  turn.get("/current-state", turnController.currentState);
  return turn;
};

File: src/services/dissolution_controller.js
export const stakeHolders = (players, hotelName) => {
  return players.filter((player) => player.hasStock(hotelName));
};

export const sellStocks = (stakeholder, defunctHotel) => {
  stakeholder.sellStocks(defunctHotel.name, defunctHotel.calculateStockPrice());
};

const topStakeHolders = (hotelName, stakeholders, bucket = []) => {
  for (let index = 1; index < stakeholders.length; index++) {
    const stakeholder = stakeholders[index];
    if (
      stakeholder.getStockCount(hotelName) !==
        bucket.at(-1).getStockCount(hotelName)
    ) {
      return index;
    }
    bucket.push(stakeholder);
  }
};

export const distributeBonus = (stakeholders, defunctHotel) => {
  const { primaryBonus, secondaryBonus } = defunctHotel.bonuses();

  stakeholders.sort(
    (a, b) =>
      b.getStockCount(defunctHotel.name) - a.getStockCount(defunctHotel.name),
  );

  if (stakeholders.length === 1) {
    stakeholders[0].depositMoney(primaryBonus + secondaryBonus);
    return;
  }

  const primaryHolders = [stakeholders[0]];
  const lastPrimary = topStakeHolders(
    defunctHotel.name,
    stakeholders,
    primaryHolders,
  );

  if (primaryHolders.length > 1) {
    const bonusSum = primaryBonus + secondaryBonus;
    const bonus = bonusSum / primaryHolders.length;
    primaryHolders.forEach((stakeholder) => stakeholder.depositMoney(bonus));
    return;
  }
  const secondaryStakeholder = [stakeholders[lastPrimary]];
  topStakeHolders(
    defunctHotel.name,
    stakeholders.slice(lastPrimary),
    secondaryStakeholder,
  );
  primaryHolders[0].depositMoney(primaryBonus);
  const dividedSecondaryBonus = secondaryBonus / secondaryStakeholder.length;
  secondaryStakeholder.forEach((s) => s.depositMoney(dividedSecondaryBonus));
};

File: src/services/merge_service.js
import { MERGE_STATE } from "../configs/merge_states.js";

export default class MergeService {
  #turnOrder;
  #currentDissolver;
  #mergeState;
  #affectedHotels;
  #players;
  #hotels;
  #board;
  #survivingHotel;
  #defunctHotel;
  #defuntHotelStakeHolders;
  #bonusHolderDetails = [];

  constructor(affectedHotels, players, hotels, board) {
    this.#players = players;
    this.#affectedHotels = affectedHotels;
    this.#hotels = hotels;
    this.#board = board;
    this.#turnOrder = 0;
  }

  #sellAllStocks(stakeholders, price, hotelName) {
    stakeholders.forEach((stakeholder) =>
      stakeholder.sellStocks(hotelName, price)
    );
  }

  #topStakeHolders(hotelName, stakeholders, bucket = []) {
    for (let index = 1; index < stakeholders.length; index++) {
      const stakeholder = stakeholders[index];
      if (
        stakeholder.getStockCount(hotelName) !==
          bucket.at(-1).getStockCount(hotelName)
      ) {
        return index;
      }
      bucket.push(stakeholder);
    }
  }

  #distributeBonus(stakeholders, defunctHotel) {
    const { primaryBonus, secondaryBonus } = defunctHotel.bonuses();
    stakeholders.sort(
      (a, b) =>
        b.getStockCount(defunctHotel.name) -
        a.getStockCount(defunctHotel.name),
    );
    if (stakeholders.length === 1) {
      stakeholders[0].depositMoney(primaryBonus + secondaryBonus);
      const name = stakeholders[0].name;
      this.#bonusHolderDetails.push({
        name,
        amount: primaryBonus + secondaryBonus,
        type: "primary",
      });
      return;
    }

    const primaryHolders = [stakeholders[0]];
    const lastPrimary = this.#topStakeHolders(
      defunctHotel.name,
      stakeholders,
      primaryHolders,
    );

    if (primaryHolders.length > 1) {
      const bonusSum = primaryBonus + secondaryBonus;
      const bonus = bonusSum / primaryHolders.length;
      primaryHolders.forEach((stakeholder) => stakeholder.depositMoney(bonus));
      this.#bonusHolderDetails = primaryHolders.map((stakeholders) => ({
        name: stakeholders.name,
        amount: bonus,
        type: "primary",
      }));
      return;
    }
    const secondaryStakeholder = [stakeholders[lastPrimary]];
    this.#topStakeHolders(
      defunctHotel.name,
      stakeholders.slice(lastPrimary),
      secondaryStakeholder,
    );
    primaryHolders[0].depositMoney(primaryBonus);
    const dividedSecondaryBonus = secondaryBonus / secondaryStakeholder.length;
    secondaryStakeholder.forEach((s) => s.depositMoney(dividedSecondaryBonus));
    this.#bonusHolderDetails.push({
      name: primaryHolders[0].name,
      amount: primaryBonus,
      type: "primary",
    });
    const secondaryHolderDetails = secondaryStakeholder.map((stakeholders) => ({
      name: stakeholders.name,
      amount: dividedSecondaryBonus,
      type: "secondary",
    }));
    this.#bonusHolderDetails.push(...secondaryHolderDetails);
  }

  #stakeHolders(hotelName) {
    return this.#players.filter((player) => player.hasStock(hotelName));
  }

  #detectMergeType(firstHotel, secondHotel) {
    if (firstHotel.getTiles().length === secondHotel.getTiles().length) {
      this.#mergeState = MERGE_STATE.equal;
      return;
    }

    this.#mergeState = MERGE_STATE.unequal;
  }

  get mergeState() {
    return this.#mergeState;
  }

  #mergeTwoEqual({ hotelName }) {
    if (this.#defunctHotel.name !== hotelName) {
      const temp = this.#survivingHotel;
      this.#survivingHotel = this.#defunctHotel;
      this.#defunctHotel = temp;
    }
    this.#defuntHotelStakeHolders = this.#stakeHolders(this.#defunctHotel.name);
    this.#mergeHotels();
  }

  #mergeTwoUnequal() {
    this.#defuntHotelStakeHolders = this.#stakeHolders(this.#defunctHotel.name);
    this.#mergeHotels();
    this.#mergeState = MERGE_STATE.dissolution;
  }

  handleMerge(data) {
    if (this.#mergeState === MERGE_STATE.equal) {
      this.#mergeTwoEqual(data);
      this.#mergeState = MERGE_STATE.dissolution;
      return { sucess: true };
    }
    this.#mergeTwoUnequal();
  }

  #mergeHotels() {
    this.#survivingHotel.addTiles([
      ...this.#defunctHotel.getTiles(),
      this.#board.lastTile,
    ]);
    this.#distributeBonus(this.#defuntHotelStakeHolders, this.#defunctHotel);
    this.#defunctHotel.dissolve();
  }

  #sellStocks({ sell_count }) {
    const hotelName = this.#defunctHotel.name;
    const currentStockPrice = this.#defunctHotel.calculateStockPrice();
    const stockValue = sell_count * currentStockPrice;
    this.#currentDissolver.removeStocks(hotelName, sell_count);
    this.#currentDissolver.depositMoney(stockValue);
  }

  dissolveStocks(data, currentPlayer) {
    this.#currentDissolver = currentPlayer;
    this.#sellStocks(data);
    this.#turnOrder += 1;
    if (this.#turnOrder >= this.#defuntHotelStakeHolders.length) {
      this.#mergeState = "END_MERGE";
    }
    return { "sucess": true };
  }

  getBonusHoldersDetails() {
    return this.#bonusHolderDetails;
  }

  init() {
    const sortedHotels = this.#affectedHotels.sort(
      (a, b) => a.tiles.length - b.tiles.length,
    );
    const [defunctHotel, survivingHotel] = sortedHotels.map((hotel) =>
      this.#hotels.getHotel(hotel.name)
    );
    this.#defunctHotel = defunctHotel;
    this.#survivingHotel = survivingHotel;
    this.#detectMergeType(this.#defunctHotel, this.#survivingHotel);
    if (this.#mergeState === MERGE_STATE.unequal) {
      this.#mergeTwoUnequal();
    }
  }
}
