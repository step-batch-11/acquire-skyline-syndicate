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
    const selectedHotel = event.target;
    console.log(selectedHotel);
    if (selectedHotel.classList.contains("active")) {
      return null;
    }
    return selectedHotel.parentNode.id;
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
      this.#handleHotelFoundation(
        e,
        this.#selectedHotel,
        this.#tileContainer,
        bankContainer,
      );
      bankContainer.removeEventListener("click", this.#handleHotelSelection);
    });
  }
}
