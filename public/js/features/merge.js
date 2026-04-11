import { cloneElement } from "../ui_renderers.js";
import { postData } from "../request.js";

export const MERGE_STATE = {
  equal: "EQUAL_HOTEL_MERGE",
  unequal: "UNEQUAL_HOTEL_MERGE",
  dissolution: "STOCK_DISSOLUTION",
};

export const renderStockDissolution = () => {
  const contextMenu = document.querySelector(".context-menu");
  const tradeElement = cloneElement("#stock-dissolution");
  const dissolveBtn = tradeElement.querySelector("#dissolve-btn");
  const sellCounter = tradeElement.querySelector("#sell-counter");
  const exchangeCounter = tradeElement.querySelector("#exchange-counter");
  customElements.whenDefined("counter-btn").then(() => {
    // const exchangeCounter = tradeElement.querySelector("#exchange-counter");
    exchangeCounter.setDelta(2);
  });

  dissolveBtn.addEventListener("click", async () => {
    const tradeQuantities = {
      sell_count: sellCounter.count,
      exchange_count: exchangeCounter.count,
    };
    const res = await postData("/merge/dissolve", tradeQuantities);
    if (res.sucess) contextMenu.innerHTML = "";
  });
  contextMenu.replaceChildren(tradeElement);
};

export const renderEqualMerge = () => {
  const dissolvingHotelPopup = cloneElement("#chooseDissolvingHotel");
  const contextMenu = document.querySelector(".context-menu");
  const hotel1 = dissolvingHotelPopup.querySelector("#hotel-1");
  const hotel2 = dissolvingHotelPopup.querySelector("#hotel-2");
  contextMenu.replaceChildren(dissolvingHotelPopup);

  hotel1.addEventListener("click", async () => {
    await postData("/merge/two-equal-merge", {
      hotelName: hotel1.textContent,
    });
  });

  hotel2.addEventListener("click", async () => {
    await postData("/merge/two-equal-merge", {
      hotelName: hotel2.textContent,
    });
  });
};
