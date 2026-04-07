export class playerSession {
  #sessions;
  #playerIds;
  constructor() {
    this.#sessions = new Map();
    this.#playerIds = new Map();
  }

  setSession(sessionId, playerId) {
    this.#sessions.set(`${sessionId}`, playerId);
  }

  setPlayerId(playerId, playerName) {
    this.#playerIds.set(`${playerId}`, playerName);
  }

  get sessions() {
    return this.#sessions;
  }

  get playerIds() {
    return this.#playerIds;
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

  getPlayerIds() {
    return this.#playerIds;
  }
}
