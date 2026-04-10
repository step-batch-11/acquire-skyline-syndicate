import { LOBBY_STATES, MAX_PLAYERS, MIN_PLAYERS } from "../config.js";

const { READY, WAITING, STARTED } = LOBBY_STATES;

export class Lobby {
  #minPlayers = MIN_PLAYERS;
  #maxPlayers = MAX_PLAYERS;
  #host;
  #lobbyId;
  #players;
  #lobbyState;

  constructor() {
    this.#players = new Set();
    this.#lobbyState = WAITING;
  }

  set playerId(playerId) {
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

  set host(playerId) {
    this.#host = playerId;
  }

  isHost(playerId) {
    return this.#host === playerId;
  }

  set lobbyId(lobbyId) {
    this.#lobbyId = lobbyId;
  }

  get lobbyId() {
    return this.#lobbyId;
  }

  get activePlayerIds() {
    return [...this.#players];
  }

  isFull() {
    return this.#players.size >= this.#maxPlayers;
  }
}
