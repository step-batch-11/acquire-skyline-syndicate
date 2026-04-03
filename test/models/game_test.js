import { beforeEach, describe, it } from "@std/testing/bdd";
import { assertEquals } from "@std/assert";
import { Game } from "../../src/models/game.js";
import { Deck } from "../../src/models/deck.js";
import { Board } from "../../src/models/board.js";
import { Hotels } from "../../src/models/hotels.js";
import { Player } from "../../src/models/player.js";
import { Tile } from "../../src/models/tile.js";

describe("Game entity tests", () => {
  let game;
  beforeEach(() => {
    const board = new Board();
    const player = new Player("Gopi", 1);
    const hotelsInfo = [{ name: "sackson", scale: 0 }, {
      name: "worldwide",
      scale: 100,
    }];
    const hotels = Hotels.instantiateHotels(hotelsInfo);
    const tiles = [
      "1a",
      "3d",
      "4b",
      "8i",
      "4e",
      "12f",
      "11i",
      "10g",
      "2d",
      "11h",
      "2e",
      "5f",
      "7h",
      "6i",
    ];
    const tilesInstances = tiles.map((tile) => new Tile(tile));
    const deck = new Deck(tilesInstances, () => tilesInstances);
    game = new Game(deck, board, hotels, player);
  });
  describe("init method", () => {
    it("should return the initial data which game needs", () => {
      game.init();
      const initialData = game.currentState();
      assertEquals(initialData.player.name, "Gopi");
      assertEquals(initialData.player.tiles.length, 6);
      assertEquals(initialData.hotels.length, 2);
      assertEquals(initialData.tilesOnBoard.length, 6);
      assertEquals(initialData.state, "");
    });
  });

  describe("place tile method", () => {
    it("Should return the new player tiles after removing the placed tile", () => {
      game.init();
      const initialData = game.currentState();
      const tileToPlace = initialData.player.tiles[0];
      const result = game.placeTile(tileToPlace);
      assertEquals(result.playerTiles.length, 5);
      assertEquals(result.tilesOnBoard.length, 7);
    });
  });

  describe("Assign new tile method", () => {
    it("Should assign new Tile to the player and return the new player tile", () => {
      game.init();
      const initialData = game.currentState();
      const tileToPlace = initialData.player.tiles[0];
      game.placeTile(tileToPlace);
      const result = game.assignNewTile();
      assertEquals(result.playerTiles.length, 6);
      assertEquals(result.tilesOnBoard.length, 7);
    });
  });
});
