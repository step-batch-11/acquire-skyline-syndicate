import { handleClickActions } from "./handlers.js";

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
  const button = cloneElement("#button");
  button.textContent = "confirm";
  button.id = "confirm";
  button.addEventListener("click", handleBuyStocks);
  return button;
};

const renderBankSection = (hotels) => {
  const bankSection = document.querySelector(".bank");
  Object.entries(hotels).forEach(([key, value]) =>
    addHotelData(key, value, bankSection)
  );

  const button = createTradeConfirmationBtn();
  bankSection.append(button);
};

export const initBank = (hotels) => {
  renderBankSection(hotels);
  const bank = document.querySelector(".bank");
  bank.addEventListener("click", handleClickActions);
};
