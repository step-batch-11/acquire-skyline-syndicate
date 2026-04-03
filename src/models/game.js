export class Game {
  #deck;
  #board;
  #hotels;
  #player;

  constructor(deck, board, hotels, player) {
    this.#deck = deck;
    this.#board = board;
    this.#hotels = hotels;
    this.#player = player;
  }

  init() {
    const initialPlayerTiles = this.#deck.drawTiles(6);
    this.#player.addInitialTiles(initialPlayerTiles);

    return {
      player: this.#player.getDetails(),
      hotels: this.#hotels.getHotels(),
      tilesOnBoard: this.#board.getPlacedTiles(),
    };
  }

  placeTile(tileId) {
    const tilesOnBoard = this.#board.getPlacedTiles();
    tilesOnBoard.push(tileId);
    const playerTiles = this.#player.removeTile(tileId);
    return { playerTiles, tilesOnBoard };
  }
}
