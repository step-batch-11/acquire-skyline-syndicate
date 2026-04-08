import { beforeEach, describe, it } from "@std/testing/bdd";
import { assertEquals } from "@std/assert";
import { PlayerSession } from "../../src/models/player_session.js";

describe("Player Session tests", () => {
  let playerSessionInstance;
  beforeEach(() => {
    playerSessionInstance = new PlayerSession();
  });

  describe("Setting session", () => {
    it("Providing valid sessionId and playerId", () => {
      const [sessionId, playerId] = ["ab1234cd", "1234"];
      playerSessionInstance.setSession(sessionId, playerId);
      assertEquals(playerSessionInstance.hasSessionId(sessionId), true);
    });
  });

  describe("Setting one playerId", () => {
    it("Providing valid playerId and playerName", () => {
      const [sessionId, playerId] = ["ab1234cd", "1234"];
      const playerName = "PLAYER_UNKNOWN";
      playerSessionInstance.setSession(sessionId, playerId);
      playerSessionInstance.setPlayerId(playerId, playerName);
      assertEquals([...playerSessionInstance.getPlayerIds()], [[
        playerId,
        playerName,
      ]]);
    });
  });

  describe("Setting multiple playerId", () => {
    it("Providing valid playerId and playerName", () => {
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
      assertEquals([...playerSessionInstance.getPlayerIds()], [
        [
          playerId1,
          playerName1,
        ],
        [
          playerId2,
          playerName2,
        ],
        [
          playerId3,
          playerName3,
        ],
      ]);
    });
  });
});
