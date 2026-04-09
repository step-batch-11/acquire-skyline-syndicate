import { beforeEach, describe, it } from "@std/testing/bdd";
import { assertEquals } from "@std/assert/equals";
import MergeService from "../../src/services/merge_service.js";

describe("Test MergeService", () => {
  let mergeService;
  const affectedHotels = [
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
    },
    {
      name: "tower",
      tiles: ["4a", "5a", "6a"],
      addTiles(tiles) {
        this.tiles.push(...tiles);
      },
    },
  ];

  const hotels = {
    getHotel(hotelName) {
      return affectedHotels.find((hotel) => hotel.name === hotelName);
    },
  };

  const player1 = {
    stocks: { sackson: 4, tower: 2 },
    money: 2000,
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

  const player2 = {
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

  const player3 = {
    stocks: {},
    hasStock(stockName) {
      return stockName in this.stocks;
    },
  };

  const players = [player1, player2, player3];

  const board = { lastTile: "3a" };

  beforeEach(() => {
    mergeService = new MergeService(affectedHotels, players, hotels, board);
  });
  describe("merge two unequal hotels", () => {
    it("should dissolve the hotel with smaller chain, surviving one's tile count should increase ", () => {
      mergeService.mergeHotels();
      assertEquals(hotels.getHotel("sackson").tiles.length, 0);
      assertEquals(hotels.getHotel("tower").tiles.length, 6);
      assertEquals(player1.money, 3800);
      assertEquals(player2.money, 6000);
    });
  });
});
