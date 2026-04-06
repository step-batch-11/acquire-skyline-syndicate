export class playerSession {
  #sessions;
  constructor() {
    this.#sessions = new Map();
  }

  addPlayer(sessionId, name) {
    this.#sessions.set(`${sessionId}`, name);
  }

  get sessions() {
    return this.#sessions;
  }

  getPlayerName(sessionId) {
    return this.#sessions.get(`${sessionId}`);
  }

  hasSessionId(sessionId) {
    return this.#sessions.has(`${sessionId}`);
  }
}
