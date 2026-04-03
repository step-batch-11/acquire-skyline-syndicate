import { beforeEach, describe, it } from "@std/testing/bdd";
import { assertEquals } from "@std/assert";
import { Player } from "../../src/models/player.js";
import { Tile } from "../../src/models/tile.js";

describe("Player entity tests", () => {
  let playerInstance;
  beforeEach(() => {
    const name = "Tom";
    const playerId = 1;
    playerInstance = new Player(name, playerId);
  });
  describe("get player details method", () => {
    it("Should return initial details of the player", () => {
      const playerDetails = playerInstance.getDetails();
      assertEquals(playerDetails.name, "Tom");
      assertEquals(playerDetails.money, 6000);
      assertEquals(playerDetails.tiles, []);
      assertEquals(playerDetails.stocks, {});
    });
  });
  describe("Add Initial tiles method", () => {
    it("Should assign random 6 tiles to the players", () => {
      const tiles = ["1a", "3d", "4b", "8i", "4e", "12f"];
      const tileInstances = tiles.map((tile) => new Tile(tile));
      playerInstance.addInitialTiles(tileInstances);
      const player = playerInstance.getDetails();
      assertEquals(player.tiles, tiles);
    });
  });
  describe("Remove tile method", () => {
    it("Should remove the given tile from the player tiles", () => {
      const tiles = ["1a", "3d", "4b", "8i", "4e", "12f"];
      const tileInstances = tiles.map((tile) => new Tile(tile));
      const tileToRemove = "3d";
      playerInstance.addInitialTiles(tileInstances);
      playerInstance.removeTile(tileToRemove);
      const playerDetails = playerInstance.getDetails();
      assertEquals(playerDetails.tiles.includes(tileToRemove), false);
      assertEquals(playerDetails.tiles, [
        "1a",
        "4b",
        "8i",
        "4e",
        "12f",
      ]);
      assertEquals(playerDetails.name, "Tom");
    });
  });
  describe("Add new tile method", () => {
    it("Should add one new random tile which is not assigned yet", () => {
      const tiles = ["1a", "3d", "4b", "8i", "4e", "12f"];
      const tileInstances = tiles.map((tile) => new Tile(tile));
      const tileToRemove = "3d";
      const tileToAdd = new Tile("4a");
      playerInstance.addInitialTiles(tileInstances);
      playerInstance.removeTile(tileToRemove);
      playerInstance.addNewTile([tileToAdd]);
      const player = playerInstance.getDetails();
      assertEquals(player.tiles.includes("4a"), true);
      assertEquals(player.tiles.includes("3d"), false);
    });
  });
});
