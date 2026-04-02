import { postData } from "./request.js";
import { handleAssignTile, handleTilePlacement } from "./event_handlers.js";
import { canPlaceTile } from "./validators.js";

const hotelFoundationListener = (
  e,
  hotelToFound,
  tileContainer,
  bankContainer,
) => {
  e.preventDefault();
  postData("/build-hotel", { hotelToFound });
  tileContainer.classList.add(`${hotelToFound}-icon`);
  bankContainer.removeEventListener("click", selectHotel);
  handleAssignTile();
};

export const buildAHotel = (tileContainer) => {
  alert("build hotel");
  const bankContainer = document.querySelector(".bank");
  const foundBtn = bankContainer.querySelector("#found");
  foundBtn.classList.remove("hidden");
  let hotelToFound = "";
  const selectHotel = (e) => {
    e.preventDefault();
    hotelToFound = event.target.parentNode.id;
  };
  foundBtn.addEventListener(
    "click",
    (e) =>
      hotelFoundationListener(e, hotelToFound, tileContainer, bankContainer),
  );
  bankContainer.addEventListener("click", selectHotel);
};

export const eventsForPlacingATile = {
  "build hotel": buildAHotel,
  nothing: () => "",
};

export const addListenerToBoard = (tilesInPlayerHand) => {
  const board = document.querySelector(".board");

  const tileSelectionListener = (event) => {
    const tileContainer = event.target.closest("div");
    if (canPlaceTile(tileContainer, tilesInPlayerHand)) {
      handleTilePlacement(board, tileContainer, tilesInPlayerHand);
      board.removeEventListener("click", tileSelectionListener);
    }
  };

  board.addEventListener("click", tileSelectionListener);
};
