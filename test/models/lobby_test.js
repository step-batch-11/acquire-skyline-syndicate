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
      lobby.playerId = playerId;
      const playerIds = lobby.activePlayerIds;
      assertEquals(playerIds.includes(1), true);
    });
  });

  describe("Sets hostId", () => {
    it("Should set hostId in host", () => {
      const playerId = 2;
      lobby.host = playerId;

      assertEquals(lobby.isHost(playerId), true);
    });
  });

  describe("Sets lobbyId", () => {
    it("Should set lobbyId in lobbyId", () => {
      const lobbyId = 123;
      lobby.lobbyId = lobbyId;
      assertEquals(lobby.lobbyId, lobbyId);
    });
  });

  describe("Checks is lobby full", () => {
    it("Lobby is already full", () => {
      lobby.playerId = 1;
      lobby.playerId = 2;
      lobby.playerId = 3;
      lobby.playerId = 4;
      lobby.playerId = 5;
      lobby.playerId = 6;
      assertEquals(lobby.isFull(), true);
    });
    it("Lobby is not full", () => {
      lobby.playerId = 1;
      lobby.playerId = 2;
      lobby.playerId = 3;
      lobby.playerId = 4;
      lobby.playerId = 5;
      assertEquals(lobby.isFull(), false);
    });
  });

  describe("Sets lobbyId", () => {
    const hostId = 1;
    beforeEach(() => {
      lobby.host = hostId;
      lobby.playerId = hostId;
    });

    it("Should return ready state to host, when 2 players joined including the host", () => {
      lobby.playerId = 2;
      assertEquals(lobby.currentState(hostId), READY);
    });

    it("Should return waiting state to joinees", () => {
      const joineeId = 2;
      lobby.playerId = joineeId;
      assertEquals(lobby.currentState(joineeId), WAITING);
    });
  });

  describe("Transitioning to start of game", () => {
    it("Transitioning the state to started", () => {
      const hostId = 1;
      const joineeId = 2;
      lobby.host = hostId;
      lobby.playerId = hostId;
      lobby.playerId = joineeId;
      lobby.transitionToStart();
      assertEquals(lobby.currentState(hostId), STARTED);
      assertEquals(lobby.currentState(joineeId), STARTED);
    });
  });
});
