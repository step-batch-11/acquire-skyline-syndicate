export class Lobby {
  #players = [];
  #lobbyState = "waiting";
  #threshold = 2;
  #game;
  constructor() {
  }

  addPlayerToLobby(playerName) {
    this.#players.push(playerName);
  }

  currentState() {
    if (this.#players.length >= this.#threshold) {
      this.#lobbyState = "ready";
    }
    return this.#lobbyState;
  }

  getActivePlayers() {
    return [...this.#players];
  }
}
