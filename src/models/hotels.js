import { Hotel } from "./hotel.js";

export class Hotels {
  #hotels;

  constructor(hotels) {
    this.#hotels = hotels;
  }

  getHotels() {
    const hotelsInfo = [];

    for (const name in this.#hotels) {
      const hotel = this.#hotels[name];
      hotelsInfo.push(hotel.getState());
    }

    return hotelsInfo;
  }

  static instantiateHotels(hotelsInfo) {
    const hotels = {};

    hotelsInfo.forEach(({ name, scale }) => {
      hotels[name] = new Hotel(name, scale);
    });

    return new Hotels(hotels);
  }
}
