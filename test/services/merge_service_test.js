import { beforeEach, describe, it } from "@std/testing/bdd";
import MergeService from "../../src/services/merge_service.js";
import { expect, fn } from "@std/expect";
// import { sellStocks } from "../../src/services/dissolution_controller.js";

describe("Test MergeService", () => {
  let disolvedHotel;
  let survivingHotel;
  let primaryStockHolder;
  let secondaryStockHolder;
  let nonStockHolder;
  let hotels;
  let board;

  beforeEach(() => {
    disolvedHotel = {
      tiles: new Array(3),
      getTiles: fn(() => new Array(3)),
      name: "disolved",
      dissolve: fn(),
      addTiles: fn(),
      bonuses: fn(() => ({ primaryBonus: 1000, secondaryBonus: 500 })),
      calculateStockPrice: fn(() => 100),
    };
    survivingHotel = {
      tiles: new Array(7),
      getTiles: fn(() => new Array(7)),
      name: "surviving",
      addTiles: fn(),
      dissolve: fn(),
      bonuses: fn(),
    };
    primaryStockHolder = {
      hasStock: fn(() => true),
      getStockCount: fn(() => 3),
      depositMoney: fn(),
      removeStocks: fn(),
    };
    secondaryStockHolder = {
      hasStock: fn(() => true),
      getStockCount: fn(() => 2),
      depositMoney: fn(),
      removeStocks: fn(),
    };
    nonStockHolder = {
      hasStock: fn(() => false),
      getStockCount: fn(() => 1),
      depositMoney: fn(),
      removeStocks: fn(),
    };
    hotels = {
      getHotel: fn((name) =>
        name === "surviving" ? survivingHotel : disolvedHotel
      ),
    };
    board = { lastTile: "3b" };
  });

  describe("merge two unequal hotels", () => {
    it("disolve hotel should go out of board", () => {
      const mergeService = new MergeService(
        [
          disolvedHotel,
          survivingHotel,
        ],
        [primaryStockHolder, nonStockHolder, secondaryStockHolder],
        hotels,
        board,
      );
      mergeService.init();

      expect(disolvedHotel.dissolve).toHaveBeenCalledTimes(1);
      expect(survivingHotel.addTiles).toHaveBeenCalledTimes(1);
      expect(survivingHotel.addTiles).toHaveBeenCalledWith([
        ...disolvedHotel.getTiles(),
        "3b",
      ]);
      expect(primaryStockHolder.depositMoney).toHaveBeenCalledWith(1000);
      expect(secondaryStockHolder.depositMoney).toHaveBeenCalledWith(500);
      expect(nonStockHolder.depositMoney).not.toHaveBeenCalled();
    });

    it("should sell stocks of dissolved hotel", () => {
      const mergeService = new MergeService(
        [
          disolvedHotel,
          survivingHotel,
        ],
        [primaryStockHolder, nonStockHolder, secondaryStockHolder],
        hotels,
        board,
      );
      mergeService.init();
      mergeService.dissolveStocks({ sell_count: 3 }, primaryStockHolder);
      expect(disolvedHotel.calculateStockPrice).toHaveBeenCalledTimes(1);
      expect(primaryStockHolder.removeStocks).toHaveBeenCalledWith(
        disolvedHotel.name,
        3,
      );
      expect(primaryStockHolder.depositMoney).toHaveBeenCalledWith(300);
    });
    // it("When there are more than one primary stakeholder of desolved hotel's ", () => {
    //   player1.stocks.sackson = 1;
    //   player2.stocks.sackson = 1;
    //   mergeService.init();
    //   mergeService.dissolveStocks({ stock_count: 4 }, player1);
    //   assertEquals(player1.money, 4700);
    //   // assertEquals(player2.money, 4700);
    // });

    // it("If the desolved hotel has only a single stakeholders", () => {
    //   delete player1.stocks.sackson;
    //   mergeService.init();
    //   assertEquals(player2.money, 7000);
    // });

    // it("A single primary and a single secondary stakeholder", () => {
    //   player1.stocks.sackson = 2;
    //   player2.stocks.sackson = 1;
    //   mergeService.init();
    //   assertEquals(hotels.getHotel("sackson").tiles.length, 0);
    //   assertEquals(hotels.getHotel("tower").tiles.length, 6);
    //   assertEquals(player1.money, 5400);
    //   assertEquals(player2.money, 4200);
    // });

    // it("A single primary and more than one secondary stakeholder", () => {
    //   player1.stocks.sackson = 2;
    //   player2.stocks.sackson = 1;
    //   player3.stocks.sackson = 1;

    //   mergeService.init();
    //   assertEquals(hotels.getHotel("sackson").tiles.length, 0);
    //   assertEquals(hotels.getHotel("tower").tiles.length, 6);
    //   assertEquals(player1.money, 5400);
    // });
  });

  // describe.ignore("merge two equal states", () => {
  //   it("When hotel are equal then it should return 'CHOOSE_MERGE_HOTEL'", () => {
  //     sackson.tiles.push("3a");
  //     mergeService.init();
  //     assertEquals(mergeService.mergeState, "EQUAL_HOTEL_MERGE");
  //   });
  // });
});
