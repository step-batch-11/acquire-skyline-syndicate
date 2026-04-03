import { describe, it } from "@std/testing/bdd";
import { assertEquals } from "@std/assert";
import { Hotels } from "../../src/models/hotels.js";

describe("Hotels entity tests", () => {
  describe("get hotels method", () => {
    it("should return the information about all the hotels", () => {
      const hotels = [{ name: "sackson", scale: 0 }, {
        name: "Tower",
        scale: 0,
      }];
      const hotelsInstance = Hotels.instantiateHotels(hotels);
      const hotelsInfo = hotelsInstance.getHotels();
      assertEquals(hotelsInfo.length, 2);
      assertEquals(hotelsInfo[0].name, "sackson");
      assertEquals(hotelsInfo[1].name, "Tower");
    });
  });
});
