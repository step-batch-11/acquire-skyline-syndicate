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

  init(shuffleFn) {
    this.#deck.shuffleTiles(shuffleFn);
    // const initialTiles = this.#deck.drawTiles(6);
    // this.#board.placeTiles(initialTiles);
    const initialPlayerTiles = this.#deck.drawTiles(6);
    this.#player.addInitialTiles(initialPlayerTiles);

    return {
      player: this.#player.getDetails(),
      hotels: this.#hotels.getHotels(),
      tilesOnBoard: this.#board.getPlacedTiles(),
    };
  }

  placeTile(tile) {
    const tilesOnBoard = this.#board.getPlacedTiles();
    tilesOnBoard.push(tile);
    const playerTiles = this.#player.removeTile(tile);
    console.log(playerTiles);
    return { playerTiles, tilesOnBoard };
  }
}
