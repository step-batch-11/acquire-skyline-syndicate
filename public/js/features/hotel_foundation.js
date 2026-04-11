import { gameState, postData } from "../request.js";
import { cloneElement } from "../ui_renderers.js";

export const createElement = (element, className) => {
  const container = document.createElement(element);
  container.classList.add(className);
  return container;
};

export const buildAHotel = (gameData) => {
  const contextMenu = document.querySelector(".context-menu");
  const buildHotelContainer = createElement("div", "build-hotel-container");
  const hotelsSection = createElement("div", "hotels-section");
  const hotelsContainer = createElement("div", "hotels-container");

  const operationElement = document.createElement("p");
  operationElement.textContent = "Build A Hotel";

  const buildHotelButton = createElement("button", "build-btn");
  buildHotelButton.textContent = "Select Hotel";

  const hotels = gameData.hotels.map(({ name, isActive }) => {
    const foundHotelTemplate = cloneElement("#found-hotel");
    const nameElement = foundHotelTemplate.querySelector(".name");
    const icon = foundHotelTemplate.querySelector(".icon");

    nameElement.textContent = name;
    icon.classList.add(`${name}-icon`);
    foundHotelTemplate.id = name;
    foundHotelTemplate.classList.add(`${name}-info`);
    foundHotelTemplate.classList.add(isActive ? "active" : "inactive");
    return foundHotelTemplate;
  });

  hotelsContainer.append(...hotels);
  hotelsSection.append(hotelsContainer, buildHotelButton);
  buildHotelContainer.append(hotelsSection);
  contextMenu.replaceChildren(operationElement, buildHotelContainer);

  new HotelFoundationState().init();
};

class HotelFoundationState {
  #selectedHotel;
  #previouslySelectedHotel;
  #buildBtn;
  constructor() {
    this.#selectedHotel = null;
  }

  init() {
    this.#buildBtn = document.querySelector(".build-btn");
    this.#setupSelectHotel();
    this.#setupFoundHotel();
  }

  #handleHotelSelection(e) {
    e.preventDefault();
    const selectedHotel = e.target.closest(".found-hotel-container");
    this.#previouslySelectedHotel &&
      this.#previouslySelectedHotel.classList.remove("selected");
    selectedHotel.classList.add("selected");

    this.#previouslySelectedHotel = selectedHotel;
    return selectedHotel.classList.contains("active") ? null : selectedHotel.id;
  }

  async #handleHotelFoundation(e, hotelToFound) {
    e.preventDefault();
    if (!hotelToFound) return;
    await postData("/turn/build-hotel", {
      hotelToFound,
    });

    await gameState();
  }

  #setupSelectHotel() {
    const buildHotelContainer = document.querySelector(
      ".build-hotel-container",
    );
    buildHotelContainer.addEventListener("click", (e) => {
      this.#selectedHotel = this.#handleHotelSelection(e);
      this.#buildBtn.textContent = this.#selectedHotel
        ? `Build ${this.#selectedHotel}`
        : "Select Hotel";
    });

    const buttonContainer = document.createElement("div");
    buttonContainer.classList.add("button-container");
  }

  #setupFoundHotel() {
    const buildHotelContainer = document.querySelector(
      ".build-hotel-container",
    );
    this.#buildBtn.addEventListener("click", (e) => {
      if (this.#selectedHotel) {
        this.#handleHotelFoundation(e, this.#selectedHotel);
        buildHotelContainer.removeEventListener(
          "click",
          this.#handleHotelSelection,
        );
      }
    });
  }
}
