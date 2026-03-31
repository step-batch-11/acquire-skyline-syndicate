import { beforeEach, describe, it } from "@std/testing/bdd";
import { assertEquals } from "@std/assert";
import { Services } from "../src/services.js";

describe("Test service class", () => {
  let service;
  const hotels = {
    "Continental": {
      "tiles": ["1a", "2a", "2b"],
    },
    "Imperial": {
      "tiles": ["8c", "8d"],
    },
    "American": {
      "tiles": ["4g", "5g"],
    },
    "Festival": {
      "tiles": ["12e", "12f"],
    },
    "Worldwide": {
      "tiles": [],
    },
    "Sackson": {
      "tiles": [],
    },
    "Tower": {
      "tiles": [],
    },
  };

  beforeEach(() => {
    service = new Services([
      "1a",
      "1b",
      "1c",
      "1d",
      "1e",
      "1f",
      "1g",
      "1h",
      "1i",
      "2a",
      "2b",
      "2c",
    ], hotels);
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
        tiles: ["1a", "2a", "2b", "3b"],
      });
    });
  });
});
