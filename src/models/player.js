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

  getTileIds() {
    return this.#tiles.map((tile) => ({
      tileId: tile.id,
      isPlayable: tile.isPlayable,
    }));
  }

  hasStock(hotelName) {
    return hotelName in this.#stocks;
  }

  isPlayerTile(tileId) {
    return this.getTileIds().some((tile) => tile.tileId === tileId);
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

  addNewTile(tile) {
    this.#tiles.push(...tile);
  }

  deductMoney(moneyToDeduct) {
    this.#money -= moneyToDeduct;
  }

  hasEnoughMoney(moneyToDeduct) {
    return moneyToDeduct <= this.#money;
  }

  getPlayerState() {
    return {
      id: this.#id,
      name: this.#name,
      tiles: structuredClone(this.#tiles),
      money: this.#money,
      stocks: structuredClone(this.#stocks),
    };
  }

  depositMoney(money) {
    this.#money = this.#money + money;
  }

  removeHotelStocks(hotelName) {
    delete this.#stocks[hotelName];
  }

  sellStocks(hotelName, price) {
    this.#money += price * this.#stocks[hotelName] || 0;
    delete this.#stocks[hotelName];
  }

  loadGameState(playerDetails) {
    this.#id = playerDetails.id;
    this.#name = playerDetails.name;
    this.#money = playerDetails.money;
    this.#stocks = playerDetails.stocks;
    this.#tiles = playerDetails.tiles;
  }
}
