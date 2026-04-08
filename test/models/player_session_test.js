import { beforeEach, describe, it } from "@std/testing/bdd";
import { assertEquals } from "@std/assert";
import { PlayerSession } from "../../src/models/player_session.js";

const populatePlayerSessions = (playerSessionInstance) => {
  const [sessionId1, playerId1] = ["ab1234cd", "1234"];
  const [sessionId2, playerId2] = ["ab5678cd", "5678"];
  const [sessionId3, playerId3] = ["ab9101cd", "9101"];
  const playerName1 = "PLAYER_UNKNOWN1";
  const playerName2 = "PLAYER_UNKNOWN2";
  const playerName3 = "PLAYER_UNKNOWN3";
  playerSessionInstance.setSession(sessionId1, playerId1);
  playerSessionInstance.setSession(sessionId2, playerId2);
  playerSessionInstance.setSession(sessionId3, playerId3);
  playerSessionInstance.setPlayerId(playerId1, playerName1);
  playerSessionInstance.setPlayerId(playerId2, playerName2);
  playerSessionInstance.setPlayerId(playerId3, playerName3);
};

describe("Player Session tests", () => {
  let playerSessionInstance;
  beforeEach(() => {
    playerSessionInstance = new PlayerSession();
    populatePlayerSessions(playerSessionInstance);
  });

  describe("Setting session", () => {
    it("Providing valid sessionId and playerId", () => {
      const [sessionId, playerId] = ["NEW_SESSION", "NEW_PLAYER"];
      playerSessionInstance.setSession(sessionId, playerId);
      assertEquals(playerSessionInstance.hasSessionId(sessionId), true);
    });
  });

  describe("Setting single playerId", () => {
    it("Providing valid playerId and playerName", () => {
      const [sessionId, playerId] = ["NEW_SESSION", "NEW_PLAYER"];
      const playerName = "NEW_NAME";
      playerSessionInstance.setSession(sessionId, playerId);
      playerSessionInstance.setPlayerId(playerId, playerName);
      assertEquals(playerSessionInstance.hasSessionId(sessionId), true);
      assertEquals(playerSessionInstance.hasPlayerId(playerId), true);
    });
  });

  describe("Setting multiple playerId", () => {
    it("Providing valid playerId and playerName", () => {
      const [sessionId1, playerId1] = ["NEW_SESSION1", "NEW_PLAYER1"];
      const [sessionId2, playerId2] = ["NEW_SESSION2", "NEW_PLAYER2"];
      const [sessionId3, playerId3] = ["NEW_SESSION3", "NEW_PLAYER3"];
      const playerName1 = "NEW_NAME1";
      const playerName2 = "NEW_NAME2";
      const playerName3 = "NEW_NAME3";
      playerSessionInstance.setSession(sessionId1, playerId1);
      playerSessionInstance.setSession(sessionId2, playerId2);
      playerSessionInstance.setSession(sessionId3, playerId3);
      playerSessionInstance.setPlayerId(playerId1, playerName1);
      playerSessionInstance.setPlayerId(playerId2, playerName2);
      playerSessionInstance.setPlayerId(playerId3, playerName3);
      assertEquals(playerSessionInstance.hasSessionId(sessionId1), true);
      assertEquals(playerSessionInstance.hasSessionId(sessionId2), true);
      assertEquals(playerSessionInstance.hasSessionId(sessionId3), true);
      assertEquals(playerSessionInstance.hasPlayerId(playerId1), true);
      assertEquals(playerSessionInstance.hasPlayerId(playerId2), true);
      assertEquals(playerSessionInstance.hasPlayerId(playerId3), true);
    });
  });

  describe("Providing sessionId to get playerId", () => {
    it("sessionId already present in the sessions (i.e. VALID sessionId)", () => {
      const [sessionId1, playerId1] = ["NEW_SESSION1", "NEW_PLAYER1"];
      playerSessionInstance.setSession(sessionId1, playerId1);
      assertEquals(playerSessionInstance.getPlayerId(sessionId1), playerId1);
    });
  });

  describe("Providing playerId to get playerName", () => {
    it("playerId already present in the sessions (i.e. VALID playerId)", () => {
      const [sessionId1, playerId1] = ["NEW_SESSION1", "NEW_PLAYER1"];
      const playerName1 = "NEW_NAME1";
      playerSessionInstance.setSession(sessionId1, playerId1);
      playerSessionInstance.setPlayerId(playerId1, playerName1);
      assertEquals(playerSessionInstance.getPlayerId(sessionId1), playerId1);
      assertEquals(playerSessionInstance.getPlayerName(playerId1), playerName1);
    });
  });

  describe("Providing sessionId to get playerName", () => {
    it("sessionId already present in the sessions (i.e. VALID sessionId)", () => {
      const [sessionId1, playerId1] = ["NEW_SESSION1", "NEW_PLAYER1"];
      const playerName1 = "NEW_NAME1";
      playerSessionInstance.setSession(sessionId1, playerId1);
      playerSessionInstance.setPlayerId(playerId1, playerName1);
      assertEquals(
        playerSessionInstance.getPlayerName(
          playerSessionInstance.getPlayerId(sessionId1),
        ),
        playerName1,
      );
    });
  });

  describe("Getting player ids", () => {
    it("Players ids already present.", () => {
      assertEquals(
        [...playerSessionInstance.getPlayerIds()],
        [
          ["1234", "PLAYER_UNKNOWN1"],
          ["5678", "PLAYER_UNKNOWN2"],
          ["9101", "PLAYER_UNKNOWN3"],
        ],
      );
    });
  });
});
