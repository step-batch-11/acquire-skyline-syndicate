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

  getTiles(tiles) {
    return tiles.map((tile) => tile.id);
  }

  getDetails() {
    return {
      id: this.#id,
      name: this.#name,
      tiles: structuredClone(this.getTiles(this.#tiles)),
      money: this.#money,
      stocks: structuredClone(this.#stocks),
    };
  }

  addInitialTiles(tiles) {
    const playerTiles = this.#tiles;
    tiles.map((tile) => playerTiles.push(tile));
  }

  removeTile(tileId) {
    const tileIndex = this.#tiles.findIndex(({ id }) => id === tileId);
    this.#tiles.splice(tileIndex, 1);
    return this.getTiles(this.#tiles);
  }

  addNewTile(tileId) {
    this.#tiles.push(tileId);
  }
}
