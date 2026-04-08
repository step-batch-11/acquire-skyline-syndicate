import { beforeEach, describe, it } from "@std/testing/bdd";
import { assertEquals } from "@std/assert";
import { Game } from "../../src/models/game.js";
import { Deck } from "../../src/models/deck.js";
import { Board } from "../../src/models/board.js";
import { Player } from "../../src/models/player.js";
import { Tile } from "../../src/models/tile.js";
import { hotels as hotelsData } from "../../src/configs/hotels_data.js";
import { Hotels } from "../../src/models/hotels.js";

describe("Game entity tests", () => {
  let game;
  let board;
  let hotelsInstances;
  let players;

  beforeEach(() => {
    board = new Board();
    players = ["Gopi", "Haider"].map(
      (playerName, id) => new Player(playerName, id + 1),
    );
    hotelsInstances = Hotels.instantiateHotels(hotelsData);
    const tiles = [
      "1a",
      "2a",
      "3d",
      "4b",
      "8i",
      "4e",
      "12f",
      "11f",
      "10g",
      "2d",
      "1b",
      "2e",
      "5f",
      "6f",
      "6i",
      "9i",
      "10i",
      "4a",
      "5a",
      "7g",
    ];
    const tilesInstances = tiles.map((tile) => new Tile(tile));
    const deck = new Deck(tilesInstances, () => tilesInstances);
    game = new Game(deck, board, hotelsInstances, players);
  });
  describe("init method", () => {
    it("should return the initial data which game needs", () => {
      game.init();
      const initialData = game.currentState(1);
      assertEquals(initialData.currentPlayer.name, "Gopi");
      assertEquals(initialData.player.tiles.length, 6);
      assertEquals(initialData.hotels.length, 7);
      assertEquals(initialData.tilesOnBoard.length, 6);
      assertEquals(initialData.state, "PLACE_TILE");
    });
  });

  describe("placeTile method", () => {
    it("Should return the new player tiles after removing the placed tile", () => {
      game.init();
      const initialData = game.currentState(1);
      const tileToPlace = initialData.player.tiles[0];
      game.placeTile(1, tileToPlace);
      const result = game.currentState(1);
      assertEquals(result.player.tiles.length, 5);
      assertEquals(result.tilesOnBoard.length, 7);
    });

    it("Should not place tile on the board, if tile is not in player hand.", () => {
      game.init();
      const initialData = game.currentState(1);
      const tileToPlace = "12i";
      game.placeTile(1, tileToPlace);
      const result = game.currentState(1);
      assertEquals(result.player.tiles.length, 6);
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
      const game = new Game(deck, board, hotelsInstances, players);
      game.init();
      const tileToPlace = "4e";
      game.placeTile(1, tileToPlace);
      const result = game.currentState(1);
      assertEquals(result.player.tiles.length, 5);
      assertEquals(result.tilesOnBoard.length, 7);
    });
  });

  describe("assignNewTile method", () => {
    it("Should assign new Tile to the player and return the new player tile", () => {
      game.init();
      const initialData = game.currentState(1);
      const tileToPlace = initialData.player.tiles[0];
      game.placeTile(1, tileToPlace);
      game.assignNewTile();
      const result = game.currentState(1);
      assertEquals(result.player.tiles.length, 6);
      assertEquals(result.tilesOnBoard.length, 7);
    });
  });

  describe("buildHotel method", () => {
    it("should build hotel and add a free stock of that hotel player", () => {
      const state = "BUILD_HOTEL";
      const currentPlayerIndex = 1;
      const deck = [{ id: "7e" }, { id: "8e" }];
      const players = [{ id: 1, name: "yash" }].map(
        ({ id, name }) => new Player(name, id),
      );

      const placedTileIds = ["1a", "2a", "2b", "3c", "11g"].map(
        (tileId) => new Tile(tileId),
      );

      const lastTile = new Tile("3a");

      game.loadGameState({
        state,
        hotels: hotelsData,
        players,
        currentPlayerIndex,
        board: { placedTileIds, lastTile },
        deck,
      });

      const hotelName = "american";
      game.buildHotel(1, hotelName);
      const currentState = game.currentState(1);
      const stock = currentState.player.stocks[hotelName];

      assertEquals(stock, 1);
    });
  });

  describe("buy stocks method", () => {
    it("buy the stocks of sackson", () => {
      const state = "BUY_STOCK";
      const currentPlayerIndex = 1;
      const deck = [{ id: "7e" }, { id: "8e" }];
      const players = [{ id: 1, name: "yash" }].map(
        ({ id, name }) => new Player(name, id),
      );

      const placedTileIds = ["1a", "2a", "2b", "3c", "11g"].map(
        (tileId) => new Tile(tileId),
      );

      const lastTile = new Tile("3a");

      const hotels = [
        {
          name: "continental",
          tiles: ["1a", "2a"].map((tileId) => new Tile(tileId)),
          stocks: 24,
          originTile: new Tile("1a"),
          priceOffset: 200,
        },
      ];
      game.loadGameState({
        state,
        hotels,
        players,
        currentPlayerIndex,
        board: { placedTileIds, lastTile },
        deck,
      });

      const result = game.buyStocks(1, [
        { hotelName: "continental", selectedStocks: 3 },
      ]);

      assertEquals(result.playerInfo.stocks["continental"], 3);
    });
  });

  describe("isExpansion", () => {
    it.ignore("should return true if expansion is possible", () => {
      game.init();
      const initialData = game.currentState(1);
      game.placeTile(1, initialData.currentPlayer.tiles[0]);
      game.placeTile(1, initialData.currentPlayer.tiles[0]);
      game.buildHotel("sackson");
      const hotel = game
        .currentState(1)
        .hotels.find(({ name }) => name === "sackson");
      game.placeTile(1, initialData.currentPlayer.tiles[0]);
      const updatedHotel = game
        .currentState(1)
        .hotels.find(({ name }) => name === "sackson");
      assertEquals(hotel.tiles.length + 1, updatedHotel.tiles.length);
    });
  });

  describe("given someone place tile adjacent to two unequal hotel chains", () => {
    it("", () => {
      // const continentalTiles = ["1a", "2a"];
      // const imperialTiles = ["4a", "5a"];
    });
  });
});
