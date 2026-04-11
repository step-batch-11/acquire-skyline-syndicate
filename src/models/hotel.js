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
    this.#originTile = {};
  }

  get name() {
    return this.#name;
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
    this.#tiles.push(...tiles);
  }

  removeHotelStocks(count) {
    this.#stocks -= count;
  }

  dissolve() {
    this.#tiles = [];
  }

  getTiles() {
    return [...this.#tiles];
  }

  setOriginTile(originTile) {
    this.#originTile = originTile;
  }

  calculateStockPrice() {
    if (this.#tiles.length === 0) return 0;
    const numberOfTiles = this.#getNumberOfTiles();
    return numberOfTiles * 100 + this.#priceOffset;
  }

  bonuses() {
    return {
      primaryBonus: this.calculateStockPrice() * 10,
      secondaryBonus: this.calculateStockPrice() * 5,
    };
  }

  getState() {
    const stockPrice = this.calculateStockPrice();
    return {
      name: this.#name,
      tiles: this.#tiles.map(({ id }) => ({ id })),
      stocksLeft: this.#stocks,
      stockPrice,
      originTile: { id: this.#originTile?.id || "" },
      isActive: this.isActive(),
    };
  }

  tileIncludes(tile) {
    return this.#tiles.some((hotelTile) => hotelTile.id === tile);
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
    this.decreaseStockCount(1);
  }

  canDeductStocksFromHotel(stocks) {
    return this.#stocks >= stocks && stocks >= 0;
  }

  getHotelState() {
    return {
      name: this.#name,
      tiles: this.#tiles,
      stocks: this.#stocks,
      priceOffset: this.#priceOffset,
      originTile: this.#originTile,
    };
  }

  loadGameState(hotelInfo) {
    this.#name = hotelInfo.name;
    this.#tiles = hotelInfo.tiles;
    this.#stocks = hotelInfo.stocks;
    this.#priceOffset = hotelInfo.priceOffset;
    this.#originTile = hotelInfo.originTile;
  }

  get primaryBonus() {
    return this.calculateStockPrice() * 10;
  }

  get secondaryBonus() {
    return this.calculateStockPrice() * 5;
  }

  get stocksCount() {
    return this.#stocks;
  }
}
