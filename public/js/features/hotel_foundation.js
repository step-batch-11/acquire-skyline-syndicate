import { postData } from "../request.js";
import {
  renderBankSection,
  renderBoard,
  renderHeldStocks,
} from "../ui_renderers.js";

export const buildAHotel = (tileContainer) => {
  alert("build hotel");

  const allHotels = document.querySelectorAll(".hotel-container");
  Array.from(allHotels).forEach((hotel) => {
    if (!hotel.classList.contains("active")) hotel.classList.add("inactive");
  });

  new HotelFoundationState(tileContainer).init();
};

class HotelFoundationState {
  #selectedHotel;
  #tileContainer;
  #previouslySelectedHotel;

  constructor(tileContainer) {
    this.#selectedHotel = null;
    this.#tileContainer = tileContainer;
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
    if (selectedHotel.classList.contains("hotel-container")) {
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
  }

  #setupFoundHotel() {
    const bankContainer = document.querySelector(".bank");
    const foundBtn = bankContainer.querySelector("#found");
    foundBtn.classList.remove("hidden");
    foundBtn.addEventListener("click", (e) => {
      if (this.#selectedHotel) {
        this.#handleHotelFoundation(
          e,
          this.#selectedHotel,
          this.#tileContainer,
          bankContainer,
        );
        foundBtn.classList.add("hidden");
        bankContainer.removeEventListener("click", this.#handleHotelSelection);
      }
    });
  }
}
