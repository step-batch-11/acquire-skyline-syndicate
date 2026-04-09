import { beforeEach, describe, it } from "@std/testing/bdd";
import { assertEquals } from "@std/assert/equals";
import MergeService from "../../src/services/merge_service.js";

describe("Test MergeService", () => {
  let mergeService;
  let affectedHotels;
  let hotels;
  let player1;
  let player2;
  let player3;
  let players;
  let board;

  beforeEach(() => {
    affectedHotels = [
      {
        name: "sackson",
        tiles: ["1a", "2a"],
        getTiles() {
          return this.tiles;
        },
        calculateStockPrice() {
          return 200;
        },
        dissolve() {
          this.tiles = [];
        },
        bonuses() {
          return {
            primaryBonus: this.calculateStockPrice() * 10,
            secondaryBonus: this.calculateStockPrice() * 5,
          };
        },
      },
      {
        name: "tower",
        tiles: ["4a", "5a", "6a"],
        addTiles(tiles) {
          this.tiles.push(...tiles);
        },
      },
    ];
    hotels = {
      getHotel(hotelName) {
        return affectedHotels.find((hotel) => hotel.name === hotelName);
      },
    };
    player1 = {
      stocks: { sackson: 4, tower: 2 },
      money: 3000,
      hasStock(stockName) {
        return stockName in this.stocks;
      },
      depositMoney(money) {
        this.money += money;
      },
      sellStocks(hotelName, price) {
        this.money += price * this.stocks[hotelName];
      },
      getStockCount(name) {
        return this.stocks[name];
      },
    };
    player2 = {
      stocks: { sackson: 5, tower: 3 },
      money: 3000,
      hasStock(stockName) {
        return stockName in this.stocks;
      },
      depositMoney(money) {
        this.money += money;
      },
      sellStocks(hotelName, price) {
        this.money += price * this.stocks[hotelName];
      },
      getStockCount(name) {
        return this.stocks[name];
      },
    };
    player3 = {
      stocks: { sackson: 0, tower: 0 },
      money: 3000,
      hasStock(stockName) {
        return stockName in this.stocks;
      },
      getStockCount(name) {
        return this.stocks[name];
      },
      depositMoney(money) {
        this.money += money;
      },
      sellStocks(hotelName, price) {
        this.money += price * this.stocks[hotelName];
      },
    };
    players = [player1, player2];

    board = { lastTile: "3a" };

    mergeService = new MergeService(affectedHotels, players, hotels, board);
  });
  describe("merge two unequal hotels", () => {
    it("When there are more than one primary stakeholder of desolved hotel's ", () => {
      player1.stocks.sackson = 1;
      player2.stocks.sackson = 1;
      mergeService.mergeHotels();
      assertEquals(player1.money, 4700);
      assertEquals(player2.money, 4700);
    });

    it("If the desolved hotel has only a single stakeholders", () => {
      delete player1.stocks.sackson;
      mergeService.mergeHotels();
      assertEquals(player2.money, 7000);
    });

    it("A single primary and a single secondary stakeholder", () => {
      player1.stocks.sackson = 2;
      player2.stocks.sackson = 1;
      mergeService.mergeHotels();
      assertEquals(hotels.getHotel("sackson").tiles.length, 0);
      assertEquals(hotels.getHotel("tower").tiles.length, 6);
      assertEquals(player1.money, 5400);
      assertEquals(player2.money, 4200);
    });

    it("A single primary and more than one secondary stakeholder", () => {
      player1.stocks.sackson = 2;
      player2.stocks.sackson = 1;
      player3.stocks.sackson = 1;

      mergeService.mergeHotels();
      assertEquals(hotels.getHotel("sackson").tiles.length, 0);
      assertEquals(hotels.getHotel("tower").tiles.length, 6);
      assertEquals(player1.money, 5400);
    });
  });
});
