import { gameStates } from "../configs/game_states_config.js";
import { MERGE_STATE } from "../configs/merge_states.js";
import {
  distributeBonus,
  sellStocks,
} from "../services/dissolution_controller.js";
import { Tile } from "./tile.js";

export class Game {
  #currentService;
  #mergeService = null;
  #deck;
  #board;
  #hotels;
  #currentPlayer;
  #state;
  #players;
  #currentPlayerIndex;
  #createMergeService;
  #notification = {};
  #mergeState;

  constructor(deck, board, hotels, players, createMergeService) {
    this.#deck = deck;
    this.#board = board;
    this.#hotels = hotels;
    this.#currentPlayerIndex = 0;
    this.#currentPlayer = players[this.#currentPlayerIndex];
    this.#players = players;
    this.#state = gameStates.placeTile;
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

  #notifyInactivePlayers(requestedPlayerId, notification) {
    if (requestedPlayerId !== notification.playerId) {
      return { type: notification.type, data: notification.data };
    }
    return {};
  }

  #notifyCurrentPlayer(requestedPlayerId, notification) {
    if (requestedPlayerId === notification.playerId) {
      return { type: notification.type, data: notification.data };
    }
    return {};
  }

  #notifyAllPlayers(_requestedPlayerId, notification) {
    return { type: notification.type, data: notification.data };
  }

  #generateNotification(requestedPlayerId, notification) {
    if (Object.keys(notification).length === 0) return {};

    const notificationHandler = {
      DEAD_TILE_EXCHANGE: this.#notifyCurrentPlayer,
      BUYING_STOCKS: this.#notifyInactivePlayers,
      INSUFFICIENT_FUNDS: this.#notifyCurrentPlayer,
      MERGER_BONUS: this.#notifyAllPlayers,
    };
    const intervalId = setInterval(() => {
      this.#notification = {};
      clearInterval(intervalId);
    }, 1000);

    return notificationHandler[notification.type](
      requestedPlayerId,
      notification,
    );
  }

  currentState(requestedPlayerId) {
    if (this.#state === "END_GAME") return this.calculateFinalWinner();
    if (this.#mergeService && this.#mergeService.mergeState === "END_MERGE") {
      this.#state = "BUY_STOCK";
      this.#currentPlayer =
        this.#players[this.#currentPlayerIndex % this.#players.length];
      this.#mergeService = null;
      this.#mergeState = null;
    }
    // <change>
    if (this.#state === MERGE_STATE.dissolution) {
      this.#currentPlayer = this.#mergeService.currentDissolver;
    }

    return {
      notification: this.#generateNotification(
        requestedPlayerId,
        this.#notification,
      ),
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
      mergeData: {
        mergeState: this.#mergeService?.mergeState,
      },
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
    if (this.#board.isTileOnBoard(tileId)) return false;
    if (!this.#currentPlayer.isPlayerTile(tileId)) return false;
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

  #changeStateAfterMergeEnd() {
    if (this.#mergeService.mergeState === "MERGE_END") {
      this.#state = "BUY_STOCK";
    }
    // this.#mergeState = this.#mergeService.mergeState;
    this.#state = this.#mergeService.mergeState;
  }

  #initiateMerge(adjacentHotelChains) {
    this.#mergeService = this.#createMergeService(
      adjacentHotelChains,
      this.#players,
      this.#hotels,
      this.#board,
    );
    this.#currentService = this.#mergeService;
    this.#currentService.init();
    const bonusHoldersDetails = this.#currentService.getBonusHoldersDetails();
    this.#createNotificationData("MERGER_BONUS", bonusHoldersDetails);
  }

  #actionForTilePlacement(tileId) {
    const adjacentHotelChains = this.#getAdjacentHotelChains();
    if (adjacentHotelChains.length > 1) {
      this.#initiateMerge(adjacentHotelChains);
      // this.#mergeService.handleMerge();
      this.#changeStateAfterMergeEnd();
      return;
    }

    if (this.#isBuildPossible()) {
      this.#state = "BUILD_HOTEL";
      return;
    }

    if (this.#isExpansion()) {
      this.expandHotel(tileId);
    }

    this.#state = "BUY_STOCK";
  }

  #areStocksValid(cart) {
    const totalStocks = cart.reduce(
      (count, { selectedStocks }) => (count += selectedStocks),
      0,
    );

    return totalStocks <= 3;
  }

  #isValidPurchase(cart, moneyToDeduct) {
    return (
      this.#areStocksValid(cart) &&
      this.#hotels.areCartHotelsActive(cart) &&
      this.#hotels.hasEnoughStocksToBuy(cart) &&
      this.#currentPlayer.hasEnoughMoney(moneyToDeduct)
    );
  }

  #isActivePlayer(requestedPlayerId) {
    return this.#currentPlayer.id === requestedPlayerId;
  }

  mergeEqualHotels(data) {
    const state = this.#currentService.mergeEqualHotels(data);
    this.#state = state;
    return state;
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
    this.#actionForTilePlacement(tileId);
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

  getAdjacentHotelChainsOfTile(tile) {
    const adjacentTiles = this.#board.getAdjacentTiles(tile);
    return this.#hotels.getAdjacentHotelChains(adjacentTiles);
  }

  isDeadTile(tile) {
    const newTile = new Tile(tile);
    const adjacentHotelChains = this.getAdjacentHotelChainsOfTile(newTile);
    const stableHotels = adjacentHotelChains.filter(
      ({ tiles }) => tiles.length > 10,
    );
    return stableHotels.length > 1;
  }

  getExchangedTiles(set1, set2) {
    const removedTiles = set1.filter((tile) => !set2.includes(tile));
    const newTiles = set2.filter((tile) => !set1.includes(tile));
    return { removedTiles, newTiles };
  }

  exchangeDeadTiles() {
    const playerPreviousTiles = this.#currentPlayer.getTileIds();
    playerPreviousTiles.forEach((tile) => {
      if (this.isDeadTile(tile)) {
        this.#currentPlayer.removeTile(tile);
        this.assignNewTile();
      }
    });
    const playerNewTiles = this.#currentPlayer.getTileIds();
    const exchangedTiles = this.getExchangedTiles(
      playerPreviousTiles,
      playerNewTiles,
    );
    if (exchangedTiles.removedTiles.length !== 0) {
      this.#createNotificationData("DEAD_TILE_EXCHANGE", exchangedTiles);
    }
  }

  assignNewTile() {
    const [tile] = this.#deck.drawTiles(1);
    if (tile === undefined) return;
    if (this.isDeadTile(tile.id)) {
      return this.assignNewTile();
    }
    this.#currentPlayer.addTiles([tile]);
  }

  #createNotificationData(type, data) {
    this.#notification.type = type;
    this.#notification.data = data;
    this.#notification.playerId = this.#currentPlayer.id;
  }

  buyStocks(requestedPlayerId, cart) {
    if (!this.#isActivePlayer(requestedPlayerId)) {
      throw new Error({ msg: "OUT OF TURN ACTION" });
    }
    if (this.#state !== "BUY_STOCK") {
      throw new Error({ msg: "INVALID STATE" });
    }

    const moneyToDeduct = this.#hotels.calculateMoneyToDeduct(cart);
    const hasEnoughBalance = this.#currentPlayer.hasEnoughMoney(moneyToDeduct);
    const isValidBuy = this.#isValidPurchase(cart, moneyToDeduct) &&
      hasEnoughBalance;

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
      this.#createNotificationData("BUYING_STOCKS", { cart });
      return { hotels, playerInfo, state: this.#state };
    }
    if (!hasEnoughBalance) {
      this.#createNotificationData("INSUFFICIENT_FUNDS", {
        hasEnoughBalance: false,
      });
    }
  }

  #areAllHotelsStable() {
    const hotels = this.#hotels.getHotels();
    //<S>  hotel.tiles.length > 1 && hotel.tiles.length >= 11 in every loop.
    const activeHotels = hotels.filter((hotel) => hotel.tiles.length > 1);
    return (
      activeHotels.length > 0 &&
      activeHotels.every((hotel) => hotel.tiles.length >= 11)
    );
  }

  #isAnyHotelHas41Tiles() {
    const hotels = this.#hotels.getHotels();
    return hotels.some((hotel) => hotel.tiles.length >= 41);
  }

  #areAllHandsEmpty() {
    return this.#players.every((player) => player.getTilesInfo().length === 0);
  }

  isGameEnd() {
    return (
      this.#areAllHotelsStable() ||
      this.#isAnyHotelHas41Tiles() ||
      this.#areAllHandsEmpty()
    );
  }

  shiftTurn(requestedPlayerId) {
    if (!this.#isActivePlayer(requestedPlayerId)) {
      throw new Error({ msg: "OUT OF TURN ACTION" });
    }
    if (this.#state !== "SHIFT_TURN") {
      throw new Error({ msg: "INVALID STATE" });
    }

    this.assignNewTile();
    this.#currentPlayer =
      this.#players[++this.#currentPlayerIndex % this.#players.length];
    this.exchangeDeadTiles();
    this.#state = "PLACE_TILE";
    return { msg: "TURN SHIFTED SUCCESSFULLY" };
  }

  handleStockDissolution(body) {
    const res = this.#mergeService.dissolveStocks(body, this.#currentPlayer);
    // this.#currentPlayerIndex += 1;
    // this.#currentPlayer =
    //   this.#players[this.#currentPlayerIndex % this.#players.length];
    return res;
  }

  getCurrentGameState() {
    const players = this.#players.map((player) => player.getDetails());
    return {
      board: this.#board.getBoardState(),
      deck: this.#deck.tiles,
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
    this.#deck.tiles = data.deck;
    this.#players = data.players;
    this.#board.loadGameState(data.board);
    this.#hotels.loadGameState(data.hotels);
  }
}

//http://localhost:8000/state?name=merge/two_equal
