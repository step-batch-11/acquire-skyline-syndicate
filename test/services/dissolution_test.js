import { beforeEach, describe, it } from "@std/testing/bdd";
import { assertEquals } from "@std/assert/equals";
import { Player } from "../../src/models/player.js";
import { Hotel } from "../../src/models/hotel.js";
import {
  distributeBonus,
  sellStocks,
  stakeHolders,
} from "../../src/services/dissolution_controller.js";
import { assert } from "@std/assert/assert";

const populatedHotelInstance = (hotelData) => {
  const hotel = new Hotel("", 0);
  hotel.loadGameState(hotelData);
  return hotel;
};

describe("Testing the dissolution controllers", () => {
  let players;
  let player1;
  let player2;
  let player3;
  let imperial;
  let continental;
  let festival;
  const hotelState = [
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
  beforeEach(() => {
    player1 = new Player("Gopi", 1);
    player1.addStocks("imperial", 3);
    player1.addStocks("festival", 3);
    player1.addStocks("continental", 5);
    player1.addStocks("continental", 5);

    player2 = new Player("Dilli", 2);
    player2.addStocks("festival", 3);
    player2.addStocks("continental", 3);

    player3 = new Player("Som", 3);
    players = [player1, player2, player3];
    imperial = populatedHotelInstance(hotelState[0]);
    continental = populatedHotelInstance(hotelState[1]);
    festival = populatedHotelInstance(hotelState[2]);
  });

  describe("get the stake holders of a hotel from players", () => {
    it("get the stock holder of festival", () => {
      const stakeholders = stakeHolders(players, "festival");
      stakeholders.forEach((stakeHolder) => {
        assert(stakeHolder instanceof Player);
      });
      assertEquals(stakeholders, [player1, player2]);
    });

    it("get the stock holder of imperial", () => {
      const stakeholders = stakeHolders(players, "imperial");
      stakeholders.forEach((stakeHolder) => {
        assert(stakeHolder instanceof Player);
      });
      assertEquals(stakeholders, [player1]);
    });
  });

  describe.ignore("sell stocks", () => {
    it("Player sell stocks of Festival", () => {
      const previousState = player1.getDetails();
      sellStocks(player1, imperial);
      const currentState = player1.getDetails();
      assertEquals(
        currentState.money,
        previousState.stocks.imperial * imperial.calculateStockPrice() +
          previousState.money,
      );
    });

    it("Player sell stocks of which they doesn't have", () => {
      const previousState = player2.getDetails();
      sellStocks(player2, imperial);
      const currentState = player2.getDetails();
      assertEquals(currentState.money, previousState.money);
    });
  });

  describe("Distribute Primary and Secondary Bonuses", () => {
    it("Imperial being CLOSED. Player is sole stakeHolder", () => {
      const previousState = player1.getDetails();
      distributeBonus(stakeHolders(players, "imperial"), imperial);
      const currentState = player1.getDetails();
      assertEquals(
        currentState.money,
        imperial.primaryBonus + imperial.secondaryBonus + previousState.money,
      );
    });

    it("Imperial being CLOSED. Player is not a stakeHolder", () => {
      const previousState = player2.getDetails();
      distributeBonus(stakeHolders(players, "imperial"), imperial);
      const currentState = player2.getDetails();
      assertEquals(currentState.money, previousState.money);
    });

    it("Imperial being CLOSED. 2 Player are stakeHolder", () => {
      const previousState2 = player2.getDetails();
      const previousState1 = player1.getDetails();
      distributeBonus(stakeHolders(players, "continental"), continental);
      const currentState2 = player2.getDetails();
      const currentState1 = player1.getDetails();
      assertEquals(
        currentState2.money,
        previousState2.money + continental.secondaryBonus,
      );
      assertEquals(
        currentState1.money,
        previousState1.money + continental.primaryBonus,
      );
    });

    it("Festival being CLOSED. 2 Player are primary stakeHolder", () => {
      const previousState2 = player2.getDetails();
      const previousState1 = player1.getDetails();
      distributeBonus(stakeHolders(players, "festival"), festival);
      const currentState2 = player2.getDetails();
      const currentState1 = player1.getDetails();
      assertEquals(
        currentState2.money,
        previousState2.money +
          (festival.primaryBonus + festival.secondaryBonus) / 2,
      );
      assertEquals(
        currentState1.money,
        previousState1.money +
          (festival.primaryBonus + festival.secondaryBonus) / 2,
      );
    });

    it("Festival being CLOSED. 1 is primary and 2 Player are secondary stakeHolder", () => {
      player3.addStocks("festival", 5);
      const previousState3 = player3.getDetails();
      const previousState2 = player2.getDetails();
      const previousState1 = player1.getDetails();
      distributeBonus(stakeHolders(players, "festival"), festival);
      const currentState3 = player3.getDetails();
      const currentState2 = player2.getDetails();
      const currentState1 = player1.getDetails();
      assertEquals(
        currentState3.money,
        previousState3.money + festival.primaryBonus,
      );
      assertEquals(
        currentState1.money,
        previousState1.money + festival.secondaryBonus / 2,
      );
      assertEquals(
        currentState2.money,
        previousState2.money + festival.secondaryBonus / 2,
      );
    });
  });
});
