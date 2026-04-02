const createTileElement = (tile) => {
  const tileContainer = document.createElement("div");
  tileContainer.classList.add("tile");
  tileContainer.id = `tile-${tile}`;
  const p = document.createElement("p");
  p.textContent = tile;
  tileContainer.append(p);
  return tileContainer;
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

const extractSelectedStocks = (cart, hotelHeader) => {
  const selectedStocks = parseInt(
    hotelHeader.querySelector("span").innerText,
  );
  const hotelName = hotelHeader.querySelector(".hotel-name").innerText;
  if (selectedStocks > 0) {
    cart.push({ hotelName, selectedStocks });
  }
  return cart;
};

const handleBuyStocks = (e) => {
  e.preventDefault();
  const listOfHotelHeader = document.querySelectorAll(".hotel-card-header");
  const cart = [...listOfHotelHeader].reduce(extractSelectedStocks, []);
  return cart;
};

const createTradeConfirmationBtn = () => {
  const buttonContainer = document.createElement("div");
  buttonContainer.classList.add("button-container");
  const button = cloneElement("#button");
  button.textContent = "Found";
  button.id = "found";
  button.classList.add("hidden");
  button.addEventListener("click", handleBuyStocks);
  buttonContainer.append(button);
  return buttonContainer;
};

const cloneElement = (templateId) => {
  const template = document.querySelector(templateId);
  return template.content.querySelector("*").cloneNode(true);
};

const addHotelData = (hotelName, value, bankSection) => {
  const name = hotelName;
  const hotelCard = cloneElement("#hotel-card");
  hotelCard.setAttribute("id", name);
  const hotelContainer = hotelCard.querySelector(".hotel-container");
  hotelContainer.classList.add(`${name}-icon`);
  hotelCard.querySelector(".hotel-name").textContent = hotelName;
  hotelCard.querySelector("#price").textContent = `$ ${value.price}`;
  hotelCard.querySelector("#tiles").textContent = `🧱 ${value.tiles.length}`;
  hotelCard.querySelector("#stock-left").textContent = `📈 ${value.stocks}`;

  bankSection.append(hotelCard);
};

export const renderBankSection = (hotels) => {
  const bankSection = document.querySelector(".bank");
  Object.entries(hotels).forEach(([key, value]) =>
    addHotelData(key, value, bankSection)
  );

  const button = createTradeConfirmationBtn();
  bankSection.append(button);
};

export const renderUserSection = ({ amount, playerTiles }) => {
  renderTilesInHand(playerTiles);
  displayInitialAmount(amount);
};
