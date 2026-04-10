import { describe, it } from "@std/testing/bdd";
import { assertEquals } from "@std/assert";
import { Deck } from "../../src/models/deck.js";

describe("Deck entity tests", () => {
  describe("draw new tile method", () => {
    it("Should return one random tile from the deck and remove from the deck", () => {
      const tiles = ["1a", "3d", "4b", "8i", "4e", "12f", "11i", "10g", "2d"];
      const deckInstance = new Deck(tiles);
      const newTile = deckInstance.drawTiles(1);
      assertEquals(...newTile, "1a");
      assertEquals(tiles.includes(...newTile), false);
    });
  });

  describe("draw initial tiles method", () => {
    it("Should return random 6 tiles from the deck and remove the deck", () => {
      const tiles = ["1a", "3d", "4b", "8i", "4e", "12f", "11i", "10g", "2d"];
      const deckInstance = new Deck(tiles);
      const initialTiles = deckInstance.drawTiles(6);
      assertEquals(initialTiles, ["1a", "3d", "4b", "8i", "4e", "12f"]);
      assertEquals(tiles.includes("1a"), false);
      assertEquals(tiles.includes("12f"), false);
    });
  });

  describe("get the deck state", () => {
    it("getting the all the tiles in the deck", () => {
      const tiles = ["1a", "3d", "4b", "8i", "4e", "12f", "11i", "10g", "2d"];
      const deckInstance = new Deck(tiles);
      assertEquals(deckInstance.tiles, tiles);
    });

    it("slicing some tiles in the deck", () => {
      const tiles = ["1a", "3d", "4b", "8i", "4e", "12f", "11i", "10g", "2d"];
      const deckInstance = new Deck(tiles);
      deckInstance.drawTiles(6);
      const expectedResult = ["11i", "10g", "2d"];
      assertEquals(deckInstance.tiles, expectedResult);
    });
  });

  describe("loading the game state", () => {
    it("injecting the tiles in the deck", () => {
      const tiles = ["1a", "3d", "4b", "8i", "4e", "12f", "11i", "10g", "2d"];
      const deckInstance = new Deck(tiles);
      deckInstance.tiles = tiles;
      assertEquals(deckInstance.tiles, tiles);
    });
  });
});
