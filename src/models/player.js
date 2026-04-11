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

  get id() {
    return this.#id;
  }

  get name() {
    return this.#name;
  }

  getTilesInfo() {
    return this.#tiles.map((tile) => ({
      id: tile.id,
      isPlayable: tile.isPlayable,
    }));
  }

  getTileIds() {
    return this.#tiles.map((tile) => tile.id);
  }

  hasStock(hotelName) {
    return hotelName in this.#stocks;
  }

  isPlayerTile(tileId) {
    return this.#tiles.some((tile) => tile.id === tileId);
  }

  getStockCount(hotelName) {
    return this.#stocks[hotelName];
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

  addTiles(tile) {
    this.#tiles.push(...tile);
  }

  deductMoney(moneyToDeduct) {
    this.#money -= moneyToDeduct;
  }

  hasEnoughMoney(moneyToDeduct) {
    return moneyToDeduct <= this.#money;
  }

  getDetails() {
    return {
      id: this.#id,
      name: this.#name,
      tiles: this.getTilesInfo(),
      money: this.#money,
      stocks: { ...this.#stocks },
    };
  }

  depositMoney(money) {
    this.#money = this.#money + money;
  }

  removeHotelStocks(hotelName) {
    delete this.#stocks[hotelName];
  }

  removeStocks(hotelName, stocksCount) {
    this.#stocks[hotelName] = this.#stocks[hotelName] - stocksCount;
  }

  sellStocks(hotelName, price, stocksCount) {
    if (stocksCount > this.#stocks[hotelName]) {
      throw "Invalid number of stocks";
    }
    this.#money += price * stocksCount || 0;
    this.#stocks[hotelName] = this.#stocks[hotelName] - stocksCount;
  }

  loadGameState(playerDetails) {
    this.#id = playerDetails.id;
    this.#name = playerDetails.name;
    this.#money = playerDetails.money;
    this.#stocks = playerDetails.stocks;
    this.#tiles = playerDetails.tiles;
  }
}
