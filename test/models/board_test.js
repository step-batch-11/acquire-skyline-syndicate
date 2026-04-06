import { describe, it } from "@std/testing/bdd";
import { assertEquals } from "@std/assert";
import { Board } from "../../src/models/board.js";
import { Tile } from "../../src/models/tile.js";

describe("Board entity tests", () => {
  describe("place method", () => {
    it("Should return the placed tiles with new tile", () => {
      const boardInstance = new Board();
      const tileToAdd = "1a";
      const placedTiles = boardInstance.getPlacedTiles();
      boardInstance.place(new Tile(tileToAdd));
      const updatedTiles = boardInstance.getPlacedTiles();

      assertEquals(placedTiles.length + 1, updatedTiles.length);
    });
  });
  describe("is tile on board method", () => {
    it("Should return whether the given tile is placed on the tile or not", () => {
      const board = new Board();
      const tile = new Tile("2a");
      board.place(tile);
      const result = board.isTileOnBoard(tile);
      assertEquals(result, true);
    });
  });
  describe("has adjacent for last tile  method", () => {
    it("Should return true if the last placed tile has no adjacent tile", () => {
      const board = new Board();
      const tile = new Tile("3d");
      const anotherTile = new Tile("3e");
      board.place(tile);
      board.place(anotherTile);
      const result = board.hasAdjacentForLastTile();
      assertEquals(result, true);
    });
    it("Should return false if the last placed tile has no adjacent tile", () => {
      const board = new Board();
      const tile = new Tile("3d");
      board.place(tile);
      const result = board.hasAdjacentForLastTile();
      assertEquals(result, false);
    });
  });
  describe("adjacent tile method", () => {
    it("should return the adjacent tiles which are placed on the board for given tile", () => {
      const board = new Board();
      const tile = new Tile("3d");
      const anotherTile = new Tile("4d");
      board.place(tile);
      board.place(anotherTile);
      const adjacentTiles = board.adjacentTilesOfLastTile();
      assertEquals(adjacentTiles.length, 2);
    });
  });
});
