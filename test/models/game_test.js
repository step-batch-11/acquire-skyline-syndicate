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
      game.placeTile(1, tileToPlace.id);
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
  });

  describe("assignNewTile method", () => {
    it("Should assign new Tile to the player and return the new player tile", () => {
      game.init();
      const initialData = game.currentState(1);
      const tileToPlace = initialData.player.tiles[0];
      game.placeTile(1, tileToPlace.id);
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
      const tilesInDeck = ["7e", "8e"];
      const deck = tilesInDeck.map((tile) => new Tile(tile));
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

      game.assignNewTile();
      game.assignNewTile();
      game.assignNewTile();

      const result = game.buyStocks(1, [
        { hotelName: "continental", selectedStocks: 3 },
      ]);

      assertEquals(result.playerInfo.stocks["continental"], 3);
    });
  });

  describe("expandHotel", () => {
    it("should expand hotel successfully", () => {
      const state = "PLACE_TILE";
      const currentPlayerIndex = 1;
      const deck = [{ id: "7e" }, { id: "8e" }];
      const players = [{ id: 1, name: "yash" }].map(
        ({ id, name }) => new Player(name, id),
      );

      const placedTileIds = ["1a", "2a", "2b", "3c", "11g"].map(
        (tileId) => new Tile(tileId),
      );

      const hotelTiles = ["1a", "2a"].map((tileId) => new Tile(tileId));
      const lastTile = new Tile("9a");
      const hotels = [
        {
          name: "continental",
          tiles: [...hotelTiles],
          stocks: 24,
          originTile: new Tile("1a"),
          priceOffset: 200,
        },
      ];

      game.loadGameState({
        state,
        hotels: [...hotels],
        players,
        currentPlayerIndex,
        board: { placedTileIds, lastTile },
        deck,
      });

      game.expandHotel("2b");
      const findHotel = (hotels, hotelName) =>
        hotels.find(({ name }) => name === hotelName);

      const updatedHotel = findHotel(
        game.currentState(1).hotels,
        "continental",
      );

      assertEquals(hotelTiles.length + 1, updatedHotel.tiles.length);
    });
  });

  describe("shiftTurn", () => {
    it("should successfully shift turn to next player", () => {
      const state = "SHIFT_TURN";
      const currentPlayerIndex = 0;
      const tileInDeck = ["7e", "8e"];
      const deck = tileInDeck.map((tile) => new Tile(tile));
      const players = [
        { id: 1, name: "yash" },
        { id: 2, name: "som" },
      ].map(({ id, name }) => new Player(name, id));

      const placedTileIds = ["1a", "2a", "2b", "3c"].map(
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

      game.shiftTurn(1);
      const nextPlayer = game.currentState(1).currentPlayer;
      assertEquals(nextPlayer.name, "som");
    });
  });

  describe("isGameEnd", () => {
    let state;
    let currentPlayerIndex;
    let deck;
    let placedTileIds;
    let lastTile;

    beforeEach(() => {
      state = "BUY_STOCK";
      currentPlayerIndex = 1;
      const tilesInDeck = ["7e", "8e"];
      deck = tilesInDeck.map((tile) => new Tile(tile));
      placedTileIds = ["1a", "2a", "2b", "3c", "11g"].map(
        (tileId) => new Tile(tileId),
      );
      lastTile = new Tile("3a");
    });

    it("should return false when hotels are not stable", () => {
      const players = [{ id: 1, name: "yash" }].map(
        ({ id, name }) => new Player(name, id),
      );

      const hotels = [
        {
          name: "continental",
          tiles: ["1a", "2a"].map((tileId) => new Tile(tileId)),
          stocks: 24,
          originTile: new Tile("1a"),
          priceOffset: 200,
        },
        {
          name: "imperial",
          tiles: [],
          stocks: 25,
          originTile: null,
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
      game.assignNewTile();
      game.assignNewTile();
      game.assignNewTile();
      game.assignNewTile();
      game.assignNewTile();
      game.assignNewTile();

      assertEquals(game.isGameEnd(), false);
    });

    it("should return true when all hotels are stable", () => {
      const players = [{ id: 1, name: "yash" }].map(
        ({ id, name }) => new Player(name, id),
      );

      const hotels = [
        {
          name: "continental",
          tiles: Array.from({ length: 11 }, () => 1),
          stocks: 12,
          originTile: new Tile("1a"),
          priceOffset: 200,
        },
        {
          name: "imperial",
          tiles: Array.from({ length: 11 }, () => 1),
          stocks: 12,
          originTile: new Tile("11e"),
          priceOffset: 200,
        },
        {
          name: "american",
          tiles: Array.from({ length: 11 }, () => 1),
          stocks: 12,
          originTile: new Tile("12f"),
          priceOffset: 100,
        },
        {
          name: "worldwide",
          tiles: Array.from({ length: 11 }, () => 1),
          stocks: 12,
          originTile: new Tile("10a"),
          priceOffset: 100,
        },
        {
          name: "festival",
          tiles: Array.from({ length: 11 }, () => 1),
          stocks: 12,
          originTile: new Tile("13b"),
          priceOffset: 100,
        },
        {
          name: "sackson",
          tiles: Array.from({ length: 11 }, () => 1),
          stocks: 12,
          originTile: new Tile("10e"),
          priceOffset: 0,
        },
        {
          name: "tower",
          tiles: Array.from({ length: 11 }, () => 1),
          stocks: 12,
          originTile: new Tile("11f"),
          priceOffset: 0,
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
      game.assignNewTile();
      game.assignNewTile();
      game.assignNewTile();
      game.assignNewTile();
      game.assignNewTile();
      game.assignNewTile();

      assertEquals(game.isGameEnd(), true);
    });

    it("should return false when there is no 41 hotel chain", () => {
      const players = [{ id: 1, name: "yash" }].map(
        ({ id, name }) => new Player(name, id),
      );

      const hotels = [
        {
          name: "continental",
          tiles: [],
          stocks: 12,
          originTile: new Tile("1a"),
          priceOffset: 200,
        },
        {
          name: "imperial",
          tiles: [],
          stocks: 12,
          originTile: new Tile("11e"),
          priceOffset: 200,
        },
        {
          name: "american",
          tiles: Array.from({ length: 10 }, () => 1),
          stocks: 12,
          originTile: new Tile("12f"),
          priceOffset: 100,
        },
        {
          name: "worldwide",
          tiles: Array.from({ length: 8 }, () => 1),
          stocks: 12,
          originTile: new Tile("10a"),
          priceOffset: 100,
        },
        {
          name: "festival",
          tiles: Array.from({ length: 7 }, () => 1),
          stocks: 12,
          originTile: new Tile("13b"),
          priceOffset: 100,
        },
        {
          name: "sackson",
          tiles: Array.from({ length: 6 }, () => 1),
          stocks: 12,
          originTile: new Tile("10e"),
          priceOffset: 0,
        },
        {
          name: "tower",
          tiles: Array.from({ length: 8 }, () => 1),
          stocks: 12,
          originTile: new Tile("11f"),
          priceOffset: 0,
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
      game.assignNewTile();
      game.assignNewTile();
      game.assignNewTile();
      game.assignNewTile();
      game.assignNewTile();
      game.assignNewTile();
      assertEquals(game.isGameEnd(), false);
    });

    it("should return true when there is one hotel of 41 hotel chain", () => {
      const players = [{ id: 1, name: "yash" }].map(
        ({ id, name }) => new Player(name, id),
      );

      const hotels = [
        {
          name: "continental",
          tiles: [],
          stocks: 12,
          originTile: new Tile("1a"),
          priceOffset: 200,
        },
        {
          name: "imperial",
          tiles: [],
          stocks: 12,
          originTile: new Tile("11e"),
          priceOffset: 200,
        },
        {
          name: "american",
          tiles: Array.from({ length: 41 }, () => 1),
          stocks: 12,
          originTile: new Tile("12f"),
          priceOffset: 100,
        },
        {
          name: "worldwide",
          tiles: Array.from({ length: 11 }, () => 1),
          stocks: 12,
          originTile: new Tile("10a"),
          priceOffset: 100,
        },
        {
          name: "festival",
          tiles: Array.from({ length: 11 }, () => 1),
          stocks: 12,
          originTile: new Tile("13b"),
          priceOffset: 100,
        },
        {
          name: "sackson",
          tiles: Array.from({ length: 11 }, () => 1),
          stocks: 12,
          originTile: new Tile("10e"),
          priceOffset: 0,
        },
        {
          name: "tower",
          tiles: Array.from({ length: 11 }, () => 1),
          stocks: 12,
          originTile: new Tile("11f"),
          priceOffset: 0,
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
      game.assignNewTile();
      game.assignNewTile();
      game.assignNewTile();
      game.assignNewTile();
      game.assignNewTile();
      game.assignNewTile();
      assertEquals(game.isGameEnd(), true);
    });

    it("should return false when all hands are not empty", () => {
      const players = [
        { id: 1, name: "yash" },
        { id: 2, name: "som" },
        { id: 3, name: "dilli" },
      ].map(({ id, name }) => new Player(name, id));

      const hotels = [
        {
          name: "continental",
          tiles: [],
          stocks: 12,
          originTile: new Tile("1a"),
          priceOffset: 200,
        },
        {
          name: "imperial",
          tiles: [],
          stocks: 12,
          originTile: new Tile("11e"),
          priceOffset: 200,
        },
        {
          name: "american",
          tiles: Array.from({ length: 10 }, () => 1),
          stocks: 12,
          originTile: new Tile("12f"),
          priceOffset: 100,
        },
        {
          name: "worldwide",
          tiles: Array.from({ length: 11 }, () => 1),
          stocks: 12,
          originTile: new Tile("10a"),
          priceOffset: 100,
        },
        {
          name: "festival",
          tiles: Array.from({ length: 11 }, () => 1),
          stocks: 12,
          originTile: new Tile("13b"),
          priceOffset: 100,
        },
        {
          name: "sackson",
          tiles: Array.from({ length: 11 }, () => 1),
          stocks: 12,
          originTile: new Tile("10e"),
          priceOffset: 0,
        },
        {
          name: "tower",
          tiles: Array.from({ length: 11 }, () => 1),
          stocks: 12,
          originTile: new Tile("11f"),
          priceOffset: 0,
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
      game.assignNewTile();
      game.assignNewTile();
      game.assignNewTile();
      game.assignNewTile();
      game.assignNewTile();
      game.assignNewTile();
      assertEquals(game.isGameEnd(), false);
    });

    it("should return true when all hands are empty", () => {
      const players = [{ id: 1, name: "yash" }].map(
        ({ id, name }) => new Player(name, id),
      );

      const hotels = [
        {
          name: "continental",
          tiles: [],
          stocks: 12,
          originTile: new Tile("1a"),
          priceOffset: 200,
        },
        {
          name: "imperial",
          tiles: [],
          stocks: 12,
          originTile: new Tile("11e"),
          priceOffset: 200,
        },
        {
          name: "american",
          tiles: Array.from({ length: 10 }, () => 1),
          stocks: 12,
          originTile: new Tile("12f"),
          priceOffset: 100,
        },
        {
          name: "worldwide",
          tiles: Array.from({ length: 11 }, () => 1),
          stocks: 12,
          originTile: new Tile("10a"),
          priceOffset: 100,
        },
        {
          name: "festival",
          tiles: Array.from({ length: 11 }, () => 1),
          stocks: 12,
          originTile: new Tile("13b"),
          priceOffset: 100,
        },
        {
          name: "sackson",
          tiles: Array.from({ length: 11 }, () => 1),
          stocks: 12,
          originTile: new Tile("10e"),
          priceOffset: 0,
        },
        {
          name: "tower",
          tiles: Array.from({ length: 11 }, () => 1),
          stocks: 12,
          originTile: new Tile("11f"),
          priceOffset: 0,
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

      assertEquals(game.isGameEnd(), true);
    });
  });

  describe("checking the connected hotel chains", () => {
    it("no connected hotel chains", () => {
      const tileInstance = new Tile("1a");
      const result = game.getAdjacentHotelChainsOfTile(tileInstance);
      assertEquals(result, []);
    });
  });
  describe("calculateFinalWinner", () => {
    let state;
    let currentPlayerIndex;
    let deck;
    let placedTileIds;
    let lastTile;
    let player1;
    let player2;

    beforeEach(() => {
      state = "BUY_STOCKS";
      currentPlayerIndex = 1;
      deck = [{ id: "7e" }, { id: "8e" }];
      placedTileIds = ["1a", "2a", "2b", "3c", "11g"].map(
        (tileId) => new Tile(tileId),
      );
      lastTile = new Tile("3a");
      player1 = new Player("Gopi", 1);
      player1.addStocks("imperial", 3);
      player1.addStocks("continental", 5);
      player2 = new Player("Dilli", 2);
      player2.addStocks("festival", 3);
      player2.addStocks("continental", 3);
      const hotels = [
        {
          name: "imperial",
          tiles: [
            {
              id: "1a",
            },
            {
              id: "2a",
            },
            {
              id: "3a",
            },
            {
              id: "4a",
            },
            {
              id: "5a",
            },
            {
              id: "6a",
            },
            {
              id: "7a",
            },
            {
              id: "8a",
            },
            {
              id: "9a",
            },
            {
              id: "10a",
            },
            {
              id: "11a",
            },
            {
              id: "12a",
            },
          ],
          stocks: 20,
          priceOffset: 200,
          originTile: {
            id: "5a",
          },
        },
        {
          name: "continental",
          tiles: [
            {
              id: "1d",
            },
            {
              id: "2d",
            },
            {
              id: "3d",
            },
            {
              id: "4d",
            },
            {
              id: "5d",
            },
            {
              id: "6d",
            },
            {
              id: "7d",
            },
            {
              id: "8d",
            },
            {
              id: "9d",
            },
            {
              id: "10d",
            },
            {
              id: "11d",
            },
          ],
          stocks: 22,
          priceOffset: 200,
          originTile: {
            id: "6d",
          },
        },
        {
          name: "festival",
          tiles: [
            {
              id: "1g",
            },
            {
              id: "2g",
            },
            {
              id: "3g",
            },
            {
              id: "4g",
            },
            {
              id: "5g",
            },
            {
              id: "6g",
            },
            {
              id: "7g",
            },
            {
              id: "8g",
            },
            {
              id: "9g",
            },
            {
              id: "10g",
            },
          ],
          stocks: 23,
          priceOffset: 100,
          originTile: {
            id: "5g",
          },
        },
        {
          name: "american",
          tiles: [],
          stocks: 25,
          priceOffset: 100,
        },
        {
          name: "worldwide",
          tiles: [],
          stocks: 25,
          priceOffset: 100,
        },
        {
          name: "sackson",
          tiles: [],
          stocks: 25,
          priceOffset: 0,
        },
        {
          name: "tower",
          tiles: [],
          stocks: 25,
          priceOffset: 0,
        },
      ];

      game.loadGameState({
        state,
        players: [player1, player2],
        hotels,
        board: { placedTileIds, lastTile },
        deck,
        currentPlayerIndex,
      });
    });

    it("get the winner of the game", () => {
      const { winner, players } = game.calculateFinalWinner();
      const [winnerOfTheGame] = players.sort((a, b) => b.money - a.money);
      assertEquals(winner, winnerOfTheGame.name);
    });
  });
});
