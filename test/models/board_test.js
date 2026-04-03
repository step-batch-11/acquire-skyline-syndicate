import { describe, it } from "@std/testing/bdd";
import { assertEquals } from "@std/assert";
import { Board } from "../../src/models/board.js";
import { Tile } from "../../src/models/tile.js";

describe("Board entity tests", () => {
  describe("Add new to placed list method", () => {
    it("Should return the placed tiles with new tile", () => {
      const boardInstance = new Board();
      const tileToAdd = "1a";
      const placedTiles = boardInstance.getPlacedTiles();
      boardInstance.place(new Tile(tileToAdd));
      const updatedTiles = boardInstance.getPlacedTiles();

      assertEquals(placedTiles.length + 1, updatedTiles.length);
    });
  });
});
