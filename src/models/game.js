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

    return {
      player: this.#player.getDetails(),
      hotels: this.#hotels.getHotels(),
      tilesOnBoard: this.#board.getPlacedTiles(),
      state: this.#state,
    };
  }

  placeTile(tileId) {
    this.#board.place(new Tile(tileId));
    this.#state = "BUILD_HOTEL";
    const playerTiles = this.#player.removeTile(tileId);
    return {
      playerTiles,
      tilesOnBoard: this.#board.getPlacedTiles(),
      state: this.#state,
    };
  }

  assignNewTile() {
    const tile = this.#deck.drawTiles(1);
    const playerTiles = this.#player.addNewTile(tile);
    const tilesOnBoard = this.#board.getPlacedTiles();
    return { playerTiles, tilesOnBoard };
  }

  buyStocks(cart) {
    this.#hotels.decreaseHotelStocks(cart);
    const hotels = this.#hotels.getHotels();
    return { hotels };
  }
}
