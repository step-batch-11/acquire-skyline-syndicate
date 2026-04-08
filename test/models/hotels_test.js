import { beforeEach, describe, it } from "@std/testing/bdd";
import { assertEquals } from "@std/assert";
import { Hotels } from "../../src/models/hotels.js";
import { Tile } from "../../src/models/tile.js";

// why outside?
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
      const tilesOfTower = ["1a", "2a"].map((id) => new Tile(id));
      hotelsInstance.addTilesToHotel("Tower", tilesOfTower);
      assertEquals(hotelsInstance.isTileInAnyHotel("9a"), false);
    });
  });

  describe("decreaseHotelStocks", () => {
    it("decrease the hotel stocks in the hotel inventory", () => {
      const hotels = [
        { name: "sackson", scale: 0 },
        {
          name: "Tower",
          scale: 0,
        },
      ];

      const hotelsInstance = Hotels.instantiateHotels(hotels);
      hotelsInstance.deductStocks([
        { hotelName: "sackson", selectedStocks: 2 },
      ]);

      const hotelsInfo = hotelsInstance.getHotels();
      assertEquals(hotelsInfo[0].name, "sackson");
      assertEquals(hotelsInfo[0].stocksLeft, 23);
    });
  });

  describe("expand", () => {
    it("should add tile into its adjacent hotel chain", () => {
      const tilesOfTower = ["2a", "1a"].map((id) => new Tile(id));
      hotelsInstance.addTilesToHotel("Tower", tilesOfTower);
      const tilesOnBoard = [{ id: "1a" }, { "id": "2a" }];
      const updatedHotel = hotelsInstance.expand("3a", tilesOnBoard);
      assertEquals(updatedHotel.getTiles().length, 3);
    });
  });

  describe("calculate the stock price of the selected stocks", () => {
    it("calculate the stock price of the selected stocks", () => {
      const hotels = [
        { name: "sackson", scale: 0 },
        {
          name: "Tower",
          scale: 0,
        },
      ];
      const hotelsInstance = Hotels.instantiateHotels(hotels);
      const tilesOfTower = ["2a", "1a"].map((id) => new Tile(id));
      hotelsInstance.addTilesToHotel("sackson", tilesOfTower);
      const cart = [{ hotelName: "sackson", selectedStocks: 2 }];

      assertEquals(hotelsInstance.calculateMoneyToDeduct(cart), 400);
    });
  });

  describe("Test for founding a hotel", () => {
    it("found a hotel should found the hotel with given tiles", () => {
      const hotelName = "Tower";
      const originTile = "2a";
      const allConnectedTiles = ["2a", "2b", "3b", "3c"];
      hotelsInstance.foundHotel(
        hotelName,
        new Tile(originTile),
        allConnectedTiles,
      );
      const hotels = hotelsInstance.getHotels();
      const towerTiles = hotels.find((hotel) => hotel.name === hotelName).tiles
        .length;
      assertEquals(towerTiles, 4);
    });
  });

  describe("save the state of the hotel", () => {
    it("1. getting the state of the ", () => {
      const data = hotelsInstance.getHotelsState();
      const expectedData = [
        {
          name: "sackson",
          tiles: [],
          stocks: 25,
          priceOffset: 0,
          originTile: undefined,
        },
        {
          name: "Tower",
          tiles: [],
          stocks: 25,
          priceOffset: 0,
          originTile: undefined,
        },
      ];
      assertEquals(data, expectedData);
    });

    it("loading the game state of the hotels", () => {
      const data = [
        {
          name: "sackson",
          tiles: [],
          stocks: 20,
          priceOffset: 0,
          originTile: undefined,
        },
        {
          name: "Tower",
          tiles: [],
          stocks: 1,
          priceOffset: 0,
          originTile: { id: "1a" },
        },
      ];
      hotelsInstance.loadGameState(data);
      const result = hotelsInstance.getHotelsState();
      assertEquals(result, data);
    });
  });
});
