import { beforeEach, describe, it } from "@std/testing/bdd";
import { assertEquals } from "@std/assert";
import { Hotel } from "../../src/models/hotel.js";
import { Tile } from "../../src/models/tile.js";

describe("Hotel entity tests", () => {
  describe("getState", () => {
    it("Should return the details about the hotel", () => {
      const hotelName = "Tower";
      const scale = 0;
      const hotel = new Hotel(hotelName, scale);
      const hotelDetails = hotel.getState();
      assertEquals(hotelDetails.name, hotelName);
      assertEquals(hotelDetails.stocksLeft, 25);
    });
  });

  let tiles;
  describe("tileIncludes", () => {
    beforeEach(() => {
      tiles = ["2a", "1a"].map((id) => new Tile(id));
    });
    it("should return true if tile is part of hotel", () => {
      const hotel = new Hotel("sackson", 0);
      hotel.addTiles(tiles);

      const adjacentTile = "2a";

      assertEquals(hotel.tileIncludes(adjacentTile), true);
    });
    it("should return false if tile is not part of hotel", () => {
      const hotel = new Hotel("sackson", 0);
      hotel.addTiles(tiles);

      const adjacentTile = "7a";

      assertEquals(hotel.tileIncludes(adjacentTile), false);
    });
    it("decrease the hotel stocks", () => {
      const hotelName = "Sackson";
      const scale = 0;
      const hotel = new Hotel(hotelName, scale);
      hotel.decreaseStockCount(2);
      const hotelDetails = hotel.getState();
      assertEquals(hotelDetails.name, hotelName);
      assertEquals(hotelDetails.stocksLeft, 23);
    });
  });
});
