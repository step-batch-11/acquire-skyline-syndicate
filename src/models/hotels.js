import { Hotel } from "./hotel.js";
import { Tile } from "./tile.js";

export class Hotels {
  #hotels;

  constructor(hotels) {
    this.#hotels = hotels;
  }

  getHotels() {
    return Object.values(this.#hotels).map((hotel) => hotel.getState());
  }

  foundHotel(hotelName, originTile, adjacentTilesForHotel) {
    const adjacents = adjacentTilesForHotel.map((tileId) => new Tile(tileId));
    this.#hotels[hotelName].found(originTile, adjacents);
  }

  isAnyInActiveHotel() {
    return Object.values(this.#hotels).some((hotel) => !hotel.isActive());
  }

  isTileInAnyHotel(tileId) {
    return Object.values(this.#hotels).some((hotel) =>
      hotel.tileIncludes(tileId)
    );
  }

  getAdjacentHotelChains(tiles) {
    const adjacents = new Set(tiles);
    return this.getHotels().filter(({ tiles }) =>
      tiles.some((tile) => adjacents.has(tile.id))
    );
  }

  getHotel(hotelName) {
    return this.#hotels[hotelName];
  }

  addTilesToHotel(hotelName, tiles) {
    this.#hotels[hotelName].addTiles(tiles);
  }

  expand(tileId, tilesOnBoard) {
    const tile = new Tile(tileId);

    const hotel = Object.values(this.#hotels).find((hotel) => {
      const tiles = hotel.getTiles();

      return tiles.some((hotelTile) => hotelTile.isNeighbouringTile(tile));
    });

    const allConnectedTiles = tile.getAllConnectedTiles(tilesOnBoard);
    const hotelTiles = hotel.getTiles().map((tile) => tile.id);
    const connectedFreeTiles = allConnectedTiles.filter(
      (connectedTile) => !hotelTiles.includes(connectedTile),
    );
    hotel.addTiles(connectedFreeTiles.map((tile) => new Tile(tile)));
    return hotel;
  }

  static instantiateHotels(hotelsInfo) {
    const hotels = hotelsInfo.reduce((hotels, { name, scale }) => {
      hotels[name] = new Hotel(name, scale);
      return hotels;
    }, {});

    return new Hotels(hotels);
  }

  deductStocks(cart) {
    cart.forEach(({ hotelName, selectedStocks }) => {
      this.#hotels[hotelName].decreaseStockCount(selectedStocks);
    });
  }

  calculateMoneyToDeduct(cart) {
    return cart.reduce(
      (calculatedMoney, { hotelName, selectedStocks }) =>
        calculatedMoney +
        this.#hotels[hotelName].calculateStockPrice() * selectedStocks,
      0,
    );
  }

  isHotelActive(hotelName) {
    return this.#hotels[hotelName].isActive();
  }

  areCartHotelsActive(cart) {
    return cart.every(({ hotelName }) => {
      return this.#hotels[hotelName].isActive();
    });
  }

  hasEnoughStocksToBuy(cart) {
    return cart.every(({ hotelName, selectedStocks }) =>
      this.#hotels[hotelName].canDeductStocksFromHotel(selectedStocks)
    );
  }

  getHotelsState() {
    return Object.values(this.#hotels).map((hotel) => hotel.getHotelState());
  }

  loadGameState(hotels) {
    hotels.forEach((hotelInfo) => {
      this.#hotels[hotelInfo.name].loadGameState(hotelInfo);
    });
  }
}
