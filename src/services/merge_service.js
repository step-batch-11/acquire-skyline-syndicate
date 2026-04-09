export default class MergeService {
  #mergeState;
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

  #topStakeHolders(hotelName, stakeholders, bucket = []) {
    for (let index = 1; index < stakeholders.length; index++) {
      const stakeholder = stakeholders[index];
      if (
        stakeholder.getStockCount(hotelName) !==
          bucket.at(-1).getStockCount(hotelName)
      ) {
        return index;
      }
      bucket.push(stakeholder);
    }
  }

  #distributeBonus(stakeholders, defunctHotel) {
    const { primaryBonus, secondaryBonus } = defunctHotel.bonuses();

    stakeholders.sort(
      (a, b) =>
        b.getStockCount(defunctHotel.name) - a.getStockCount(defunctHotel.name),
    );

    if (stakeholders.length === 1) {
      stakeholders[0].depositMoney(primaryBonus + secondaryBonus);
      return;
    }

    const primaryHolders = [stakeholders[0]];
    const lastPrimary = this.#topStakeHolders(
      defunctHotel.name,
      stakeholders,
      primaryHolders,
    );

    if (primaryHolders.length > 1) {
      const bonusSum = primaryBonus + secondaryBonus;
      const bonus = bonusSum / primaryHolders.length;
      primaryHolders.forEach((stakeholder) => stakeholder.depositMoney(bonus));
      return;
    }
    const secondaryStakeholder = [stakeholders[lastPrimary]];
    this.#topStakeHolders(
      defunctHotel.name,
      stakeholders.slice(lastPrimary),
      secondaryStakeholder,
    );
    primaryHolders[0].depositMoney(primaryBonus);
    const dividedSecondaryBonus = secondaryBonus / secondaryStakeholder.length;
    secondaryStakeholder.forEach((s) => s.depositMoney(dividedSecondaryBonus));
  }

  #stakeHolders(hotelName) {
    return this.#players.filter((player) => player.hasStock(hotelName));
  }

  #detectMergeType(firstHotel, secondHotel) {
    if (firstHotel.getTiles().length === secondHotel.getTiles().length) {
      this.#mergeState = "CHOOSE_MERGE_HOTEL";
      return;
    }

    this.#mergeState = "MERGE_END";
  }

  get mergeState() {
    return this.#mergeState;
  }

  mergeHotels() {
    const sortedHotels = this.#affectedHotels.sort(
      (a, b) => a.tiles.length - b.tiles.length,
    );
    const [firstHotel, secondHotel] = sortedHotels.map((hotel) =>
      this.#hotels.getHotel(hotel.name)
    );

    this.#detectMergeType(firstHotel, secondHotel);

    const stakeholders = this.#stakeHolders(firstHotel.name);
    secondHotel.addTiles([...firstHotel.getTiles(), this.#board.lastTile]);
    this.#distributeBonus(stakeholders, firstHotel);
    const currentStockPrice = firstHotel.calculateStockPrice();
    this.#sellAllStocks(stakeholders, currentStockPrice, firstHotel.name);
    firstHotel.dissolve();
  }
}
