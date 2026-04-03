import { Tile } from "./tile.js";

export class Game {
  #deck;
  #board;
  #hotels;
  #player;
  #state;

  constructor(deck, board, hotels, player) {
    this.#deck = deck;
    this.#board = board;
    this.#hotels = hotels;
    this.#player = player;
    this.#state = "";
  }

  init() {
    const initialBoardTiles = this.#deck.drawTiles(6);
    const initialPlayerTiles = this.#deck.drawTiles(6);
    initialBoardTiles.forEach((tile) => this.#board.place(tile));
    this.#player.addInitialTiles(initialPlayerTiles);
  }

  currentState() {
    return {
      player: this.#player.getDetails(),
      hotels: this.#hotels.getHotels(),
      tilesOnBoard: this.#board.getPlacedTiles(),
      state: this.#state,
    };
  }

  isValidTilePlacement(tileId) {
    if (!this.#player.isPlayerTile(tileId)) return false;
    if (this.#board.isTileOnBoard(tileId)) return false;
    return true;
  }

  placeTile(tileId) {
    console.log(this.isValidTilePlacement(tileId));

    if (this.isValidTilePlacement(tileId)) {
      this.#board.place(new Tile(tileId));
      this.#state = "BUILD_HOTEL";
      const playerTiles = this.#player.removeTile(tileId);
      return {
        playerTiles,
        tilesOnBoard: this.#board.getPlacedTiles(),
        state: this.#state,
      };
    }

    return {
      playerTiles: this.#player.getTileIds(),
      tilesOnBoard: this.#board.getPlacedTiles(),
      state: this.#state,
    };
  }

  buildHotel(hotelName) {
    const lastTile = this.#board.lastTile;
    const adjacentTiles = this.#board.adjacentTiles(lastTile);

    this.#hotels.buildHotel(hotelName, lastTile, adjacentTiles);
    this.#player.addStocks(hotelName, 1);
  }

  assignNewTile() {
    const tile = this.#deck.drawTiles(1);
    const playerTiles = this.#player.addNewTile(tile);
    const tilesOnBoard = this.#board.getPlacedTiles();
    return { playerTiles, tilesOnBoard };
  }
}
