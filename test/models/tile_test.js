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
    it("should return false for the same tile", () => {
      const tile1 = new Tile("2a");
      const tile2 = new Tile("2a");

      assertEquals(tile1.isNeighbouringTile(tile2), false);
    });
    it("should return false for the lower right diagonal tile", () => {
      const tile1 = new Tile("4f");
      const tile2 = new Tile("5g");

      assertEquals(tile1.isNeighbouringTile(tile2), false);
    });
    it("should return false for the lower left diagonal tile", () => {
      const tile1 = new Tile("6d");
      const tile2 = new Tile("5e");

      assertEquals(tile1.isNeighbouringTile(tile2), false);
    });
    it("should return false for the left upper diagonal tile", () => {
      const tile1 = new Tile("8g");
      const tile2 = new Tile("7f");

      assertEquals(tile1.isNeighbouringTile(tile2), false);
    });
    it("should return false for the right upper diagonal tile", () => {
      const tile1 = new Tile("10c");
      const tile2 = new Tile("11b");

      assertEquals(tile1.isNeighbouringTile(tile2), false);
    });
    it("should return false for the right upper diagonal tile", () => {
      const tile1 = new Tile("10h");
      const tile2 = new Tile("11g");

      assertEquals(tile1.isNeighbouringTile(tile2), false);
    });
  });
});
