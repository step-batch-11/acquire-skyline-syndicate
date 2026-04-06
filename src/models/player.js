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

  getTileIds() {
    return this.#tiles.map((tile) => tile.id);
  }

  isPlayerTile(tileId) {
    return this.getTileIds().includes(tileId);
  }

  getDetails() {
    return {
      id: this.#id,
      name: this.#name,
      tiles: this.getTileIds(),
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
  }

  addStocks(hotelName, noOfStocks) {
    this.#stocks[hotelName] = this.#stocks[hotelName] || 0;
    this.#stocks[hotelName] += noOfStocks;
  }

  addNewTile(tile) {
    this.#tiles.push(...tile);
  }

  deductMoney(moneyToDeduct) {
    this.#money -= moneyToDeduct;
  }
}
