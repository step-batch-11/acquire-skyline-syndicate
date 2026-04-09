import {
  distributeBonus,
  sellStocks,
} from "../services/dissolution_controller.js";
import { Tile } from "./tile.js";
export class Game {
  #currentService;
  #mergeService;
  #deck;
  #board;
  #hotels;
  #currentPlayer;
  #state;
  #players;
  #currentPlayerIndex;
  #createMergeService;

  constructor(deck, board, hotels, players, createMergeService) {
    this.#deck = deck;
    this.#board = board;
    this.#hotels = hotels;
    this.#currentPlayerIndex = 0;
    this.#currentPlayer = players[this.#currentPlayerIndex];
    this.#players = players;
    this.#state = "PLACE_TILE";
    this.#createMergeService = createMergeService;
  }

  init() {
    const initialBoardTiles = this.#deck.drawTiles(6);
    initialBoardTiles.forEach((tile) => this.#board.place(tile));
    this.#players.forEach((player) => {
      const initialPlayerTiles = this.#deck.drawTiles(6);
      player.addInitialTiles(initialPlayerTiles.map((tile) => tile));
    });
  }

  calculateFinalWinner() {
    this.#hotels.getHotelEntities().forEach((hotel) => {
      distributeBonus(this.#players, hotel);
    });

    this.#hotels.getHotelEntities().forEach((hotel) => {
      this.#players.forEach((player) => {
        sellStocks(player, hotel);
      });
    });

    const players = this.#players
      .map((player) => {
        const { name, money } = player.getDetails();
        return { name, money };
      })
      .sort((a, b) => b.money - a.money);

    return {
      state: this.#state,
      players,
      winner: players[0].name,
    };
  }

  currentState(requestedPlayerId) {
    if (this.#state === "END_GAME") return this.calculateFinalWinner();
    return {
      player: this.#players
        .find((player) => player.id === requestedPlayerId)
        .getDetails(),
      currentPlayer: { name: this.#currentPlayer.name },
      hotels: this.#hotels.getHotels(),
      tilesOnBoard: this.#board.getPlacedTiles(),
      state: this.#state,
      players: this.#players.map((player) => ({
        name: player.name,
      })),
      isActivePlayer: this.#currentPlayer.id === requestedPlayerId,
    };
  }

  #isBuildPossible() {
    const adjacentTiles = this.#board.lastTile.neighbourTiles();
    const notInAnyHotel = !adjacentTiles.some((tile) =>
      this.#hotels.isTileInAnyHotel(tile)
    );

    return (
      this.#hotels.isAnyInActiveHotel() &&
      this.#board.hasAdjacentForLastTile() &&
      notInAnyHotel
    );
  }

  #isValidTilePlacement(tileId) {
    if (!this.#currentPlayer.isPlayerTile(tileId)) return false;
    if (this.#board.isTileOnBoard(tileId)) return false;
    return true;
  }

  #isExpansion() {
    const adjacentTiles = this.#board.lastTile.neighbourTiles();
    return adjacentTiles.some((tile) => this.#hotels.isTileInAnyHotel(tile));
  }

  #getAdjacentHotelChains() {
    const lastTile = this.#board.lastTile;
    const adjacentTiles = this.#board.adjacentTilesOf(lastTile);
    return this.#hotels.getAdjacentHotelChains(adjacentTiles);
  }

  #initiateMerge(adjacentHotelChains) {
    this.#mergeService = this.#createMergeService(
      adjacentHotelChains,
      this.#players,
      this.#hotels,
      this.#board,
    );
    this.#currentService = this.#mergeService;
  }

  #actionForTilePlacement(tileId) {
    const adjacentHotelChains = this.#getAdjacentHotelChains();
    if (adjacentHotelChains.length > 1) {
      this.#initiateMerge(adjacentHotelChains);
      this.#currentService.mergeHotels();
      return "BUY_STOCK";
    }
    if (this.#isBuildPossible()) {
      return "BUILD_HOTEL";
    }
    if (this.#isExpansion()) {
      this.expandHotel(tileId);
    }
    return "BUY_STOCK";
  }

  #areStocksValid(cart) {
    const totalStocks = cart.reduce(
      (count, { selectedStocks }) => (count += selectedStocks),
      0,
    );

    return totalStocks <= 3 && totalStocks >= 0;
  }

  #isValidPurchase(cart) {
    return (
      this.#areStocksValid(cart) &&
      this.#hotels.areCartHotelsActive(cart) &&
      this.#hotels.hasEnoughStocksToBuy(cart)
    );
  }

  #isActivePlayer(requestedPlayerId) {
    return this.#currentPlayer.id === requestedPlayerId;
  }

  placeTile(requestedPlayerId, tileId) {
    if (!this.#isActivePlayer(requestedPlayerId)) {
      throw new Error({ msg: "OUT OF TURN ACTION" });
    }
    if (this.#state !== "PLACE_TILE") {
      throw new Error({ msg: "INVALID STATE" });
    }
    if (!this.#isValidTilePlacement(tileId)) {
      throw new Error({ msg: "INVALID TILE PLACEMENT" });
    }

    this.#board.place(new Tile(tileId));
    this.#state = this.#actionForTilePlacement(tileId);
    this.#currentPlayer.removeTile(tileId);
    return { msg: "TILE PLACED SUCCESSFULLY" };
  }

  expandHotel(tileId) {
    const tilesOnBoard = this.#board.getPlacedTiles();
    this.#hotels.expand(tileId, tilesOnBoard);
  }

  buildHotel(requestedPlayerId, hotelName) {
    if (!this.#isActivePlayer(requestedPlayerId)) {
      throw new Error({ msg: "OUT OF TURN ACTION" });
    }
    if (this.#state !== "BUILD_HOTEL") {
      throw new Error({ msg: "INVALID STATE" });
    }
    if (this.#hotels.isHotelActive(hotelName)) {
      throw new Error({ msg: "HOTEL IS ALREADY ACTIVE" });
    }
    const lastTile = this.#board.lastTile;
    const adjacentTiles = this.#board.adjacentTilesOf(lastTile);
    this.#hotels.foundHotel(hotelName, lastTile, adjacentTiles);
    this.#currentPlayer.addStocks(hotelName, 1);
    this.#state = "BUY_STOCK";
    return { msg: "HOTEL BUILT SUCCESSFULLY" };
  }

  // getAdjacentHotelChainsForDeadTiles(tile) {
  //   const adjacentTiles = this.#board.getAdjacentTiles(tile);
  //   return this.#hotels.getAdjacentHotelChains(adjacentTiles);
  // }

  // exchangeDeadTiles() {
  //   const playerTiles = this.#currentPlayer.getTileIds();
  //   playerTiles.forEach((tile) => {
  //     this.#getAdjacentHotelChainsForDeadTiles(tile)
  //   }
  //   )

  // }

  assignNewTile() {
    const tile = this.#deck.drawTiles(1);
    this.#currentPlayer.addNewTile(tile);
  }

  buyStocks(requestedPlayerId, cart) {
    if (
      this.#state !== "BUY_STOCK" &&
      this.#isActivePlayer(requestedPlayerId)
    ) {
      return;
    }
    const moneyToDeduct = this.#hotels.calculateMoneyToDeduct(cart);
    const isValidBuy = this.#isValidPurchase(cart) &&
      this.#currentPlayer.hasEnoughMoney(moneyToDeduct);

    if (isValidBuy) {
      this.#hotels.deductStocks(cart);
      const hotels = this.#hotels.getHotels();
      cart.forEach(({ hotelName, selectedStocks }) =>
        this.#currentPlayer.addStocks(hotelName, selectedStocks)
      );

      this.#currentPlayer.deductMoney(moneyToDeduct);
      if (this.isGameEnd()) {
        this.#state = "END_GAME";
        return this.calculateFinalWinner();
      }
      this.#state = "SHIFT_TURN";
      const playerInfo = this.#currentPlayer.getDetails();
      return { hotels, playerInfo, state: this.#state };
    }
  }

  #areAllHotelsStable() {
    const hotels = this.#hotels.getHotels();
    //<S>  hotel.tiles.length > 1 && hotel.tiles.length >= 11 in every loop.
    const activeHotels = hotels.filter((hotel) => hotel.tiles.length > 1);
    return activeHotels.length > 0
      ? activeHotels.every((hotel) => hotel.tiles.length >= 11)
      : false;
  }

  #isAnyHotelHas41Tiles() {
    const hotels = this.#hotels.getHotels();
    return hotels.some((hotel) => hotel.tiles.length >= 41);
  }

  #areAllHandsEmpty() {
    return this.#players.every((player) => player.getTileIds().length === 0);
  }

  isGameEnd() {
    return (
      this.#areAllHotelsStable() ||
      this.#isAnyHotelHas41Tiles() ||
      this.#areAllHandsEmpty()
    );
  }

  shiftTurn(requestedPlayerId) {
    if (
      this.#state !== "SHIFT_TURN" &&
      this.#isActivePlayer(requestedPlayerId)
    ) {
      return;
    }
    this.assignNewTile();
    this.#currentPlayer =
      this.#players[++this.#currentPlayerIndex % this.#players.length];
    // this.exchangeDeadTiles()
    this.#state = "PLACE_TILE";
  }

  getCurrentGameState() {
    const players = this.#players.map((player) => player.getPlayerState());
    return {
      board: this.#board.getBoardState(),
      deck: this.#deck.getDeckState(),
      hotels: this.#hotels.getHotelsState(),
      players,
      state: this.#state,
      currentPlayerIndex: this.#currentPlayerIndex,
    };
  }

  loadGameState(data) {
    this.#state = data.state;
    this.#currentPlayer =
      data.players[data.currentPlayerIndex % data.players.length];
    this.#currentPlayerIndex = data.currentPlayerIndex;
    this.#deck.loadGameState(data.deck);
    this.#players = data.players;
    this.#board.loadGameState(data.board);
    this.#hotels.loadGameState(data.hotels);
  }
}
