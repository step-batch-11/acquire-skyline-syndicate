const stakeHolders = (players, hotelName) => {
  return players.filter((player) => player.hasStock(hotelName));
};

export const sellStocks = (stakeholder, defunctHotel) => {
  stakeholder.sellStocks(defunctHotel.name, defunctHotel.calculateStockPrice());
};

export const distributeBonus = (players, defunctHotel) => {
  const stakeholders = stakeHolders(players, defunctHotel.name);
  const [primaryStakeHolder, secondaryStakeHolder] = stakeholders.sort(
    (a, b) =>
      b.getStockCount(defunctHotel.name) - a.getStockCount(defunctHotel.name),
  );
  const primaryBonus = defunctHotel.primaryBonus;
  const secondaryBonus = defunctHotel.secondaryBonus;

  if (stakeholders.length === 1) {
    primaryStakeHolder.depositMoney(primaryBonus + secondaryBonus);
    return;
  }
  primaryStakeHolder?.depositMoney(primaryBonus);
  secondaryStakeHolder?.depositMoney(secondaryBonus);
};
