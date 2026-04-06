import { Tile } from "./tile.js";

export class Game {
  #deck;
  #board;
  #hotels;
  #currentPlayer;
  #state;
  #players;
  #currentPlayerIndex;

  constructor(deck, board, hotels, players) {
    this.#deck = deck;
    this.#board = board;
    this.#hotels = hotels;
    this.#currentPlayerIndex = 0;
    this.#currentPlayer = players[this.#currentPlayerIndex];
    this.#players = players;
    this.#state = "PLACE_TILE";
  }

  init() {
    const initialBoardTiles = this.#deck.drawTiles(6);
    initialBoardTiles.forEach((tile) => this.#board.place(tile));
    this.#players.forEach((player) => {
      const initialPlayerTiles = this.#deck.drawTiles(6);
      player.addInitialTiles(initialPlayerTiles.map((tile) => tile));
    });
  }

  currentState() {
    return {
      currentPlayer: this.#currentPlayer.getDetails(),
      hotels: this.#hotels.getHotels(),
      tilesOnBoard: this.#board.getPlacedTiles(),
      state: this.#state,
      players: this.#players.map((player) => player.getDetails()),
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

  #isGoingToMerge() {
    const adjacentTiles = this.#board.adjacentTilesOfLastTile();
    return this.#hotels.getAdjacentHotelChains(adjacentTiles).length > 1;
  }

  #actionForTilePlacement(tileId) {
    if (this.#isGoingToMerge()) {
      this.#state = "MERGE";
      return;
    }
    if (this.#isExpansion()) {
      this.expandHotel(tileId);
      return;
    }
    if (this.#isBuildPossible()) {
      this.#state = "BUILD_HOTEL";
      return;
    }
    this.#state = "BUY_STOCK";
  }

  #isValidPurchase(cart) {
    const totalStocks = cart.reduce(
      (count, { selectedStocks }) => (count += selectedStocks),
      0,
    );
    const isSelectedHotelsActive = cart.every(({ hotelName }) =>
      this.#hotels.isHotelActive(hotelName.toLowerCase())
    );
    return totalStocks <= 3 && isSelectedHotelsActive;
  }

  placeTile(tileId) {
    if (this.#isValidTilePlacement(tileId)) {
      this.#board.place(new Tile(tileId));
      this.#actionForTilePlacement(tileId);

      const playerTiles = this.#currentPlayer.removeTile(tileId);
      return {
        playerTiles,
        tilesOnBoard: this.#board.getPlacedTiles(),
        state: this.#state,
      };
    }

    return {
      playerTiles: this.#currentPlayer.getTileIds(),
      tilesOnBoard: this.#board.getPlacedTiles(),
      state: "NO_ACTION",
    };
  }

  expandHotel(tileId) {
    const tilesOnBoard = this.#board.getPlacedTiles();
    this.#hotels.expand(tileId, tilesOnBoard);
    this.#state = "EXPAND_HOTEL";
  }

  buildHotel(hotelName) {
    if (this.#hotels.isHotelActive(hotelName)) return "hotel is already active";
    const lastTile = this.#board.lastTile;
    const adjacentTiles = this.#board.adjacentTilesOfLastTile();
    this.#hotels.foundHotel(hotelName, lastTile, adjacentTiles);
    this.#currentPlayer.addStocks(hotelName, 1);
  }

  assignNewTile() {
    const tile = this.#deck.drawTiles(1);
    this.#currentPlayer.addNewTile(tile);
  }

  buyStocks(cart) {
    const moneyToDeduct = this.#hotels.calculateMoneyToDeduct(cart);
    const isValidBuy = this.#isValidPurchase(cart) &&
      this.#currentPlayer.hasEnoughMoney(moneyToDeduct);

    if (isValidBuy) {
      this.#hotels.deductStocks(cart);
      const hotels = this.#hotels.getHotels();
      cart.forEach(({ hotelName, selectedStocks }) =>
        this.#currentPlayer.addStocks(hotelName.toLowerCase(), selectedStocks)
      );
      this.#currentPlayer.deductMoney(moneyToDeduct);
      const playerInfo = this.#currentPlayer.getDetails();
      return { hotels, playerInfo, state: this.#state };
    }
  }

  shiftTurn() {
    this.#currentPlayer =
      this.#players[++this.#currentPlayerIndex % this.#players.length];
    this.#state = "PLACE_TILE";
  }
}
