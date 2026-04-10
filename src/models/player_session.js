export class PlayerSession {
  #sessions;
  #playerIds;
  constructor() {
    this.#sessions = new Map();
    this.#playerIds = new Map();
  }

  set session({ sessionId, playerId }) {
    this.#sessions.set(`${sessionId}`, playerId);
  }

  set playerId({ playerId, playerName }) {
    this.#playerIds.set(`${playerId}`, playerName);
  }

  getPlayerName(playerId) {
    return this.#playerIds.get(`${playerId}`);
  }

  getPlayerId(sessionId) {
    return this.#sessions.get(`${sessionId}`);
  }

  hasSessionId(sessionId) {
    return this.#sessions.has(`${sessionId}`);
  }

  hasPlayerId(playerId) {
    return this.#playerIds.has(`${playerId}`);
  }

  get playerIds() {
    return [...this.#playerIds];
  }
}
