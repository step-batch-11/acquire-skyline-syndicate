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

export const handleClickActions = (e) => {
  const action = e.target.dataset.action;
  const parent = e.target.parentElement;
  if (action in clickActions) {
    clickActions[action](parent);
  }
};
