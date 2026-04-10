import { postData } from "../request.js";
import {
  cloneElement,
  createBuildHotelsBtn,
  renderBankSection,
  renderBoard,
  renderHeldStocks,
} from "../ui_renderers.js";

// export const buildAHotel = (tileContainer) => {
//   const allHotels = document.querySelectorAll(".hotel-container");
//   Array.from(allHotels).forEach((hotel) => {
//     if (!hotel.classList.contains("active")) hotel.classList.add("inactive");
//   });

//   new HotelFoundationState(tileContainer).init();
// };

const createElement = (element, className) => {
  const container = document.createElement(element);
  container.classList.add(className);
  return container;
}

export const buildAHotel = (gameData) => {
  const contextMenu = document.querySelector(".context-menu");
  const buildHotelContainer = createElement("div", "build-hotel-container");
  const hotelsSection = createElement("div", "hotels-section");
  const hotelsContainer = createElement("div", "hotels-container");

  const operationElement = document.createElement("p");
  operationElement.textContent = 'Build A Hotel';

  const buildHotelButton = createElement("button", "build-btn");
  buildHotelButton.textContent = 'Build';

  const hotels = gameData.hotels.map(({ name, isActive }) => {
    const foundHotelTemplate = cloneElement("#found-hotel");
    const nameElement = foundHotelTemplate.querySelector(".name");
    const icon = foundHotelTemplate.querySelector(".icon");
    nameElement.textContent = name;
    icon.classList.add(`${name}-icon`);
    foundHotelTemplate.classList.add(`${name}-info`);
    foundHotelTemplate.classList.add(isActive ? "active" : "inactive");
    return foundHotelTemplate;
  });

  hotelsContainer.append(...hotels);
  hotelsSection.append(hotelsContainer, buildHotelButton);
  buildHotelContainer.append( hotelsSection);
  contextMenu.append(operationElement, buildHotelContainer);
  
  // const allHotels = document.querySelectorAll(".hotel-container");
  // Array.from(allHotels).forEach((hotel) => {
  //   if (!hotel.classList.contains("active")) hotel.classList.add("inactive");
  // });

  new HotelFoundationState().init();
};

class HotelFoundationState {
  #selectedHotel;
  #previouslySelectedHotel;

  constructor() {
    this.#selectedHotel = null;
  }

  init() {
    this.#setupSelectHotel();
    this.#setupFoundHotel();
  }

  #handleHotelSelection(e) {
    e.preventDefault();
    const selectedHotel = e.target;
    this.#previouslySelectedHotel &&
      this.#previouslySelectedHotel.classList.remove("selected");
    if (selectedHotel.classList.contains("found-hotel-container")) {
      selectedHotel.classList.add("selected");
    }
    this.#previouslySelectedHotel = selectedHotel;
    return selectedHotel.classList.contains("active")
      ? null
      : selectedHotel.parentNode.id;
  }

  async #handleHotelFoundation(e, hotelToFound) {
    e.preventDefault();
    if (!hotelToFound) return;
    const response = await postData("/turn/build-hotel", {
      hotelToFound,
    });

    const { hotels, tilesOnBoard, currentPlayer } = response;
    renderBankSection(hotels);
    renderBoard(tilesOnBoard, hotels);
    renderHeldStocks(currentPlayer.stocks);
  }

  #setupSelectHotel() {
    const bankContainer = document.querySelector(".bank");
    bankContainer.addEventListener("click", (e) => {
      this.#selectedHotel = this.#handleHotelSelection(e);
    });

    const buttonContainer = document.createElement("div");
    buttonContainer.classList.add("button-container");
    const buildBtn = createBuildHotelsBtn(buttonContainer);
    bankContainer.append(buildBtn);
  }

  #setupFoundHotel() {
    const bankContainer = document.querySelector(".bank");
    const foundBtn = bankContainer.querySelector("#found");
    foundBtn.classList.remove("hidden");
    foundBtn.addEventListener("click", (e) => {
      if (this.#selectedHotel) {
        this.#handleHotelFoundation(e, this.#selectedHotel);
        foundBtn.classList.add("hidden");
        bankContainer.removeEventListener("click", this.#handleHotelSelection);
      }
    });
  }
}
