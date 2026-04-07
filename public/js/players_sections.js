export const renderPlayers = (players, currentPlayer) => {
  const playersSection = document.querySelector(".players");
  playersSection.replaceChildren();
  const playerTemplate = document.querySelector("#player-template");

  players.forEach(({ name }, id) => {
    const playerClone = playerTemplate.content.cloneNode(true);
    playerClone.querySelector(".player-name").textContent = name;
    playerClone
      .querySelector(".player-name")
      .setAttribute("id", `player-${id + 1}`);
    if (name === currentPlayer.name) {
      playerClone
        .querySelector(".player-profile")
        .setAttribute("class", "player-profile active-player");
    }
    playersSection.appendChild(playerClone);
  });
};
