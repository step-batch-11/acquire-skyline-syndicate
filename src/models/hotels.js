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

  buildHotel(hotelName, originTile, adjacentTilesForHotel) {
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

  addTilesToHotel(hotelName, tiles) {
    this.#hotels[hotelName].addTiles(tiles);
  }

  expand(tileId) {
    // Create instance once
    const hotel = Object.values(this.#hotels).find((hotel) => {
      const tiles = hotel.getTiles();

      return tiles.some((tile) => tile.isNeighbouringTile(new Tile(tileId)));
    });

    hotel.addTiles([new Tile(tileId)]);
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
      this.#hotels[hotelName.toLowerCase()].decreaseStockCount(selectedStocks);
    });
  }

  // Have method calculateMoney and extract things outside

  calculateMoneyToDeduct(cart) {
    return cart.reduce((calculatedMoney, { hotelName, selectedStocks }) => {
      return (calculatedMoney +=
        this.#hotels[hotelName.toLowerCase()].calculateStockPrice() *
        selectedStocks);
    }, 0);
  }
}
