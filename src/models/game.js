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
    this.#state = "";
  }

  init() {
    const initialBoardTiles = this.#deck.drawTiles(6);
    initialBoardTiles.forEach((tile) => this.#board.place(tile));
    this.#players.forEach((player) => {
      const initialPlayerTiles = this.#deck.drawTiles(6);
      player.addInitialTiles(initialPlayerTiles);
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
    const tileNotInAnyHotel = !adjacentTiles.some((tile) =>
      this.#hotels.isTileInAnyHotel(tile)
    );
    return (
      this.#hotels.isAnyInActiveHotel() &&
      this.#board.hasAdjacentForLastTile() && tileNotInAnyHotel
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

  #actionForTilePlacement(tileId) {
    if (this.#isBuildPossible()) this.#state = "BUILD_HOTEL";
    else if (this.#isExpansion(tileId)) this.expandHotel(tileId);
    else this.#state = "NO_ACTION";
  }

  placeTile(tileId) {
    if (this.#isValidTilePlacement(tileId)) {
      this.#board.place(new Tile(tileId));
      this.#actionForTilePlacement(tileId);

      if (this.#isExpansion(tileId)) this.expandHotel(tileId);

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
    this.#hotels.expand(tileId);
    this.#state = "EXPAND_HOTEL";
  }

  buildHotel(hotelName) {
    const lastTile = this.#board.lastTile;
    const adjacentTiles = this.#board.adjacentTilesOfLastTile();
    this.#hotels.buildHotel(hotelName, lastTile, adjacentTiles);
    this.#currentPlayer.addStocks(hotelName, 1);
  }

  assignNewTile() {
    const tile = this.#deck.drawTiles(1);
    this.#currentPlayer.addNewTile(tile);
    this.#board.getPlacedTiles();
  }

  buyStocks(cart) {
    this.#hotels.deductStocks(cart);
    const hotels = this.#hotels.getHotels();
    cart.forEach(({ hotelName, selectedStocks }) =>
      this.#currentPlayer.addStocks(hotelName.toLowerCase(), selectedStocks)
    );
    const moneyToDeduct = this.#hotels.calculateMoneyToDeduct(cart);
    this.#currentPlayer.deductMoney(moneyToDeduct);
    const playerInfo = this.#currentPlayer.getDetails();
    return { hotels, playerInfo };
  }

  shiftTurn() {
    this.#currentPlayer =
      this.#players[++this.#currentPlayerIndex % this.#players.length];
  }
}
