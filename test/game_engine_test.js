import { assertEquals } from "@std/assert";
import { beforeEach, describe, it } from "@std/testing/bdd";
import { GameEngine } from "../src/game_engine.js";

describe("GameEngine", () => {
  let gameEngine;
  beforeEach(() => (gameEngine = new GameEngine()));

  describe("adjacentTiles", () => {
    it("should return adjacent tiles of the tile having 4 adjacent tiles", () => {
      const expected = ["1b", "3b", "2a", "2c"];

      assertEquals(gameEngine.adjacentTilesOf("2b"), expected);
    });
    it("should return adjacent tiles of the tile having 3 adjacent tiles", () => {
      const expected = ["2b", "1a", "1c"];

      assertEquals(gameEngine.adjacentTilesOf("1b"), expected);
    });
    it("should return adjacent tiles of the bottom left tile", () => {
      const expected = ["2i", "1h"];

      assertEquals(gameEngine.adjacentTilesOf("1i"), expected);
    });
    it("should return adjacent tiles of the bottom right tile", () => {
      const expected = ["11i", "12h"];

      assertEquals(gameEngine.adjacentTilesOf("12i"), expected);
    });
    it("should return adjacent tiles of the top right tile", () => {
      const expected = ["11a", "12b"];

      assertEquals(gameEngine.adjacentTilesOf("12a"), expected);
    });
    it("should return adjacent tiles of the top left tile", () => {
      const expected = ["2a", "1b"];

      assertEquals(gameEngine.adjacentTilesOf("1a"), expected);
    });
  });

  describe("actionForPlacingTile", () => {
    it("the adjacent tiles are not placed", () => {
      const placedTiles = ["2a", "3a"];
      const action = gameEngine.actionForPlacingTile("7b", placedTiles);
      assertEquals(action, "nothing");
    });

    it("the adjacent tiles are already placed ", () => {
      const placedTiles = ["2a", "3a"];
      const action = gameEngine.actionForPlacingTile("1a", placedTiles);
      assertEquals(action, "build hotel");
    });

    it("the all adjacent tiles are already placed ", () => {
      const placedTiles = ["2a", "3a", "1b"];
      const action = gameEngine.actionForPlacingTile("1a", placedTiles);
      assertEquals(action, "build hotel");
    });
  });
});
