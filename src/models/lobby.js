import { lobbyStates } from "../config.js";

const { READY, WAITING, STARTED } = lobbyStates;

export class Lobby {
  #minPlayers = 2;
  #maxPlayers = 6;
  #host;
  #lobbyId;
  #players;
  #lobbyState;

  constructor() {
    this.#players = new Set();
    this.#lobbyState = WAITING;
  }

  setPlayer(playerId) {
    this.#players.add(playerId);
  }

  currentState(playerId) {
    if (
      this.#players.size >= this.#minPlayers && this.isHost(playerId) &&
      this.#lobbyState === WAITING
    ) {
      return READY;
    }
    return this.#lobbyState;
  }

  transitionToStart() {
    this.#lobbyState = STARTED;
  }

  // transitionToStart() {
  //   this.#lobbyState = this.#lobbyStates.started;
  // }

  setHost(playerId) {
    this.#host = playerId;
  }

  isHost(playerId) {
    return this.#host === playerId;
  }

  setLobby(lobbyId) {
    this.#lobbyId = lobbyId;
  }

  get lobbyId() {
    return this.#lobbyId;
  }

  getActivePlayersIds() {
    return [...this.#players];
  }

  isFull() {
    return this.#players.size >= this.#maxPlayers;
  }
}
