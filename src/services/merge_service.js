export default class MergeService {
  #affectedHotels;
  #players;
  #hotels;
  #board;
  constructor(affectedHotels, players, hotels, board) {
    this.#players = players;
    this.#affectedHotels = affectedHotels;
    this.#hotels = hotels;
    this.#board = board;
  }

  #sellAllStocks(stakeholders, price, hotelName) {
    stakeholders.forEach((stakeholder) =>
      stakeholder.sellStocks(hotelName, price)
    );
  }

  #distributeBonus(stakeholders, defunctHotel) {
    const [primary, secondary] = stakeholders.sort((a, b) =>
      a.getStockCount(defunctHotel.name) - b.getStockCount(defunctHotel.name)
    );
    const currentStockPrice = defunctHotel.calculateStockPrice();
    const primaryBonus = 10 * currentStockPrice;
    const secondaryBonus = 5 * currentStockPrice;
    console.log({ primaryBonus, secondaryBonus });
    primary?.depositMoney(primaryBonus);
    secondary?.depositMoney(secondaryBonus);
  }

  #stakeHolders(hotelName) {
    return this.#players.filter((player) => player.hasStock(hotelName));
  }

  mergeHotels() {
    const sortedHotels = this.#affectedHotels.sort(
      (a, b) => a.tiles.length - b.tiles.length,
    );
    const [defunctHotel, survivingHotel] = sortedHotels.map((hotel) =>
      this.#hotels.getHotel(hotel.name)
    );
    const stakeholders = this.#stakeHolders(defunctHotel.name);
    survivingHotel.addTiles([...defunctHotel.getTiles(), this.#board.lastTile]);
    this.#distributeBonus(stakeholders, defunctHotel);
    const currentStockPrice = defunctHotel.calculateStockPrice();
    this.#sellAllStocks(stakeholders, currentStockPrice, defunctHotel.name);
    defunctHotel.dissolve();
  }
}
