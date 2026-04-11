export const stakeHolders = (players, hotelName) => {
  return players.filter((player) => player.hasStock(hotelName));
};

export const sellStocks = (stakeholder, defunctHotel) => {
  const stockCount = stakeholder.getStockCount(defunctHotel.name);
  stakeholder.sellStocks(
    defunctHotel.name,
    defunctHotel.calculateStockPrice(),
    stockCount,
  );
};

const getStakeholdersByStock = (hotelName, stakeholders) => {
  const map = new Map();

  stakeholders.forEach((stakeholder) => {
    const count = stakeholder.getStockCount(hotelName);

    if (count === 0) {
      return;
    } // ignore non-holders

    if (!map.has(count)) {
      map.set(count, []);
    }

    map.get(count).push(stakeholder);
  });

  // Convert to sorted array (highest stock first)
  return [...map.entries()]
    .sort((a, b) => b[0] - a[0])
    .map(([count, holders]) => ({
      stockCount: count,
      holders,
    }));
};

const depositMoneyToStakeHolders = (stakeholders, bonusAmount) => {
  const bonus = Math.floor(bonusAmount / stakeholders.length);
  stakeholders.forEach((stakeHolder) => stakeHolder.depositMoney(bonus));
};

export const distributeBonus = (stakeholders, defunctHotel) => {
  const primaryBonus = defunctHotel.primaryBonus;
  const secondaryBonus = defunctHotel.secondaryBonus;
  const stakeHoldersByStock = getStakeholdersByStock(
    defunctHotel.name,
    stakeholders,
  );

  if (stakeHoldersByStock.length === 0) {
    return;
  }

  if (stakeHoldersByStock.length === 1) {
    depositMoneyToStakeHolders(
      stakeHoldersByStock[0].holders,
      primaryBonus + secondaryBonus,
    );
    return;
  }

  const [primaryStackHolders, secondaryStakeHolders] = stakeHoldersByStock;

  if (primaryStackHolders.holders.length > 1) {
    depositMoneyToStakeHolders(
      primaryStackHolders.holders,
      primaryBonus + secondaryBonus,
    );
    return;
  }

  depositMoneyToStakeHolders(primaryStackHolders.holders, primaryBonus);
  depositMoneyToStakeHolders(secondaryStakeHolders.holders, secondaryBonus);
  return;
};
