import { beforeEach, describe, it } from "@std/testing/bdd";
import { assertEquals } from "@std/assert";
import { Hotels } from "../../src/models/hotels.js";
import { Tile } from "../../src/models/tile.js";

let hotelsInstance;

describe("Hotels entity tests", () => {
  beforeEach(() => {
    const hotels = [
      { name: "sackson", scale: 0 },
      { name: "Tower", scale: 0 },
    ];
    hotelsInstance = Hotels.instantiateHotels(hotels);
  });
  describe("get hotels method", () => {
    it("should return the information about all the hotels", () => {
      const hotelsInfo = hotelsInstance.getHotels();
      assertEquals(hotelsInfo.length, 2);
      assertEquals(hotelsInfo[0].name, "sackson");
      assertEquals(hotelsInfo[1].name, "Tower");
    });
  });

  describe("isTileInAnyHotel", () => {
    it("should return true if tile is part of any of the hotels", () => {
      const tilesOfTower = ["2a", "1a"].map((id) => new Tile(id));
      hotelsInstance.addTilesToHotel("Tower", tilesOfTower);
      assertEquals(hotelsInstance.isTileInAnyHotel("2a"), true);
    });
    it("should return false if tile is not part of any of the hotels", () => {
      const tilesOfTower = ["2a", "1a"].map((id) => new Tile(id));
      hotelsInstance.addTilesToHotel("Tower", tilesOfTower);
      assertEquals(hotelsInstance.isTileInAnyHotel("9a"), false);
    });
  });
});
