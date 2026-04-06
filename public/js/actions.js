import { buildAHotel } from "./features/hotel_foundation.js";
import { expandHotel } from "./features/expand_hotel.js";

export const turnActions = {
  BUILD_HOTEL: buildAHotel,
  EXPAND_HOTEL: expandHotel,
  NO_ACTION: () => "",
};
