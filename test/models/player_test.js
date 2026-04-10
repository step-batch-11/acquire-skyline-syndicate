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
      assertEquals(player.tiles.length, 6);
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
      assertEquals(playerDetails.tiles.length, 5);
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
      playerInstance.addTiles([tileToAdd]);
      const player = playerInstance.getDetails();
      assertEquals(player.tiles.length, 6);
    });
  });
  describe("Add stocks method", () => {
    it("Should return hotel with added new stocks", () => {
      const hotelName = "Tower";
      const noOfStocks = 3;
      playerInstance.addStocks(hotelName, noOfStocks);
      const player = playerInstance.getDetails();
      assertEquals(player.stocks[hotelName], noOfStocks);
    });
  });
  describe("Deduct money method", () => {
    it("Should return the new money after deducting", () => {
      const moneyToDeduct = 1000;
      playerInstance.deductMoney(moneyToDeduct);
      const player = playerInstance.getDetails();
      assertEquals(player.money, 5000);
    });
  });

  describe("testing if user has sufficient fund to buy stocks", () => {
    it("if player have enough money to buy", () => {
      assertEquals(playerInstance.hasEnoughMoney(200), true);
    });

    it("if player do not have enough money to buy", () => {
      assertEquals(playerInstance.hasEnoughMoney(7000), false);
    });
  });

  describe("getting the game state", () => {
    it("1. getting the game state of the player", () => {
      const playerState = playerInstance.getDetails();
      const exceptedDetails = {
        id: 1,
        name: "Tom",
        tiles: [],
        stocks: {},
        money: 6000,
      };
      assertEquals(playerState, exceptedDetails);
    });

    it("2. getting the player state after some actions", () => {
      playerInstance.addStocks("sackson", 3);
      const playerState = playerInstance.getDetails();
      const exceptedDetails = {
        id: 1,
        name: "Tom",
        tiles: [],
        stocks: { "sackson": 3 },
        money: 6000,
      };
      assertEquals(playerState, exceptedDetails);
    });
  });

  describe("loading the player state", () => {
    it("1.loading the player details", () => {
      const playerDetails = {
        id: 1,
        name: "good",
        tiles: [],
        stocks: { "sackson": 3 },
        money: 6000,
      };
      playerInstance.loadGameState(playerDetails);
      const details = playerInstance.getDetails();
      assertEquals(details, playerDetails);
    });
  });

  describe("when player has stock of hotel", () => {
    it("then it should return true", () => {
      const playerDetails = {
        id: 1,
        name: "good",
        tiles: [],
        stocks: { sackson: 3 },
        money: 6000,
      };
      playerInstance.loadGameState(playerDetails);
      assertEquals(playerInstance.hasStock("sackson"), true);
    });
  });

  describe("when player doesn't have stock of a hotel", () => {
    it("then it should return false", () => {
      const playerDetails = {
        id: 1,
        name: "good",
        tiles: [],
        stocks: {},
        money: 6000,
      };
      playerInstance.loadGameState(playerDetails);
      assertEquals(playerInstance.hasStock("sackson"), false);
    });
  });

  describe("testing remove Stocks", () => {
    it("when it recieves num of stocks", () => {
      const playerDetails = {
        id: 1,
        name: "good",
        tiles: [],
        stocks: { sackson: 10 },
        money: 6000,
      };
      playerInstance.loadGameState(playerDetails);
      playerInstance.removeStocks("sackson", 2);
      assertEquals(playerInstance.getStockCount("sackson"), 8);
    });
  });
});
