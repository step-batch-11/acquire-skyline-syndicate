import { describe, it } from "@std/testing/bdd";
import { assertEquals } from "@std/assert";
import { Board } from "../../src/models/board.js";

describe("Board entity tests", () => {
  describe("Add new to placed list method", () => {
    it("Should return the placed tiles with new tile", () => {
      const boardInstance = new Board();
      const tileToAdd = "1a";
      boardInstance.place(tileToAdd);
      const tilesPlaced = boardInstance.getPlacedTiles(tileToAdd);
      assertEquals(tilesPlaced.includes(tileToAdd), true);
    });
  });
});
