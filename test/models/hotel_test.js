import { describe, it } from "@std/testing/bdd";
import { assertEquals } from "@std/assert";
import { Hotel } from "../../src/models/hotel.js";

describe("Hotel entity tests", () => {
  describe("get state method", () => {
    it("Should return the details about the hotel", () => {
      const hotelName = "Tower";
      const scale = 0;
      const hotel = new Hotel(hotelName, scale);
      const hotelDetails = hotel.getState();
      assertEquals(hotelDetails.name, hotelName);
      assertEquals(hotelDetails.tileCount, 0);
      assertEquals(hotelDetails.stocksLeft, 25);
    });
  });
});
