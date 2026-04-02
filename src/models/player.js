export class Player {
  #id;
  #name;
  #tiles;
  #money;
  #stocks;

  constructor(name, playerId) {
    this.#id = playerId;
    this.#name = name;
    this.#tiles = [];
    this.#money = 6000;
    this.#stocks = {};
  }

  getDetails() {
    return {
      id: this.#id,
      name: this.#name,
      tiles: structuredClone(this.#tiles),
      money: this.#money,
      stocks: structuredClone(this.#stocks),
    };
  }

  addInitialTiles(tiles) {
    const playerTiles = this.#tiles;
    tiles.map((tile) => playerTiles.push(tile));
  }

  removeTile(tile) {
    const tileIndex = this.#tiles.indexOf(tile);
    this.#tiles.splice(tileIndex, 1);
  }

  addNewTile(tile) {
    this.#tiles.push(tile);
  }
}
