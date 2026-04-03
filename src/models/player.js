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

  getTiles() {
    return this.#tiles.map((tile) => tile.id);
  }

  getDetails() {
    return {
      id: this.#id,
      name: this.#name,
      tiles: structuredClone(this.getTiles()),
      money: this.#money,
      stocks: structuredClone(this.#stocks),
    };
  }

  addInitialTiles(tiles) {
    this.#tiles.push(...tiles);
  }

  removeTile(tileId) {
    const tileIndex = this.#tiles.findIndex(({ id }) => id === tileId);
    this.#tiles.splice(tileIndex, 1);
    return this.getTiles();
  }

  addNewTile(tile) {
    this.#tiles.push(...tile);
    return this.getTiles();
  }

  addStocks(hotelName, countOfStocks) {
    this.#stocks[hotelName] = this.#stocks[hotelName] || 0;
    this.#stocks[hotelName] += countOfStocks;
  }
}
