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
    return this.#player;
  }

  addInitialTiles(tiles) {
    const playerTiles = this.#player.tiles;
    tiles.map((tile) => playerTiles.push(tile));
  }

  removeTile(tile) {
    const tileIndex = this.#player.tiles.indexOf(tile);
    this.#player.tiles.splice(tileIndex, 1);
  }

  addNewTile(tile) {
    this.#player.tiles.push(tile);
  }
}
