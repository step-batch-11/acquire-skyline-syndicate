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
  let board;
  let hotels;
  let hotelsInfo;
  let players;
  beforeEach(() => {
    board = new Board();
    players = ["Gopi", "Haider"].map((playerName, id) =>
      new Player(playerName, id)
    );
    hotelsInfo = [{ name: "sackson", scale: 0 }, {
      name: "worldwide",
      scale: 100,
    }];
    hotels = Hotels.instantiateHotels(hotelsInfo);
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
      "1b",
      "2e",
      "5f",
      "7h",
      "6i",
    ];
    const tilesInstances = tiles.map((tile) => new Tile(tile));
    const deck = new Deck(tilesInstances, () => tilesInstances);
    game = new Game(deck, board, hotels, players);
  });
  describe("init method", () => {
    it("should return the initial data which game needs", () => {
      game.init();
      const initialData = game.currentState();
      assertEquals(initialData.currentPlayer.name, "Gopi");
      assertEquals(initialData.currentPlayer.tiles.length, 6);
      assertEquals(initialData.hotels.length, 2);
      assertEquals(initialData.tilesOnBoard.length, 6);
      assertEquals(initialData.state, "");
    });
  });
  describe("placeTile method", () => {
    it("Should return the new player tiles after removing the placed tile", () => {
      game.init();
      const initialData = game.currentState();
      const tileToPlace = initialData.currentPlayer.tiles[0];
      const result = game.placeTile(tileToPlace);
      assertEquals(result.playerTiles.length, 5);
      assertEquals(result.tilesOnBoard.length, 7);
    });

    it("Should not place tile on the board, tile is not in player hand.", () => {
      game.init();
      const initialData = game.currentState();
      const tileToPlace = "12i";
      const result = game.placeTile(tileToPlace);
      assertEquals(result.playerTiles.length, 6);
      assertEquals(result.tilesOnBoard, initialData.tilesOnBoard);
    });

    it("Should not place tile on the board, tile is in player hand and on board.", () => {
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
        "4e",
        "2e",
        "5f",
        "7h",
        "6i",
      ];
      const tilesInstances = tiles.map((tile) => new Tile(tile));
      const deck = new Deck(tilesInstances, () => tilesInstances);
      const game = new Game(deck, board, hotels, players);
      game.init();
      const tileToPlace = "4e";
      game.placeTile(tileToPlace);
      const result = game.currentState();
      assertEquals(result.currentPlayer.tiles.length, 5);
    });
  });
  describe("assignNewTile method", () => {
    it("Should assign new Tile to the player and return the new player tile", () => {
      game.init();
      const initialData = game.currentState();
      const tileToPlace = initialData.currentPlayer.tiles[0];
      game.placeTile(tileToPlace);
      const result = game.assignNewTile();
      assertEquals(result.playerTiles.length, 6);
      assertEquals(result.tilesOnBoard.length, 7);
    });
  });
  describe("buildHotel method", () => {
    it("should build hotel and add a free stock of that hotel player", () => {
      game.placeTile("2a");
      game.placeTile("3a");
      const hotelName = "sackson";
      game.buildHotel(hotelName);
      const result = game.currentState();
      const stock = result.currentPlayer.stocks[hotelName];
      assertEquals(stock, 1);
    });
  });
});
