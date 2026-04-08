import { beforeEach, describe, it } from "@std/testing/bdd";
import { assertEquals } from "@std/assert";
import { Lobby } from "../../src/models/lobby.js";
import { LOBBY_STATES } from "../../src/config.js";

describe("Lobby tests", () => {
  const { READY, WAITING, STARTED } = LOBBY_STATES;
  let lobby;
  beforeEach(() => {
    lobby = new Lobby();
  });

  describe("Sets playerId", () => {
    it("Should set playerId in players", () => {
      const playerId = 1;
      lobby.setPlayer(playerId);
      const playerIds = lobby.getActivePlayersIds();
      assertEquals(playerIds.includes(1), true);
    });
  });

  describe("Sets hostId", () => {
    it("Should set hostId in host", () => {
      const playerId = 2;
      lobby.setHost(playerId);

      assertEquals(lobby.isHost(playerId), true);
    });
  });

  describe("Sets lobbyId", () => {
    it("Should set lobbyId in lobbyId", () => {
      const lobbyId = 123;
      lobby.setLobby(lobbyId);
      assertEquals(lobby.lobbyId, lobbyId);
    });
  });

  describe("Checks is lobby full", () => {
    it("Lobby is already full", () => {
      lobby.setPlayer(1);
      lobby.setPlayer(2);
      lobby.setPlayer(3);
      lobby.setPlayer(4);
      lobby.setPlayer(5);
      lobby.setPlayer(6);
      assertEquals(lobby.isFull(), true);
    });
    it("Lobby is not full", () => {
      lobby.setPlayer(1);
      lobby.setPlayer(2);
      lobby.setPlayer(3);
      lobby.setPlayer(4);
      lobby.setPlayer(5);
      assertEquals(lobby.isFull(), false);
    });
  });

  describe("Sets lobbyId", () => {
    const hostId = 1;
    beforeEach(() => {
      lobby.setHost(hostId);
      lobby.setPlayer(hostId);
    });

    it("Should return ready state to host, when 2 players joined including the host", () => {
      lobby.setPlayer(2);
      assertEquals(lobby.currentState(hostId), READY);
    });

    it("Should return waiting state to joinees", () => {
      const joineeId = 2;
      lobby.setPlayer(joineeId);
      assertEquals(lobby.currentState(joineeId), WAITING);
    });
  });

  describe("Transitioning to start of game", () => {
    it("Transitioning the state to started", () => {
      const hostId = 1;
      const joineeId = 2;
      lobby.setHost(hostId);
      lobby.setPlayer(hostId);
      lobby.setPlayer(joineeId);
      lobby.transitionToStart();
      assertEquals(lobby.currentState(hostId), STARTED);
      assertEquals(lobby.currentState(joineeId), STARTED);
    });
  });
});
