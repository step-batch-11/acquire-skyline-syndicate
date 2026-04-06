export class Lobby {
  #minPlayers = 2;
  #maxPlayers = 6;
  #host;
  #lobbyId;
  #players;
  #lobbyState = "waiting";

  constructor() {
    this.#players = new Set();
  }

  setPlayer(playerId) {
    this.#players.add(playerId);
  }

  currentState() {
    if (this.#players.size >= this.#minPlayers) {
      this.#lobbyState = "ready";
    }
    return this.#lobbyState;
  }

  setHost(playerId) {
    this.#host = playerId;
  }

  setLobby(lobbyId) {
    this.#lobbyId = lobbyId;
  }

  get lobbyId() {
    return this.#lobbyId;
  }

  getActivePlayers() {
    return [...this.#players];
  }

  isFull() {
    return this.#players.size >= this.#maxPlayers;
  }
}
