const incrementStocks = (parent) => {
  const counter = parent.querySelector("span");
  const counterValue = parseInt(counter.innerText);
  counter.textContent = counterValue + 1;
};

const decrementStocks = (parent) => {
  const counter = parent.querySelector("span");
  const counterValue = parseInt(counter.innerText);
  counter.textContent = counterValue - 1;
};

const clickActions = {
  "incr": incrementStocks,
  "decr": decrementStocks,
};

export const handleCartUpdation = (action, parent) => {
  if (action in clickActions) {
    clickActions[action](parent);
  }
};
