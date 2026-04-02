import { beforeEach, describe, it } from "@std/testing/bdd";
import { assertEquals } from "@std/assert";
import { Services } from "../src/services.js";
import { GameEngine } from "../src/game_engine.js";

describe("Test service class", () => {
  let service;
  const hotels = {
    Continental: {
      tiles: ["2a", "2b"],
      orginTile: null,
    },
    Imperial: {
      tiles: ["8c", "8d"],
      orginTile: null,
    },
    American: {
      tiles: ["4g", "5g"],
      orginTile: null,
    },
    Festival: {
      tiles: ["12e", "12f"],
      orginTile: null,
    },
    Worldwide: {
      tiles: [],
      orginTile: null,
    },
    Sackson: {
      tiles: [],
      orginTile: null,
    },
    Tower: {
      tiles: [],
      orginTile: null,
    },
  };

  beforeEach(() => {
    service = new Services(
      ["1a", "1b", "1c", "1d", "1e", "1f", "1g", "1h", "1i", "2a", "2b", "2c"],
      hotels,
    );
  });

  describe("updatePlayerTiles", () => {
    it("update new tiles method should remove the selected tile from the player tiles", () => {
      service.initialSetup((tiles) => tiles);
      const playerTile = "2c";
      const response = service.updatePlayerTiles(playerTile);
      assertEquals(response.playerTiles.includes("2c"), false);
      assertEquals(response.tilesOnBoard.includes("2c"), true);
    });
  });

  describe("assignNewTile", () => {
    it("assign new tile method should add a new random tile into player tiles", () => {
      service.initialSetup((tiles) => tiles);
      const playerTile = "2c";
      service.updatePlayerTiles(playerTile);
      const randomTile = "10c";
      const response = service.assignNewTile(() => [randomTile]);
      assertEquals(response.playerTiles.includes(randomTile), true);
    });
  });

  describe("initialSetup", () => {
    it("Initial setup should give initial assets to the player", () => {
      const response = service.initialSetup((tiles) => tiles);
      assertEquals(response.amount, 6000);
      assertEquals(response.tilesOnBoard, ["1a", "1b", "1c", "1d", "1e", "1f"]);
      assertEquals(response.playerTiles, ["1g", "1h", "1i", "2a", "2b", "2c"]);
    });
  });

  describe("expandHotel", () => {
    it("should expand and return the expanded hotel", () => {
      assertEquals(service.expandHotel("3b", "Continental"), {
        hotelName: "Continental",
        ...hotels["Continental"],
      });
    });
  });

  describe("bulidHotesl", () => {
    const engine = new GameEngine();
    it("building a hotel", () => {
      service.initialSetup((tiles) => tiles);
      service.placeTileOnBoard("9c", engine);
      service.buildHotel("Imperial");
      const updatedHotels = service.getHotel();
      assertEquals(updatedHotels["Imperial"].orginTile, "9c");
      assertEquals(updatedHotels["Imperial"].tiles, ["8c", "8d", "9c"]);
    });
  });

  describe("getCurrentStockPrice", () => {
    it("should return current stock price of medium hotels with 4 tiles", () => {
      const hotel = {
        hotelName: "American",
        tiles: ["2a", "1a", "3a", "4a"],
      };
      assertEquals(service.getCurrentStockPrice(hotel), 500);
    });
    it("should return current stock price of large hotels with 6 tiles", () => {
      const hotel = {
        hotelName: "Imperial",
        tiles: ["2a", "1a", "3a", "4a", "5a", "6a"],
      };
      assertEquals(service.getCurrentStockPrice(hotel), 800);
    });
    it("should return current stock price of small hotels with 12 tiles", () => {
      const hotel = {
        hotelName: "Sackson",
        tiles: [
          "2a",
          "1a",
          "3a",
          "4a",
          "5a",
          "6a",
          "7a",
          "8a",
          "9a",
          "10a",
          "11a",
          "12a",
        ],
      };
      assertEquals(service.getCurrentStockPrice(hotel), 700);
    });
    it("should return current stock price of medium hotels with 22 tiles", () => {
      const hotel = {
        hotelName: "Festival",
        tiles: Array.from({ length: 22 }, (_) => 0),
      };
      assertEquals(service.getCurrentStockPrice(hotel), 900);
    });
    it("should return current stock price of large hotels with 35 tiles", () => {
      const hotel = {
        hotelName: "Continental",
        tiles: Array.from({ length: 35 }, (_) => 0),
      };
      assertEquals(service.getCurrentStockPrice(hotel), 1100);
    });
    it("should return current stock price of small hotels with 41 tiles", () => {
      const hotel = {
        hotelName: "Tower",
        tiles: Array.from({ length: 41 }, (_) => 0),
      };
      assertEquals(service.getCurrentStockPrice(hotel), 1000);
    });
  });
});
