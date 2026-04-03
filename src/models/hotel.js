export class Hotel {
  #name;
  #tiles;
  #stocks;
  #priceOffset;
  #originTile;

  constructor(name, priceOffset) {
    this.#name = name;
    this.#stocks = 25;
    this.#tiles = [];
    this.#priceOffset = priceOffset;
  }

  #getNumberOfTiles() {
    const count = this.#tiles.length;

    if (count <= 5) return count;
    if (count <= 10) return 6;
    if (count <= 20) return 7;
    if (count <= 30) return 8;
    if (count <= 40) return 9;
    return 10;
  }

  addTiles(tiles) {
    this.#tiles.push(...[...tiles, this.#originTile]);
  }

  setOriginTile(originTile) {
    this.#originTile = originTile;
  }

  #calculateStockPrice() {
    if (this.#tiles.length === 0) return 0;
    const numberOfTiles = this.#getNumberOfTiles();
    return (numberOfTiles * 100) + this.#priceOffset;
  }

  getState() {
    const stockPrice = this.#calculateStockPrice();
    return {
      name: this.#name,
      tiles: structuredClone(this.#tiles),
      stocksLeft: this.#stocks,
      stockPrice,
      originTile: this.#originTile,
      isActive: this.isActive(),
    };
  }

  isActive() {
    return this.#tiles.length > 0;
  }

  decreaseStockCount(count) {
    this.#stocks -= count;
  }

  found(originTile, adjacentTiles) {
    this.setOriginTile(originTile);
    this.addTiles(adjacentTiles);
  }
}
