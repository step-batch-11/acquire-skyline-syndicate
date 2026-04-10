export const stakeHolders = (players, hotelName) => {
  return players.filter((player) => player.hasStock(hotelName));
};

export const sellStocks = (stakeholder, defunctHotel) => {
  stakeholder.sellStocks(defunctHotel.name, defunctHotel.calculateStockPrice());
};

const topStakeHolders = (hotelName, stakeholders, bucket = []) => {
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
};

export const distributeBonus = (stakeholders, defunctHotel) => {
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
  const lastPrimary = topStakeHolders(
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
  topStakeHolders(
    defunctHotel.name,
    stakeholders.slice(lastPrimary),
    secondaryStakeholder,
  );
  primaryHolders[0].depositMoney(primaryBonus);
  const dividedSecondaryBonus = secondaryBonus / secondaryStakeholder.length;
  secondaryStakeholder.forEach((s) => s.depositMoney(dividedSecondaryBonus));
};
