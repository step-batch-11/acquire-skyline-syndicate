export class GameManager {
  #game;
  #createGame;

  constructor(createGame) {
    this.#createGame = createGame;
  }

  createGame(activePlayers) {
    this.#game = this.#createGame(activePlayers);
  }

  get game() {
    return this.#game;
  }
}
