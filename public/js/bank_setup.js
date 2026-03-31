const cloneElement = (templateId) => {
  const template = document.querySelector(templateId);
  return template.content.querySelector("*").cloneNode(true);
};

const addHotelData = (hotelName, value, bankSection) => {
  const name = hotelName.toLowerCase();
  const hotelCard = cloneElement("#hotel-card");
  hotelCard.setAttribute("id", name);
  const hotelContainer = hotelCard.querySelector(".hotel-container");
  hotelContainer.classList.add(`${name}-icon`);
  hotelCard.querySelector("#hotel-name").textContent = hotelName;
  hotelCard.querySelector("#price").textContent = `$ ${value.price}`;
  hotelCard.querySelector("#tiles").textContent = `🧱 ${value.tiles.length}`;
  hotelCard.querySelector("#stock-left").textContent = `📈 ${value.stocks}`;

  bankSection.append(hotelCard);
};

const renderBankSection = (hotels) => {
  const bankSection = document.querySelector(".bank");
  Object.entries(hotels).forEach(([key, value]) =>
    addHotelData(key, value, bankSection)
  );

  const button = cloneElement("#button");
  button.textContent = "confirm";
  button.id = "confirm";
  bankSection.append(button);
};

export const initBank = (hotels) => {
  renderBankSection(hotels);
};
