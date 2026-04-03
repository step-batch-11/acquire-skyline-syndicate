import { Hotel } from "./hotel.js";

export class Hotels {
  #hotels;

  constructor(hotels) {
    this.#hotels = hotels;
  }

  getHotels() {
    return Object
      .values(this.#hotels)
      .map((hotel) => hotel.getState());
  }

  buildHotel(hotelName, originTile, adjacentTilesForHotel) {
    this.#hotels[hotelName].found(originTile, adjacentTilesForHotel);
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

  static instantiateHotels(hotelsInfo) {
    const hotels = hotelsInfo.reduce((hotels, { name, scale }) => {
      hotels[name] = new Hotel(name, scale);
      return hotels;
    }, {});

    return new Hotels(hotels);
  }

  decreaseHotelStocks(cart) {
    cart.forEach(({ hotelName, selectedStocks }) => {
      this.#hotels[hotelName.toLowerCase()].decreaseStockCount(selectedStocks);
    });
  }
}
