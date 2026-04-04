export class Lobby {
  #game;
  #players = [];
  #lobbyState = "waiting";
  #threshold = 2;
  constructor(game) {
    this.#game = game;
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
