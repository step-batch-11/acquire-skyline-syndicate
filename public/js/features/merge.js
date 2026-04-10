import { cloneElement } from "../ui_renderers.js";
import { postData } from "../request.js";

export const MERGE_STATE = {
  equal: "EQUAL_HOTEL_MERGE",
  unequal: "UNEQUAL_HOTEL_MERGE",
  dissolution: "STOCK_DISSOLUTION",
};

const renderEqualMerge = () => {
  const dissolvingHotelPopup = cloneElement("#chooseDissolvingHotel");
  const body = document.querySelector("body");
  body.appendChild(dissolvingHotelPopup);
  const hotel1 = document.querySelector("#hotel-1");
  const hotel2 = document.querySelector("#hotel-2");
  hotel1.addEventListener("click", async () => {
    const response = await postData("/merge/two-equal-merge", {
      hotelName: hotel1.textContent,
    });

    if (response.sucess === true) {
      body.removeChild(dissolvingHotelPopup);
    }
  });

  hotel2.addEventListener("click", () => {
    const response = postData("/merge/two-equal-merge", {
      hotelName: hotel2.textContent,
    });
    if (response.sucess === true) {
      body.removeChild(dissolvingHotelPopup);
    }
  });
};

export const handleMerge = (gameData) => {
  const mergeState = gameData.mergeData.mergeState;
  if (mergeState === MERGE_STATE.equal) renderEqualMerge();
};
