import { assertEquals } from "@std/assert";
import { describe, it } from "@std/testing/bdd";
import { Tile } from "../../src/models/tile.js";

describe("TILE", () => {
  describe("isNeighbouringTile", () => {
    it("should return true for right neighbouring tile", () => {
      const tile1 = new Tile("1a");
      const tile2 = new Tile("2a");

      assertEquals(tile1.isNeighbouringTile(tile2), true);
    });
    it("should return false for non neighbouring tile", () => {
      const tile1 = new Tile("1a");
      const tile2 = new Tile("2c");

      assertEquals(tile1.isNeighbouringTile(tile2), false);
    });
    it("should return true for left neighbouring tile", () => {
      const tile1 = new Tile("2a");
      const tile2 = new Tile("1a");

      assertEquals(tile1.isNeighbouringTile(tile2), true);
    });
    it("should return true for bottom neighbouring tile", () => {
      const tile1 = new Tile("2a");
      const tile2 = new Tile("2b");

      assertEquals(tile1.isNeighbouringTile(tile2), true);
    });
    it("should return true for top neighbouring tile", () => {
      const tile1 = new Tile("2b");
      const tile2 = new Tile("2a");

      assertEquals(tile1.isNeighbouringTile(tile2), true);
    });
    it("should return false for the same tile", ()=>{
      const tile1 = new Tile("2a");
      const tile2 = new Tile("2a");

      assertEquals(tile1.isNeighbouringTile(tile2), false);
    })
  });
});
