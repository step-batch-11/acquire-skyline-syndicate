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

  describe("tileIncludes", () => {
    let tiles;
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

  describe("calculateStockPrice", () => {
    it("should return 200 as stock price for 2 tiles of small size hotel", () => {
      const hotel = new Hotel("sackson", 0);
      hotel.addTiles(["1a", "2a"]);
      assertEquals(hotel.calculateStockPrice(), 200);
    });
    it("should return 300 as stock price for 3 tiles of small size hotel", () => {
      const hotel = new Hotel("tower", 0);
      hotel.addTiles(["1a", "2a", "3a"]);
      assertEquals(hotel.calculateStockPrice(), 300);
    });
    it("should return 500 as stock price for 4 tiles of medium size hotel", () => {
      const hotel = new Hotel("american", 100);
      hotel.addTiles(["1a", "2a", "3a", "4a"]);
      assertEquals(hotel.calculateStockPrice(), 500);
    });
    it("should return 600 as stock price for 5 tiles  of medium size hotel", () => {
      const hotel = new Hotel("festival", 100);
      hotel.addTiles(["1a", "2a", "3a", "4a", "5a"]);
      assertEquals(hotel.calculateStockPrice(), 600);
    });
    it("should return 800 as stock price for 6-10 tiles of large size hotel", () => {
      const hotel = new Hotel("continental", 200);
      hotel.addTiles(["1a", "2a", "3a", "4a", "5a", "6a", "7a", "8a", "9a"]);
      assertEquals(hotel.calculateStockPrice(), 800);
    });
    it("should return 900 as stock price for 11-20 tiles chain of large size hotel", () => {
      const hotel = new Hotel("imperial", 200);
      hotel.addTiles([
        "1a",
        "2a",
        "3a",
        "4a",
        "5a",
        "6a",
        "7a",
        "8a",
        "9a",
        "11a",
        "12a",
      ]);
      assertEquals(hotel.calculateStockPrice(), 900);
    });
    it("should return 900 as stock price for 21-30 tiles chain of medium size hotel", () => {
      const hotel = new Hotel("worldwide", 100);

      hotel.addTiles([
        "1a",
        "1b",
        "2a",
        "2b",
        "3a",
        "3b",
        "4a",
        "4b",
        "5a",
        "5b",
        "6a",
        "6b",
        "7a",
        "7b",
        "8a",
        "8b",
        "9a",
        "9b",
        "11a",
        "11b",
        "12a",
        "12b",
      ]);
      assertEquals(hotel.calculateStockPrice(), 900);
    });
    it("should return 900 as stock price for 31-40 tiles chain of small size hotel", () => {
      const hotel = new Hotel("sackson", 0);

      hotel.addTiles([
        "1a",
        "1b",
        "1c",
        "2a",
        "2b",
        "2c",
        "3a",
        "3b",
        "3c",
        "4a",
        "4b",
        "4c",
        "5a",
        "5b",
        "5c",
        "6a",
        "6b",
        "6c",
        "7a",
        "7b",
        "7c",
        "8a",
        "8b",
        "8c",
        "9a",
        "9b",
        "9c",
        "11a",
        "11b",
        "11c",
        "12a",
        "12b",
        "12c",
      ]);
      assertEquals(hotel.calculateStockPrice(), 900);
    });
    it("should return 1200 as stock price for more than 41 tiles chain of large size hotel", () => {
      const hotel = new Hotel("imperial", 200);

      hotel.addTiles([
        "1a",
        "1b",
        "1c",
        "1d",
        "2a",
        "2b",
        "2c",
        "2d",
        "3a",
        "3b",
        "3c",
        "3d",
        "4a",
        "4b",
        "4c",
        "4d",
        "5a",
        "5b",
        "5c",
        "5d",
        "6a",
        "6b",
        "6c",
        "6d",
        "7a",
        "7b",
        "7c",
        "7d",
        "8a",
        "8b",
        "8c",
        "8d",
        "9a",
        "9b",
        "9c",
        "9d",
        "11a",
        "11b",
        "11c",
        "11d",
        "12a",
        "12b",
        "12c",
        "12d",
      ]);
      assertEquals(hotel.calculateStockPrice(), 1200);
    });
  });

  describe("saving the hotel data", () => {
    it("getting the state of the hotel", () => {
      const hotelName = "Tower";
      const scale = 0;
      const hotel = new Hotel(hotelName, scale);
      const data = hotel.getHotelState();
      const exceptedData = {
        name: "Tower",
        tiles: [],
        stocks: 25,
        priceOffset: 0,
        originTile: {},
      };
      assertEquals(data, exceptedData);
    });
  });

  it("loading the game state", () => {
    const hotelName = "Tower";
    const scale = 0;
    const hotel = new Hotel(hotelName, scale);
    const hotelData = {
      name: "Tower",
      tiles: [],
      stocks: 18,
      priceOffset: 0,
      originTile: { id: "1a" },
    };
    hotel.loadGameState(hotelData);
    assertEquals(hotel.getHotelState(), hotelData);
  });

  it("remove hotel stocks", () => {
    const hotelName = "Tower";
    const scale = 0;
    const hotel = new Hotel(hotelName, scale);
    hotel.removeHotelStocks(3);
    assertEquals(hotel.stocksCount, 22);
  });
});
