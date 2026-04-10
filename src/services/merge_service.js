import { MERGE_STATE } from "../configs/merge_states.js";

export default class MergeService {
  #turnOrder;
  #currentDissolver;
  #mergeState;
  #affectedHotels;
  #players;
  #hotels;
  #board;
  #survivingHotel;
  #defunctHotel;
  #defuntHotelStakeHolders;
  #bonusHolderDetails = [];

  constructor(affectedHotels, players, hotels, board) {
    this.#players = players;
    this.#affectedHotels = affectedHotels;
    this.#hotels = hotels;
    this.#board = board;
    this.#turnOrder = 0;
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
        b.getStockCount(defunctHotel.name) -
        a.getStockCount(defunctHotel.name),
    );
    if (stakeholders.length === 1) {
      stakeholders[0].depositMoney(primaryBonus + secondaryBonus);
      const name = stakeholders[0].name;
      this.#bonusHolderDetails.push({
        name,
        amount: primaryBonus + secondaryBonus,
        type: "primary",
      });
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
      this.#bonusHolderDetails = primaryHolders.map((stakeholders) => ({
        name: stakeholders.name,
        amount: bonus,
        type: "primary",
      }));
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
    this.#bonusHolderDetails.push({
      name: primaryHolders[0].name,
      amount: primaryBonus,
      type: "primary",
    });
    const secondaryHolderDetails = secondaryStakeholder.map((stakeholders) => ({
      name: stakeholders.name,
      amount: dividedSecondaryBonus,
      type: "secondary",
    }));
    this.#bonusHolderDetails.push(secondaryHolderDetails);
  }

  #stakeHolders(hotelName) {
    return this.#players.filter((player) => player.hasStock(hotelName));
  }

  #detectMergeType(firstHotel, secondHotel) {
    if (firstHotel.getTiles().length === secondHotel.getTiles().length) {
      this.#mergeState = MERGE_STATE.equal;
      return;
    }

    this.#mergeState = MERGE_STATE.unequal;
  }

  get mergeState() {
    return this.#mergeState;
  }

  #mergeTwoEqual({ hotelName }) {
    if (this.#defunctHotel.name !== hotelName) {
      const temp = this.#survivingHotel;
      this.#survivingHotel = this.#defunctHotel;
      this.#defunctHotel = temp;
    }
    this.#defuntHotelStakeHolders = this.#stakeHolders(this.#defunctHotel.name);
    this.#mergeHotels();
  }

  #mergeTwoUnequal() {
    this.#defuntHotelStakeHolders = this.#stakeHolders(this.#defunctHotel.name);
    this.#mergeHotels();
    this.#mergeState = MERGE_STATE.dissolution;
  }

  handleMerge(data) {
    if (this.#mergeState === MERGE_STATE.equal) {
      this.#mergeTwoEqual(data);
      this.#mergeState = MERGE_STATE.dissolution;
      return { sucess: true };
    }
    this.#mergeTwoUnequal();
  }

  #mergeHotels() {
    this.#survivingHotel.addTiles([
      ...this.#defunctHotel.getTiles(),
      this.#board.lastTile,
    ]);
    this.#distributeBonus(this.#defuntHotelStakeHolders, this.#defunctHotel);
    this.#defunctHotel.dissolve();
  }

  #sellStocks({ sell_count }) {
    const hotelName = this.#defunctHotel.name;
    const currentStockPrice = this.#defunctHotel.calculateStockPrice();
    const stockValue = sell_count * currentStockPrice;
    this.#currentDissolver.removeStocks(hotelName, sell_count);
    this.#currentDissolver.depositMoney(stockValue);
  }

  dissolveStocks(data, currentPlayer) {
    this.#currentDissolver = currentPlayer;
    this.#sellStocks(data);
    return { "sucess": true };
  }
  getBonusHolderDetails() {
    return this.#bonusHolderDetails;
  }

  init() {
    const sortedHotels = this.#affectedHotels.sort(
      (a, b) => a.tiles.length - b.tiles.length,
    );
    const [defunctHotel, survivingHotel] = sortedHotels.map((hotel) =>
      this.#hotels.getHotel(hotel.name)
    );
    this.#defunctHotel = defunctHotel;
    this.#survivingHotel = survivingHotel;
    this.#detectMergeType(this.#defunctHotel, this.#survivingHotel);
    if (this.#mergeState === MERGE_STATE.unequal) {
      this.#mergeTwoUnequal();
    }
  }
}
