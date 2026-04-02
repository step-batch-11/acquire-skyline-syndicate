export class Hotel {
  #name;
  #tiles;
  #stocks;
  #priceOffset;

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

  calculateStockPrice() {
    if (this.#tiles.length === 0) return 0;
    const numberOfTiles = this.#getNumberOfTiles();
    return numberOfTiles * 100 + this.#priceOffset;
  }

  getState() {
    const price = this.calculateStockPrice();
    return {
      name: this.#name,
      tileCount: this.#tiles.length,
      stocksLeft: this.#stocks,
      price,
    };
  }
}
